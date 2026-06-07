using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
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

    public DocumentProcessingService(
        AppDbContext dbContext,
        IOcrRouter ocrRouter,
        IEnumerable<IOcrProvider> ocrProviders,
        ILanguageDetectionService languageDetectionService,
        IFinancialFieldExtractor financialFieldExtractor,
        IFinancialDocumentValidator financialDocumentValidator,
        IDocumentService documentService)
    {
        _dbContext = dbContext;
        _ocrRouter = ocrRouter;
        _ocrProviders = ocrProviders;
        _languageDetectionService = languageDetectionService;
        _financialFieldExtractor = financialFieldExtractor;
        _financialDocumentValidator = financialDocumentValidator;
        _documentService = documentService;
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
            var provider = _ocrProviders.FirstOrDefault(p => p.EngineType == route.OcrEngineType)
                ?? _ocrProviders.First(p => p.EngineType == OcrEngineType.VisionFallback);

            var ocrRequest = new OcrRequest
            {
                DocumentId = document.Id,
                FilePath = document.StoragePath ?? string.Empty,
                ContentType = document.ContentType,
                RequestedDocumentLanguage = document.DocumentLanguage,
                DetectedLanguage = route.DetectedLanguage,
                PreferredVisionProvider = route.PreferredVisionProvider,
                OcrEngineType = provider.EngineType,
                ProviderName = route.ProviderName,
                ModelName = route.ModelName
            };

            var ocrResult = await provider.ExtractAsync(ocrRequest, cancellationToken);
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
            var allWarnings = new List<ValidationWarning>();
            allWarnings.AddRange(validationResult.Warnings);
            allWarnings.AddRange(ocrResult.Warnings.Select(w => new ValidationWarning
            {
                Code = "OCR_WARNING",
                Message = w
            }));

            extractionJob.PrimaryOcrEngine = ocrResult.OcrEngineType;
            extractionJob.DetectedLanguage = detectedLanguage;
            extractionJob.RawText = ocrResult.RawText;
            extractionJob.OverallConfidence = extractionResult.Confidence;
            extractionJob.WarningsJson = JsonSerializer.Serialize(allWarnings);
            extractionJob.Status = ExtractionJobStatus.Completed;
            extractionJob.CompletedAtUtc = DateTime.UtcNow;

            var extractedFinancialDocument = new ExtractedFinancialDocument
            {
                Id = Guid.NewGuid(),
                DocumentId = document.Id,
                ExtractionJobId = extractionJob.Id,
                VendorName = string.IsNullOrWhiteSpace(extractionResult.VendorName) ? "Unknown" : extractionResult.VendorName,
                Currency = extractionResult.Currency,
                Subtotal = extractionResult.Subtotal,
                Gst = extractionResult.Gst,
                Qst = extractionResult.Qst,
                Total = extractionResult.Total,
                Confidence = extractionResult.Confidence,
                DetectedLanguage = detectedLanguage,
                IsValidated = validationResult.IsValid,
                ValidationSummary = validationResult.Warnings.Count == 0
                    ? "No validation warnings"
                    : string.Join("; ", validationResult.Warnings.Select(w => w.Message))
            };

            _dbContext.ExtractedFinancialDocuments.Add(extractedFinancialDocument);

            document.DocumentLanguage = detectedLanguage;
            document.ProcessingStatus = validationResult.IsValid ? ProcessingStatus.Completed : ProcessingStatus.NeedsReview;
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
}
