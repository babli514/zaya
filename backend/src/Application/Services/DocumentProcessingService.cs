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
            Status = ExtractionJobStatus.Running,
            RequestedDocumentLanguage = document.DocumentLanguage
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
            extractionJob.PrimaryProviderLatencyMs = primaryOcrResult.ProviderLatencyMs;
            extractionJob.FallbackUsed = false;

            var processing = await RunExtractionAndValidationAsync(document, primaryOcrResult, cancellationToken);
            var processingWarnings = new List<string>();

            var fallbackReason = ResolveFallbackReason(route, primaryOcrResult, processing.ValidationResult);
            if (fallbackReason != null)
            {
                processingWarnings.Add($"Fallback attempted: {fallbackReason}");
                var fallbackApplied = await TryApplyFallbackAsync(document, route, extractionJob, processing, cancellationToken);
                if (!fallbackApplied)
                {
                    processingWarnings.Add("Fallback result was not selected.");
                }
            }

            var allWarnings = BuildWarnings(processing.ValidationResult, processing.OcrResult, processingWarnings);
            var finalConfidence = CalculateOverallConfidence(processing.ExtractionResult.Confidence, processing.OcrResult.Confidence, processing.ValidationResult.ConfidenceAdjustment);
            extractionJob.DetectedLanguage = processing.DetectedLanguage;
            extractionJob.RawText = processing.OcrResult.RawText;
            extractionJob.OverallConfidence = finalConfidence;
            extractionJob.WarningsJson = JsonSerializer.Serialize(allWarnings);
            extractionJob.Status = ExtractionJobStatus.Completed;
            extractionJob.CompletedAtUtc = DateTime.UtcNow;

            var extractedFinancialDocument = await _dbContext.ExtractedFinancialDocuments
                .Include(e => e.LineItems)
                .FirstOrDefaultAsync(e => e.ExtractionJobId == extractionJob.Id, cancellationToken);

            if (extractedFinancialDocument == null)
            {
                extractedFinancialDocument = new ExtractedFinancialDocument
                {
                    Id = Guid.NewGuid(),
                    DocumentId = document.Id,
                    ExtractionJobId = extractionJob.Id,
                    VendorName = "Unknown"
                };
                _dbContext.ExtractedFinancialDocuments.Add(extractedFinancialDocument);
            }

            extractedFinancialDocument.VendorName = string.IsNullOrWhiteSpace(processing.ExtractionResult.VendorName) ? "Unknown" : processing.ExtractionResult.VendorName;
            extractedFinancialDocument.CustomerName = processing.ExtractionResult.CustomerName;
            extractedFinancialDocument.DocumentNumber = processing.ExtractionResult.DocumentNumber;
            extractedFinancialDocument.DocumentDate = processing.ExtractionResult.DocumentDate;
            extractedFinancialDocument.DueDate = processing.ExtractionResult.DueDate;
            extractedFinancialDocument.Currency = processing.ExtractionResult.Currency;
            extractedFinancialDocument.Subtotal = processing.ExtractionResult.Subtotal;
            extractedFinancialDocument.Gst = processing.ExtractionResult.Gst;
            extractedFinancialDocument.Qst = processing.ExtractionResult.Qst;
            extractedFinancialDocument.Hst = processing.ExtractionResult.Hst;
            extractedFinancialDocument.Pst = processing.ExtractionResult.Pst;
            extractedFinancialDocument.Tip = processing.ExtractionResult.Tip;
            extractedFinancialDocument.Total = processing.ExtractionResult.Total;
            extractedFinancialDocument.Confidence = finalConfidence;
            extractedFinancialDocument.DetectedLanguage = processing.DetectedLanguage;
            extractedFinancialDocument.IsValidated = processing.ValidationResult.IsValid;
            extractedFinancialDocument.ValidationSummary = processing.ValidationResult.ValidationSummary;

            if (extractedFinancialDocument.LineItems.Count > 0)
            {
                _dbContext.ExtractedLineItems.RemoveRange(extractedFinancialDocument.LineItems);
                extractedFinancialDocument.LineItems.Clear();
            }

            foreach (var lineItem in processing.ExtractionResult.LineItems)
            {
                extractedFinancialDocument.LineItems.Add(new ExtractedLineItem
                {
                    Id = Guid.NewGuid(),
                    Description = lineItem.Description,
                    Quantity = lineItem.Quantity,
                    UnitPrice = lineItem.UnitPrice,
                    Amount = lineItem.Amount,
                    Confidence = null
                });
            }

            document.DocumentLanguage = processing.DetectedLanguage;
            var hasValidationIssues = processing.ValidationResult.Warnings.Any(w => w.Severity != ValidationSeverity.Info);
            document.ProcessingStatus = processing.ValidationResult.IsValid
                && !hasValidationIssues
                && finalConfidence.HasValue
                && finalConfidence.Value >= route.AutoCompleteConfidenceThreshold
                ? ProcessingStatus.Completed
                : ProcessingStatus.NeedsReview;
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

    private static string? ResolveFallbackReason(OcrRouteDecision route, OcrResult primaryResult, FinancialValidationResult validationResult)
    {
        if (!route.EnableFallback)
        {
            return null;
        }

        var rawLength = primaryResult.RawText.Count(ch => !char.IsWhiteSpace(ch));
        if (rawLength < route.MinimumRawTextLength)
        {
            if (route.IsPdf)
            {
                return "pdf_raw_text_too_short";
            }

            if (route.IsImage)
            {
                return "image_raw_text_too_short";
            }
        }

        if (route.IsImage && route.EnableFallbackOnLowConfidence)
        {
            var confidence = primaryResult.Confidence;
            if (!confidence.HasValue || confidence.Value < route.MinimumOcrConfidence)
            {
                return "image_low_ocr_confidence";
            }
        }

        if (route.EnableFallbackOnValidationFailure && HasBadValidationFailure(validationResult))
        {
            return "validation_failed_badly";
        }

        return null;
    }

    private static bool HasBadValidationFailure(FinancialValidationResult validationResult)
    {
        if (validationResult.IsValid)
        {
            return false;
        }

        return validationResult.Warnings.Any(w => w.Severity == ValidationSeverity.Error);
    }

    private async Task<bool> TryApplyFallbackAsync(Document document, OcrRouteDecision route, ExtractionJob extractionJob, ProcessingAttempt primaryAttempt, CancellationToken cancellationToken)
    {
        var fallbackProvider = _ocrProviders.FirstOrDefault(p => p.EngineType == route.FallbackOcrEngineType)
            ?? _ocrProviders.FirstOrDefault(p => p.EngineType == OcrEngineType.VisionFallback);
        if (fallbackProvider == null)
        {
            return false;
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
            extractionJob.FallbackOcrEngine = fallbackOcrResult.OcrEngineType;
            extractionJob.FallbackProviderName = fallbackOcrResult.ProviderName;
            extractionJob.FallbackModelName = fallbackOcrResult.ModelName;
            extractionJob.FallbackProviderLatencyMs = fallbackOcrResult.ProviderLatencyMs;

            if (fallbackAttempt.ValidationResult.IsValid || !primaryAttempt.ValidationResult.IsValid)
            {
                extractionJob.FallbackUsed = true;
                primaryAttempt.OcrResult = fallbackAttempt.OcrResult;
                primaryAttempt.ExtractionResult = fallbackAttempt.ExtractionResult;
                primaryAttempt.ValidationResult = fallbackAttempt.ValidationResult;
                primaryAttempt.DetectedLanguage = fallbackAttempt.DetectedLanguage;
                return true;
            }

            extractionJob.FallbackUsed = false;
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogWarning("OCR fallback failed. DocumentId={DocumentId}, Provider={Provider}, Message={Message}", document.Id, fallbackProvider.EngineType, ex.Message);
            extractionJob.FallbackUsed = false;
            return false;
        }
    }

    private static decimal? CalculateOverallConfidence(decimal? extractionConfidence, decimal? ocrConfidence, decimal adjustment)
    {
        var baseConfidence = extractionConfidence ?? ocrConfidence;
        if (!baseConfidence.HasValue)
        {
            return null;
        }

        var adjusted = baseConfidence.Value + adjustment;
        if (adjusted < 0m)
        {
            return 0m;
        }

        if (adjusted > 1m)
        {
            return 1m;
        }

        return adjusted;
    }

    private static List<ValidationWarning> BuildWarnings(FinancialValidationResult validationResult, OcrResult ocrResult, IReadOnlyCollection<string>? processWarnings = null)
    {
        var allWarnings = new List<ValidationWarning>();
        allWarnings.AddRange(validationResult.Warnings);
        allWarnings.AddRange(ocrResult.Warnings.Select(w => new ValidationWarning
        {
            Code = "OCR_WARNING",
            MessageEn = w,
            MessageFr = w,
            Severity = ValidationSeverity.Warning
        }));

        if (processWarnings != null)
        {
            allWarnings.AddRange(processWarnings.Select(w => new ValidationWarning
            {
                Code = "OCR_ROUTING",
                MessageEn = w,
                MessageFr = w,
                Severity = ValidationSeverity.Info
            }));
        }

        return allWarnings;
    }
}
