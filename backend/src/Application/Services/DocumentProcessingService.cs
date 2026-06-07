using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace FinancialOCR.Application.Services;

public interface IDocumentProcessingService
{
    Task<DocumentDetailDto> ProcessDocumentAsync(Guid documentId, CancellationToken cancellationToken);
}

public interface IOcrRouter
{
    Task<OcrRouteDecision> SelectRouteAsync(Document document, CancellationToken cancellationToken);
}

public interface IOcrProvider
{
    OcrEngineType EngineType { get; }
    Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken);
}

public interface ILanguageDetectionService
{
    DocumentLanguage DetectLanguage(string rawText);
}

public interface IFinancialFieldExtractor
{
    Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken);
}

public interface IFinancialDocumentValidator
{
    FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType);
}

public class DocumentProcessingService : IDocumentProcessingService
{
    private readonly AppDbContext _dbContext;
    private readonly IOcrRouter _ocrRouter;
    private readonly IEnumerable<IOcrProvider> _ocrProviders;
    private readonly ILanguageDetectionService _languageDetectionService;
    private readonly IFinancialFieldExtractor _financialFieldExtractor;
    private readonly IFinancialDocumentValidator _financialDocumentValidator;
    private readonly IDocumentService _documentService;
    private readonly ILogger<DocumentProcessingService> _logger;

    public DocumentProcessingService(
        AppDbContext dbContext,
        IOcrRouter ocrRouter,
        IEnumerable<IOcrProvider> ocrProviders,
        ILanguageDetectionService languageDetectionService,
        IFinancialFieldExtractor financialFieldExtractor,
        IFinancialDocumentValidator financialDocumentValidator,
        IDocumentService documentService,
        ILogger<DocumentProcessingService> logger)
    {
        _dbContext = dbContext;
        _ocrRouter = ocrRouter;
        _ocrProviders = ocrProviders;
        _languageDetectionService = languageDetectionService;
        _financialFieldExtractor = financialFieldExtractor;
        _financialDocumentValidator = financialDocumentValidator;
        _documentService = documentService;
        _logger = logger;
    }

    public async Task<DocumentDetailDto> ProcessDocumentAsync(Guid documentId, CancellationToken cancellationToken)
    {
        var document = await _dbContext.Documents
            .FirstOrDefaultAsync(d => d.Id == documentId, cancellationToken);

        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {documentId} not found");
        }

        document.ProcessingStatus = ProcessingStatus.Processing;
        await _dbContext.SaveChangesAsync(cancellationToken);

        var extractionJob = new ExtractionJob
        {
            Id = Guid.NewGuid(),
            DocumentId = document.Id,
            StartedAtUtc = DateTime.UtcNow,
            Status = ExtractionJobStatus.Running
        };
        _dbContext.ExtractionJobs.Add(extractionJob);
        await _dbContext.SaveChangesAsync(cancellationToken);

