using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace FinancialOCR.Application.Services;

public interface IDocumentService
{
    Task<UploadDocumentResponseDto> UploadDocumentAsync(UploadDocumentRequestDto requestDto, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<DocumentListItemDto>> GetRecentDocumentsAsync(CancellationToken cancellationToken = default);
    Task<DocumentDetailDto> GetDocumentAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DocumentDetailDto> MarkDocumentAsProcessingAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DocumentResultDto> GetDocumentResultAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DocumentFileDto> GetDocumentFileAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DocumentRawTextDto> GetDocumentRawTextAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DocumentResultDto> UpdateExtractedFieldsAsync(Guid id, UpdateExtractedFieldsRequestDto requestDto, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ManualCorrectionDto>> GetCorrectionsAsync(Guid id, CancellationToken cancellationToken = default);
}

public class DocumentService : IDocumentService
{
    private readonly AppDbContext _dbContext;
    private readonly IFinancialDocumentValidator _financialDocumentValidator;

    public DocumentService(AppDbContext dbContext, IFinancialDocumentValidator financialDocumentValidator)
    {
        _dbContext = dbContext;
        _financialDocumentValidator = financialDocumentValidator;
    }

    public async Task<UploadDocumentResponseDto> UploadDocumentAsync(UploadDocumentRequestDto requestDto, CancellationToken cancellationToken = default)
    {
        var document = new Document
        {
            Id = Guid.NewGuid(),
            OriginalFileName = requestDto.OriginalFileName,
            StoredFileName = requestDto.StoredFileName,
            ContentType = requestDto.ContentType,
            FileExtension = requestDto.FileExtension,
            FileSizeBytes = requestDto.FileSizeBytes,
            StoragePath = requestDto.StoragePath,
            DocumentType = requestDto.DocumentType,
            DocumentLanguage = requestDto.DocumentLanguage,
            ProcessingStatus = ProcessingStatus.Uploaded,
            UploadedAtUtc = DateTime.UtcNow
        };

        _dbContext.Documents.Add(document);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UploadDocumentResponseDto
        {
            DocumentId = document.Id,
            OriginalFileName = document.OriginalFileName ?? string.Empty,
            DocumentType = document.DocumentType.ToString(),
            DocumentLanguage = document.DocumentLanguage.ToString(),
            Status = document.ProcessingStatus.ToString(),
            UploadedAtUtc = document.UploadedAtUtc
        };
    }

    public async Task<IReadOnlyList<DocumentListItemDto>> GetRecentDocumentsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Documents
            .AsNoTracking()
            .OrderByDescending(d => d.UploadedAtUtc)
            .Select(d => new DocumentListItemDto
            {
                Id = d.Id,
                FileName = d.OriginalFileName ?? string.Empty,
                DocumentType = d.DocumentType.ToString(),
                DocumentLanguage = d.DocumentLanguage.ToString(),
                Status = d.ProcessingStatus.ToString(),
                UploadedAtUtc = d.UploadedAtUtc,
                ProcessedAtUtc = d.ProcessedAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<DocumentDetailDto> GetDocumentAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var document = await _dbContext.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        return new DocumentDetailDto
        {
            Id = document.Id,
            OriginalFileName = document.OriginalFileName ?? string.Empty,
            StoredFileName = document.StoredFileName ?? string.Empty,
            ContentType = document.ContentType,
            FileSizeBytes = document.FileSizeBytes,
            DocumentType = document.DocumentType.ToString(),
            DocumentLanguage = document.DocumentLanguage.ToString(),
            Status = document.ProcessingStatus.ToString(),
            UploadedAtUtc = document.UploadedAtUtc,
            ProcessedAtUtc = document.ProcessedAtUtc
        };
    }

    public async Task<DocumentDetailDto> MarkDocumentAsProcessingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var document = await _dbContext.Documents
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        document.ProcessingStatus = ProcessingStatus.Processing;
        document.ProcessedAtUtc = null;
        document.FailureReason = null;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new DocumentDetailDto
        {
            Id = document.Id,
            OriginalFileName = document.OriginalFileName ?? string.Empty,
            StoredFileName = document.StoredFileName ?? string.Empty,
            ContentType = document.ContentType,
            FileSizeBytes = document.FileSizeBytes,
            DocumentType = document.DocumentType.ToString(),
            DocumentLanguage = document.DocumentLanguage.ToString(),
            Status = document.ProcessingStatus.ToString(),
            UploadedAtUtc = document.UploadedAtUtc,
            ProcessedAtUtc = document.ProcessedAtUtc
        };
    }

    public async Task<DocumentResultDto> GetDocumentResultAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var document = await _dbContext.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        var latestExtractionJob = await _dbContext.ExtractionJobs
            .AsNoTracking()
            .Where(j => j.DocumentId == id)
            .OrderByDescending(j => j.StartedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        ExtractedFinancialDocument? extractedDocument = null;
        if (latestExtractionJob != null)
        {
            extractedDocument = await _dbContext.ExtractedFinancialDocuments
                .AsNoTracking()
                .Where(e => e.ExtractionJobId == latestExtractionJob.Id)
                .Include(e => e.LineItems)
                .OrderByDescending(e => e.CreatedAtUtc)
                .FirstOrDefaultAsync(cancellationToken);
        }

        var warnings = new List<ValidationWarningDto>();
        if (!string.IsNullOrWhiteSpace(latestExtractionJob?.WarningsJson))
        {
            var parsedWarnings = JsonSerializer.Deserialize<List<ValidationWarning>>(latestExtractionJob.WarningsJson);
            if (parsedWarnings != null)
            {
                warnings = parsedWarnings.Select(w => new ValidationWarningDto
                {
                    Code = w.Code,
                    MessageEn = w.MessageEn,
                    MessageFr = w.MessageFr,
                    Severity = w.Severity.ToString(),
                    FieldName = w.FieldName
                }).ToList();
            }
        }

        return new DocumentResultDto
        {
            Document = new DocumentResultMetadataDto
            {
                Id = document.Id,
                OriginalFileName = document.OriginalFileName ?? string.Empty,
                StoredFileName = document.StoredFileName ?? string.Empty,
                ContentType = document.ContentType,
                DocumentType = document.DocumentType.ToString(),
                Status = document.ProcessingStatus.ToString(),
                UploadedAtUtc = document.UploadedAtUtc,
                ProcessedAtUtc = document.ProcessedAtUtc
            },
            RequestedDocumentLanguage = latestExtractionJob?.RequestedDocumentLanguage.ToString() ?? document.DocumentLanguage.ToString(),
            DetectedDocumentLanguage = latestExtractionJob?.DetectedLanguage.ToString() ?? DocumentLanguage.Unknown.ToString(),
            LatestExtractionJob = latestExtractionJob == null
                ? null
                : new ExtractionJobResultDto
                {
                    Id = latestExtractionJob.Id,
                    StartedAtUtc = latestExtractionJob.StartedAtUtc,
                    CompletedAtUtc = latestExtractionJob.CompletedAtUtc,
                    Status = latestExtractionJob.Status.ToString(),
                    ErrorMessage = latestExtractionJob.ErrorMessage
                },
            RawText = latestExtractionJob?.RawText ?? string.Empty,
            StructuredExtractedFields = extractedDocument == null
                ? null
                : new ExtractedFieldsDto
                {
                    VendorName = extractedDocument.VendorName,
                    CustomerName = extractedDocument.CustomerName,
                    DocumentNumber = extractedDocument.DocumentNumber,
                    DocumentDate = extractedDocument.DocumentDate,
                    DueDate = extractedDocument.DueDate,
                    Currency = extractedDocument.Currency,
                    Subtotal = extractedDocument.Subtotal,
                    Gst = extractedDocument.Gst,
                    Qst = extractedDocument.Qst,
                    Hst = extractedDocument.Hst,
                    Pst = extractedDocument.Pst,
                    Tip = extractedDocument.Tip,
                    Total = extractedDocument.Total
                },
            LineItems = extractedDocument?.LineItems.Select(li => new ExtractedLineItemDto
            {
                Description = li.Description,
                Quantity = li.Quantity,
                UnitPrice = li.UnitPrice,
                Amount = li.Amount,
                Confidence = li.Confidence
            }).ToList() ?? new List<ExtractedLineItemDto>(),
            ValidationResult = extractedDocument == null
                ? null
                : new ValidationResultSummaryDto
                {
                    IsValidated = extractedDocument.IsValidated,
                    Summary = extractedDocument.ValidationSummary ?? string.Empty
                },
            BilingualWarnings = warnings,
            Confidence = latestExtractionJob?.OverallConfidence ?? extractedDocument?.Confidence,
            PrimaryOcrEngineUsed = latestExtractionJob?.PrimaryOcrEngine.ToString() ?? OcrEngineType.Unknown.ToString(),
            FallbackOcrEngineUsed = latestExtractionJob?.FallbackOcrEngine?.ToString(),
            FallbackUsed = latestExtractionJob?.FallbackUsed ?? false,
            ProviderName = latestExtractionJob?.FallbackUsed == true
                ? latestExtractionJob.FallbackProviderName ?? latestExtractionJob.PrimaryProviderName
                : latestExtractionJob?.PrimaryProviderName,
            ModelName = latestExtractionJob?.FallbackUsed == true
                ? latestExtractionJob.FallbackModelName ?? latestExtractionJob.PrimaryModelName
                : latestExtractionJob?.PrimaryModelName,
            PrimaryLatencyMs = latestExtractionJob?.PrimaryLatencyMs ?? 0,
            FallbackLatencyMs = latestExtractionJob?.FallbackLatencyMs,
            ProviderLatencyMs = latestExtractionJob?.FallbackUsed == true
                ? latestExtractionJob.FallbackLatencyMs ?? latestExtractionJob.PrimaryLatencyMs
                : latestExtractionJob?.PrimaryLatencyMs,
            TotalProcessingLatencyMs = latestExtractionJob == null
                ? 0
                : latestExtractionJob.PrimaryLatencyMs + (latestExtractionJob.FallbackLatencyMs ?? 0),
            EstimatedProviderCost = latestExtractionJob?.EstimatedProviderCost,
            PageCount = latestExtractionJob?.PageCount
        };
    }

    public async Task<DocumentFileDto> GetDocumentFileAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var document = await _dbContext.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        return new DocumentFileDto
        {
            Id = document.Id,
            OriginalFileName = document.OriginalFileName ?? string.Empty,
            StoredFileName = document.StoredFileName ?? string.Empty,
            StoragePath = document.StoragePath ?? string.Empty,
            ContentType = string.IsNullOrWhiteSpace(document.ContentType) ? "application/octet-stream" : document.ContentType,
            FileContent = document.FileContent
        };
    }

    public async Task<DocumentRawTextDto> GetDocumentRawTextAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var documentExists = await _dbContext.Documents
            .AsNoTracking()
            .AnyAsync(d => d.Id == id, cancellationToken);

        if (!documentExists)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        var rawText = await _dbContext.ExtractionJobs
            .AsNoTracking()
            .Where(j => j.DocumentId == id)
            .OrderByDescending(j => j.StartedAtUtc)
            .Select(j => j.RawText)
            .FirstOrDefaultAsync(cancellationToken);

        return new DocumentRawTextDto
        {
            RawText = rawText ?? string.Empty
        };
    }

