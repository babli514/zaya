using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
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

public interface IStructuredFinancialExtractionProvider
{
    string ProviderName { get; }
    Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken);
}

public interface IFinancialExtractionProviderSelector
{
    IStructuredFinancialExtractionProvider Select(FinancialExtractionProviderSelectionInput input);
}

public interface IFinancialFieldExtractor
{
    Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken);
}

public interface IFinancialDocumentValidator
{
    FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType);
}

public interface IConfidenceScoringService
{
    decimal CalculateOverallConfidence(ConfidenceScoringInput input);
}

public class DocumentProcessingService : IDocumentProcessingService
{
    private readonly AppDbContext _dbContext;
    private readonly IOcrRouter _ocrRouter;
    private readonly IEnumerable<IOcrProvider> _ocrProviders;
    private readonly ILanguageDetectionService _languageDetectionService;
    private readonly IFinancialFieldExtractor _financialFieldExtractor;
    private readonly IFinancialDocumentValidator _financialDocumentValidator;
    private readonly IConfidenceScoringService _confidenceScoringService;
    private readonly IDocumentService _documentService;
    private readonly ILogger<DocumentProcessingService> _logger;

    public DocumentProcessingService(
        AppDbContext dbContext,
        IOcrRouter ocrRouter,
        IEnumerable<IOcrProvider> ocrProviders,
        ILanguageDetectionService languageDetectionService,
        IFinancialFieldExtractor financialFieldExtractor,
        IFinancialDocumentValidator financialDocumentValidator,
        IConfidenceScoringService confidenceScoringService,
        IDocumentService documentService,
        ILogger<DocumentProcessingService> logger)
    {
        _dbContext = dbContext;
        _ocrRouter = ocrRouter;
        _ocrProviders = ocrProviders;
        _languageDetectionService = languageDetectionService;
        _financialFieldExtractor = financialFieldExtractor;
        _financialDocumentValidator = financialDocumentValidator;
        _confidenceScoringService = confidenceScoringService;
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
        document.ProcessedAtUtc = null;
        document.FailureReason = null;
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
                ExtractionJobId = extractionJob.Id,
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
            var primaryStopwatch = Stopwatch.StartNew();
            var primaryOcrResult = await primaryProvider.ExtractAsync(primaryRequest, cancellationToken);
            primaryStopwatch.Stop();
            var primaryLatencyMs = primaryStopwatch.ElapsedMilliseconds;
            _logger.LogInformation("OCR primary completed. DocumentId={DocumentId}, Provider={Provider}, LatencyMs={LatencyMs}", document.Id, primaryOcrResult.ProviderName, primaryLatencyMs);

            extractionJob.PrimaryOcrEngine = primaryOcrResult.OcrEngineType;
            extractionJob.PrimaryProviderName = primaryOcrResult.ProviderName;
            extractionJob.PrimaryModelName = primaryOcrResult.ModelName;
            extractionJob.PrimaryLatencyMs = primaryLatencyMs;
            extractionJob.EstimatedProviderCost = primaryOcrResult.ProviderCostEstimate;
            extractionJob.PageCount = primaryOcrResult.PageCount;
            extractionJob.FallbackUsed = false;

            var processing = await RunExtractionAndValidationAsync(document, primaryOcrResult, cancellationToken);
            var primaryProcessing = CloneAttempt(processing);
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
            var fallbackNeeded = fallbackReason != null;
            var geminiFlashLiteUsed = processing.OcrResult.OcrEngineType == OcrEngineType.GeminiFlashLite
                || (processing.OcrResult.ProviderName?.Contains("gemini", StringComparison.OrdinalIgnoreCase) ?? false)
                || extractionJob.FallbackOcrEngine == OcrEngineType.GeminiFlashLite;
            var geminiUsedAfterLowConfidencePrimary = fallbackNeeded
                && processing.OcrResult.OcrEngineType == OcrEngineType.GeminiFlashLite
                && (!primaryProcessing.OcrResult.Confidence.HasValue || primaryProcessing.OcrResult.Confidence.Value < route.MinimumOcrConfidence);
            var geminiExtractionConflictsWithDeterministic = extractionJob.FallbackUsed
                && processing.OcrResult.OcrEngineType == OcrEngineType.GeminiFlashLite
                && HasMeaningfulExtractionConflict(primaryProcessing.ExtractionResult, processing.ExtractionResult, document.DocumentType);
            var finalConfidence = _confidenceScoringService.CalculateOverallConfidence(new ConfidenceScoringInput
            {
                DocumentType = document.DocumentType,
                ExtractionResult = processing.ExtractionResult,
                ValidationResult = processing.ValidationResult,
                OcrConfidence = processing.OcrResult.Confidence,
                StructuredExtractionConfidence = processing.ExtractionResult.Confidence,
                RequestedDocumentLanguage = document.DocumentLanguage,
                DetectedDocumentLanguage = processing.DetectedLanguage,
                RawText = processing.OcrResult.RawText,
                FallbackNeeded = fallbackNeeded,
                FallbackUsed = extractionJob.FallbackUsed,
                GeminiFlashLiteUsed = geminiFlashLiteUsed,
                GeminiUsedAfterLowConfidencePrimary = geminiUsedAfterLowConfidencePrimary,
                GeminiExtractionConflictsWithDeterministic = geminiExtractionConflictsWithDeterministic
            });
            extractionJob.DetectedLanguage = processing.DetectedLanguage;
            extractionJob.RawText = processing.OcrResult.RawText;
            extractionJob.OverallConfidence = finalConfidence;
            extractionJob.PageCount ??= processing.OcrResult.PageCount;
            extractionJob.EstimatedProviderCost ??= processing.OcrResult.ProviderCostEstimate;
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
                && finalConfidence >= route.AutoCompleteConfidenceThreshold
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
            ExtractionJobId = ocrResult.ExtractionJobId,
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
            ExtractionJobId = extractionJob.Id,
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
            var fallbackStopwatch = Stopwatch.StartNew();
            var fallbackOcrResult = await fallbackProvider.ExtractAsync(fallbackRequest, cancellationToken);
            fallbackStopwatch.Stop();
            var fallbackLatencyMs = fallbackStopwatch.ElapsedMilliseconds;
            _logger.LogInformation("OCR fallback completed. DocumentId={DocumentId}, Provider={Provider}, LatencyMs={LatencyMs}", document.Id, fallbackOcrResult.ProviderName, fallbackLatencyMs);

            var fallbackAttempt = await RunExtractionAndValidationAsync(document, fallbackOcrResult, cancellationToken);
            extractionJob.FallbackOcrEngine = fallbackOcrResult.OcrEngineType;
            extractionJob.FallbackProviderName = fallbackOcrResult.ProviderName;
            extractionJob.FallbackModelName = fallbackOcrResult.ModelName;
            extractionJob.FallbackLatencyMs = fallbackLatencyMs;

            extractionJob.PageCount ??= fallbackOcrResult.PageCount;
            extractionJob.EstimatedProviderCost = (extractionJob.EstimatedProviderCost ?? 0m) + (fallbackOcrResult.ProviderCostEstimate ?? 0m);

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

    private static ProcessingAttempt CloneAttempt(ProcessingAttempt source)
    {
        return new ProcessingAttempt
        {
            OcrResult = new OcrResult
            {
                RawText = source.OcrResult.RawText,
                PageCount = source.OcrResult.PageCount,
                Warnings = source.OcrResult.Warnings.ToList(),
                RequestedDocumentLanguage = source.OcrResult.RequestedDocumentLanguage,
                DetectedLanguage = source.OcrResult.DetectedLanguage,
                PreferredVisionProvider = source.OcrResult.PreferredVisionProvider,
                OcrEngineType = source.OcrResult.OcrEngineType,
                ProviderName = source.OcrResult.ProviderName,
                ModelName = source.OcrResult.ModelName,
                ProviderLatencyMs = source.OcrResult.ProviderLatencyMs,
                ProviderCostEstimate = source.OcrResult.ProviderCostEstimate,
                Confidence = source.OcrResult.Confidence
            },
            ExtractionResult = CloneExtractionResult(source.ExtractionResult),
            ValidationResult = new FinancialValidationResult
            {
                IsValid = source.ValidationResult.IsValid,
                ConfidenceAdjustment = source.ValidationResult.ConfidenceAdjustment,
                ValidationSummary = source.ValidationResult.ValidationSummary,
                Warnings = source.ValidationResult.Warnings.Select(w => new ValidationWarning
                {
                    Code = w.Code,
                    MessageEn = w.MessageEn,
                    MessageFr = w.MessageFr,
                    Severity = w.Severity,
                    FieldName = w.FieldName
                }).ToList(),
                RequestedDocumentLanguage = source.ValidationResult.RequestedDocumentLanguage,
                DetectedLanguage = source.ValidationResult.DetectedLanguage,
                PreferredVisionProvider = source.ValidationResult.PreferredVisionProvider,
                OcrEngineType = source.ValidationResult.OcrEngineType,
                ProviderName = source.ValidationResult.ProviderName,
                ModelName = source.ValidationResult.ModelName,
                ProviderLatencyMs = source.ValidationResult.ProviderLatencyMs,
                ProviderCostEstimate = source.ValidationResult.ProviderCostEstimate
            },
            DetectedLanguage = source.DetectedLanguage
        };
    }

    private static FinancialExtractionResult CloneExtractionResult(FinancialExtractionResult source)
    {
        return new FinancialExtractionResult
        {
            VendorName = source.VendorName,
            CustomerName = source.CustomerName,
            DocumentNumber = source.DocumentNumber,
            DocumentDate = source.DocumentDate,
            DueDate = source.DueDate,
            Currency = source.Currency,
            Subtotal = source.Subtotal,
            Gst = source.Gst,
            Qst = source.Qst,
            Hst = source.Hst,
            Pst = source.Pst,
            Tip = source.Tip,
            Discount = source.Discount,
            Total = source.Total,
            LineItems = source.LineItems.Select(li => new FinancialExtractionLineItem
            {
                Description = li.Description,
                Quantity = li.Quantity,
                UnitPrice = li.UnitPrice,
                Amount = li.Amount
            }).ToList(),
            Confidence = source.Confidence,
            RequestedDocumentLanguage = source.RequestedDocumentLanguage,
            DetectedLanguage = source.DetectedLanguage,
            PreferredVisionProvider = source.PreferredVisionProvider,
            OcrEngineType = source.OcrEngineType,
            ProviderName = source.ProviderName,
            ModelName = source.ModelName,
            ProviderLatencyMs = source.ProviderLatencyMs,
            ProviderCostEstimate = source.ProviderCostEstimate
        };
    }

    private static bool HasMeaningfulExtractionConflict(FinancialExtractionResult deterministic, FinancialExtractionResult fallback, DocumentType documentType)
    {
        if (deterministic.Total.HasValue && fallback.Total.HasValue && Math.Abs(deterministic.Total.Value - fallback.Total.Value) > 0.02m)
        {
            return true;
        }

        if (deterministic.DocumentDate.HasValue && fallback.DocumentDate.HasValue && deterministic.DocumentDate.Value.Date != fallback.DocumentDate.Value.Date)
        {
            return true;
        }

        if (documentType == DocumentType.Invoice && !string.IsNullOrWhiteSpace(deterministic.DocumentNumber) && !string.IsNullOrWhiteSpace(fallback.DocumentNumber)
            && !string.Equals(deterministic.DocumentNumber, fallback.DocumentNumber, StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        return false;
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