        try
        {
            var route = await _ocrRouter.SelectRouteAsync(document, cancellationToken);
            var primaryProvider = _ocrProviders.FirstOrDefault(p => p.EngineType == route.OcrEngineType);
            if (primaryProvider == null)
            {
                throw new NotSupportedException($"No OCR provider registered for engine type '{route.OcrEngineType}'.");
            }

            var primaryRequest = new OcrRequest
            {
                DocumentId = document.Id,
                FilePath = document.StoragePath ?? string.Empty,
                ContentType = document.ContentType,
                RequestedDocumentLanguage = document.DocumentLanguage,
                DetectedLanguage = route.DetectedLanguage,
                PreferredVisionProvider = route.PreferredVisionProvider,
                OcrEngineType = primaryProvider.EngineType,
                ProviderName = route.ProviderName,
                ModelName = route.ModelName
            };

            _logger.LogInformation("OCR primary start. DocumentId={DocumentId}, Provider={Provider}", document.Id, primaryProvider.EngineType);
            var primaryOcrResult = await primaryProvider.ExtractAsync(primaryRequest, cancellationToken);
            _logger.LogInformation("OCR primary completed. DocumentId={DocumentId}, Provider={Provider}, LatencyMs={LatencyMs}", document.Id, primaryOcrResult.ProviderName, primaryOcrResult.ProviderLatencyMs);

            extractionJob.PrimaryOcrEngine = primaryOcrResult.OcrEngineType;
            extractionJob.PrimaryProviderName = primaryOcrResult.ProviderName;
            extractionJob.PrimaryModelName = primaryOcrResult.ModelName;

            var processing = await RunExtractionAndValidationAsync(document, primaryOcrResult, cancellationToken);

            if (ShouldUseFallback(route, primaryOcrResult, processing.ValidationResult))
            {
                await TryApplyFallbackAsync(document, route, extractionJob, processing, cancellationToken);
            }

            var allWarnings = BuildWarnings(processing.ValidationResult, processing.OcrResult);
            extractionJob.DetectedLanguage = processing.DetectedLanguage;
            extractionJob.RawText = processing.OcrResult.RawText;
            extractionJob.OverallConfidence = processing.ExtractionResult.Confidence;
            extractionJob.WarningsJson = JsonSerializer.Serialize(allWarnings);
            extractionJob.Status = ExtractionJobStatus.Completed;
            extractionJob.CompletedAtUtc = DateTime.UtcNow;

            var extractedFinancialDocument = new ExtractedFinancialDocument
            {
                Id = Guid.NewGuid(),
                DocumentId = document.Id,
                ExtractionJobId = extractionJob.Id,
                VendorName = string.IsNullOrWhiteSpace(processing.ExtractionResult.VendorName) ? "Unknown" : processing.ExtractionResult.VendorName,
                CustomerName = processing.ExtractionResult.CustomerName,
                DocumentNumber = processing.ExtractionResult.DocumentNumber,
                DocumentDate = processing.ExtractionResult.DocumentDate,
                DueDate = processing.ExtractionResult.DueDate,
                Currency = processing.ExtractionResult.Currency,
                Subtotal = processing.ExtractionResult.Subtotal,
                Gst = processing.ExtractionResult.Gst,
                Qst = processing.ExtractionResult.Qst,
                Hst = processing.ExtractionResult.Hst,
                Pst = processing.ExtractionResult.Pst,
                Tip = processing.ExtractionResult.Tip,
                Total = processing.ExtractionResult.Total,
                Confidence = processing.ExtractionResult.Confidence,
                DetectedLanguage = processing.DetectedLanguage,
                IsValidated = processing.ValidationResult.IsValid,
                ValidationSummary = processing.ValidationResult.Warnings.Count == 0
                    ? "No validation warnings"
                    : string.Join("; ", processing.ValidationResult.Warnings.Select(w => w.Message))
            };

            _dbContext.ExtractedFinancialDocuments.Add(extractedFinancialDocument);

            document.DocumentLanguage = processing.DetectedLanguage;
            document.ProcessingStatus = processing.ValidationResult.IsValid ? ProcessingStatus.Completed : ProcessingStatus.NeedsReview;
            document.ProcessedAtUtc = DateTime.UtcNow;
            document.FailureReason = null;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await _documentService.GetDocumentAsync(document.Id, cancellationToken);
        }
        catch (Exception ex)
        {
            extractionJob.Status = ExtractionJobStatus.Failed;
            extractionJob.CompletedAtUtc = DateTime.UtcNow;
            extractionJob.ErrorMessage = ex.Message;

            document.ProcessingStatus = ProcessingStatus.Failed;
            document.FailureReason = ex.Message;
            document.ProcessedAtUtc = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);
            throw;
        }
    }

    private sealed class ProcessingAttempt
    {
        public OcrResult OcrResult { get; set; } = new();
        public FinancialExtractionResult ExtractionResult { get; set; } = new();
        public FinancialValidationResult ValidationResult { get; set; } = new();
        public DocumentLanguage DetectedLanguage { get; set; }
    }

    private async Task<ProcessingAttempt> RunExtractionAndValidationAsync(Document document, OcrResult ocrResult, CancellationToken cancellationToken)
    {
        var detectedLanguage = document.DocumentLanguage == DocumentLanguage.Unknown
            ? _languageDetectionService.DetectLanguage(ocrResult.RawText)
            : document.DocumentLanguage;

        var extractionInput = new FinancialExtractionInput
        {
            DocumentId = document.Id,
            RawText = ocrResult.RawText,
            DocumentType = document.DocumentType,
            RequestedDocumentLanguage = document.DocumentLanguage,
            DetectedLanguage = detectedLanguage,
            PreferredVisionProvider = ocrResult.PreferredVisionProvider,
            OcrEngineType = ocrResult.OcrEngineType,
            ProviderName = ocrResult.ProviderName,
            ModelName = ocrResult.ModelName,
            ProviderLatencyMs = ocrResult.ProviderLatencyMs,
            ProviderCostEstimate = ocrResult.ProviderCostEstimate
        };

        var extractionResult = await _financialFieldExtractor.ExtractAsync(extractionInput, cancellationToken);
        var validationResult = _financialDocumentValidator.Validate(extractionResult, document.DocumentType);

        return new ProcessingAttempt
        {
            OcrResult = ocrResult,
            ExtractionResult = extractionResult,
            ValidationResult = validationResult,
            DetectedLanguage = detectedLanguage
        };
    }

    private static bool ShouldUseFallback(OcrRouteDecision route, OcrResult primaryResult, FinancialValidationResult validationResult)
    {
        if (!route.UseVisionFallback)
        {
            return false;
        }

        var nonWhitespaceLength = primaryResult.RawText.Count(ch => !char.IsWhiteSpace(ch));
        var lowText = nonWhitespaceLength < route.MinRawTextLength;
        var lowTextForScannedPdf = route.UseForScannedPdf
            && primaryResult.OcrEngineType == OcrEngineType.NativePdfText
            && lowText;
        var lowTextForNonPdf = primaryResult.OcrEngineType != OcrEngineType.NativePdfText && lowText;
        var lowConfidence = route.UseForLowConfidenceResults
            && (!primaryResult.Confidence.HasValue || primaryResult.Confidence.Value < route.MinPrimaryOcrConfidence);
        var validationFailed = route.UseForValidationFailures && !validationResult.IsValid;

        return lowTextForScannedPdf || lowTextForNonPdf || lowConfidence || validationFailed;
    }

    private async Task TryApplyFallbackAsync(Document document, OcrRouteDecision route, ExtractionJob extractionJob, ProcessingAttempt primaryAttempt, CancellationToken cancellationToken)
    {
        var fallbackProvider = _ocrProviders.FirstOrDefault(p => p.EngineType == route.FallbackOcrEngineType)
            ?? _ocrProviders.FirstOrDefault(p => p.EngineType == OcrEngineType.VisionFallback);
        if (fallbackProvider == null)
        {
            return;
        }

        var fallbackRequest = new OcrRequest
        {
            DocumentId = document.Id,
            FilePath = document.StoragePath ?? string.Empty,
            ContentType = document.ContentType,
            RequestedDocumentLanguage = document.DocumentLanguage,
            DetectedLanguage = primaryAttempt.DetectedLanguage,
            PreferredVisionProvider = route.PreferredVisionProvider,
            OcrEngineType = fallbackProvider.EngineType,
            ProviderName = route.PreferredVisionProvider,
            ModelName = string.Empty
        };

        try
        {
            _logger.LogInformation("OCR fallback start. DocumentId={DocumentId}, Provider={Provider}", document.Id, fallbackProvider.EngineType);
            var fallbackOcrResult = await fallbackProvider.ExtractAsync(fallbackRequest, cancellationToken);
            _logger.LogInformation("OCR fallback completed. DocumentId={DocumentId}, Provider={Provider}, LatencyMs={LatencyMs}", document.Id, fallbackOcrResult.ProviderName, fallbackOcrResult.ProviderLatencyMs);

            var fallbackAttempt = await RunExtractionAndValidationAsync(document, fallbackOcrResult, cancellationToken);
            extractionJob.FallbackUsed = true;
            extractionJob.FallbackOcrEngine = fallbackOcrResult.OcrEngineType;
            extractionJob.FallbackProviderName = fallbackOcrResult.ProviderName;
            extractionJob.FallbackModelName = fallbackOcrResult.ModelName;

            if (fallbackAttempt.ValidationResult.IsValid || !primaryAttempt.ValidationResult.IsValid)
            {
                primaryAttempt.OcrResult = fallbackAttempt.OcrResult;
                primaryAttempt.ExtractionResult = fallbackAttempt.ExtractionResult;
                primaryAttempt.ValidationResult = fallbackAttempt.ValidationResult;
                primaryAttempt.DetectedLanguage = fallbackAttempt.DetectedLanguage;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning("OCR fallback failed. DocumentId={DocumentId}, Provider={Provider}, Message={Message}", document.Id, fallbackProvider.EngineType, ex.Message);
        }
    }

    private static List<ValidationWarning> BuildWarnings(FinancialValidationResult validationResult, OcrResult ocrResult)
    {
        var allWarnings = new List<ValidationWarning>();
        allWarnings.AddRange(validationResult.Warnings);
        allWarnings.AddRange(ocrResult.Warnings.Select(w => new ValidationWarning
        {
            Code = "OCR_WARNING",
            Message = w
        }));
        return allWarnings;
    }
}