    public async Task<DocumentResultDto> UpdateExtractedFieldsAsync(Guid id, UpdateExtractedFieldsRequestDto requestDto, CancellationToken cancellationToken = default)
    {
        var document = await _dbContext.Documents
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        var latestExtractionJob = await _dbContext.ExtractionJobs
            .Where(j => j.DocumentId == id)
            .OrderByDescending(j => j.StartedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        var extractedDocument = await _dbContext.ExtractedFinancialDocuments
            .Include(e => e.LineItems)
            .Where(e => e.DocumentId == id)
            .OrderByDescending(e => e.UpdatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (extractedDocument == null)
        {
            throw new KeyNotFoundException($"No extracted fields found for document ID {id}");
        }

        var corrections = new List<ManualCorrection>();
        var correctedAtUtc = DateTime.UtcNow;

        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.VendorName), extractedDocument.VendorName, string.IsNullOrWhiteSpace(requestDto.VendorName) ? "Unknown" : requestDto.VendorName.Trim(), value => extractedDocument.VendorName = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.CustomerName), extractedDocument.CustomerName, NormalizeNullableString(requestDto.CustomerName), value => extractedDocument.CustomerName = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.DocumentNumber), extractedDocument.DocumentNumber, NormalizeNullableString(requestDto.DocumentNumber), value => extractedDocument.DocumentNumber = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.DocumentDate), extractedDocument.DocumentDate, requestDto.DocumentDate, value => extractedDocument.DocumentDate = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.DueDate), extractedDocument.DueDate, requestDto.DueDate, value => extractedDocument.DueDate = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Currency), extractedDocument.Currency, string.IsNullOrWhiteSpace(requestDto.Currency) ? "CAD" : requestDto.Currency.Trim().ToUpperInvariant(), value => extractedDocument.Currency = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Subtotal), extractedDocument.Subtotal, requestDto.Subtotal, value => extractedDocument.Subtotal = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Gst), extractedDocument.Gst, requestDto.Gst, value => extractedDocument.Gst = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Qst), extractedDocument.Qst, requestDto.Qst, value => extractedDocument.Qst = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Hst), extractedDocument.Hst, requestDto.Hst, value => extractedDocument.Hst = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Pst), extractedDocument.Pst, requestDto.Pst, value => extractedDocument.Pst = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Tip), extractedDocument.Tip, requestDto.Tip, value => extractedDocument.Tip = value);
        TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.Total), extractedDocument.Total, requestDto.Total, value => extractedDocument.Total = value);

        if (requestDto.DetectedLanguage.HasValue)
        {
            TrackChange(corrections, id, correctedAtUtc, nameof(ExtractedFinancialDocument.DetectedLanguage), extractedDocument.DetectedLanguage, requestDto.DetectedLanguage.Value, value => extractedDocument.DetectedLanguage = value);
        }

        if (corrections.Count > 0)
        {
            _dbContext.ManualCorrections.AddRange(corrections);
        }

        var validationInput = new FinancialExtractionResult
        {
            VendorName = extractedDocument.VendorName,
            CustomerName = extractedDocument.CustomerName,
            DocumentNumber = extractedDocument.DocumentNumber,
            DocumentDate = extractedDocument.DocumentDate,
            DueDate = extractedDocument.DueDate,
            Currency = extractedDocument.Currency,
            Subtotal = extractedDocument.Subtotal,
            Gst = extractedDocument.Gst,
            Qst = extractedDocument.Qst,
            Hst = extractedDocument.Hst,
            Pst = extractedDocument.Pst,
            Tip = extractedDocument.Tip,
            Total = extractedDocument.Total,
            Confidence = extractedDocument.Confidence,
            RequestedDocumentLanguage = latestExtractionJob?.RequestedDocumentLanguage ?? document.DocumentLanguage,
            DetectedLanguage = extractedDocument.DetectedLanguage,
            OcrEngineType = latestExtractionJob?.PrimaryOcrEngine ?? OcrEngineType.Unknown,
            ProviderName = latestExtractionJob?.PrimaryProviderName ?? string.Empty,
            ModelName = latestExtractionJob?.PrimaryModelName ?? string.Empty,
            ProviderLatencyMs = latestExtractionJob?.PrimaryLatencyMs,
            LineItems = extractedDocument.LineItems.Select(li => new FinancialExtractionLineItem
            {
                Description = li.Description,
                Quantity = li.Quantity,
                UnitPrice = li.UnitPrice,
                Amount = li.Amount
            }).ToList()
        };

        var validation = _financialDocumentValidator.Validate(validationInput, document.DocumentType);
        extractedDocument.IsValidated = validation.IsValid;
        extractedDocument.ValidationSummary = validation.ValidationSummary;

        var confidence = ApplyConfidenceAdjustment(latestExtractionJob?.OverallConfidence ?? extractedDocument.Confidence, validation.ConfidenceAdjustment);
        extractedDocument.Confidence = confidence;

        document.DocumentLanguage = extractedDocument.DetectedLanguage;
        document.ProcessingStatus = validation.IsValid && validation.Warnings.All(w => w.Severity == ValidationSeverity.Info)
            ? ProcessingStatus.Completed
            : ProcessingStatus.NeedsReview;
        document.ProcessedAtUtc = DateTime.UtcNow;

        if (latestExtractionJob != null)
        {
            latestExtractionJob.DetectedLanguage = extractedDocument.DetectedLanguage;
            latestExtractionJob.OverallConfidence = confidence;
            latestExtractionJob.WarningsJson = JsonSerializer.Serialize(validation.Warnings);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return await GetDocumentResultAsync(id, cancellationToken);
    }

    public async Task<IReadOnlyList<ManualCorrectionDto>> GetCorrectionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var documentExists = await _dbContext.Documents
            .AsNoTracking()
            .AnyAsync(d => d.Id == id, cancellationToken);

        if (!documentExists)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        return await _dbContext.ManualCorrections
            .AsNoTracking()
            .Where(c => c.DocumentId == id)
            .OrderByDescending(c => c.CorrectedAtUtc)
            .Select(c => new ManualCorrectionDto
            {
                Id = c.Id,
                DocumentId = c.DocumentId,
                FieldName = c.FieldName,
                OriginalValue = c.OriginalValue,
                CorrectedValue = c.CorrectedValue,
                CorrectedAtUtc = c.CorrectedAtUtc,
                CorrectedBy = c.CorrectedBy
            })
            .ToListAsync(cancellationToken);
    }

    private static void TrackChange<T>(List<ManualCorrection> corrections, Guid documentId, DateTime correctedAtUtc, string fieldName, T currentValue, T newValue, Action<T> assign)
    {
        if (EqualityComparer<T>.Default.Equals(currentValue, newValue))
        {
            return;
        }

        corrections.Add(new ManualCorrection
        {
            Id = Guid.NewGuid(),
            DocumentId = documentId,
            FieldName = fieldName,
            OriginalValue = ConvertValue(currentValue),
            CorrectedValue = ConvertValue(newValue),
            CorrectedAtUtc = correctedAtUtc
        });

        assign(newValue);
    }

    private static string? NormalizeNullableString(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string? ConvertValue<T>(T value)
    {
        if (value is null)
        {
            return null;
        }

        if (value is DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd");
        }

        if (value is decimal decimalValue)
        {
            return decimalValue.ToString("0.##");
        }

        return value.ToString();
    }

    private static decimal? ApplyConfidenceAdjustment(decimal? baseConfidence, decimal adjustment)
    {
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
}
