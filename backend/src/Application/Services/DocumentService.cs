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
    Task<DocumentResultDto> GetDocumentResultAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DocumentRawTextDto> GetDocumentRawTextAsync(Guid id, CancellationToken cancellationToken = default);
}

public class DocumentService : IDocumentService
{
    private readonly AppDbContext _dbContext;

    public DocumentService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
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
            ProviderLatencyMs = latestExtractionJob?.FallbackUsed == true
                ? latestExtractionJob.FallbackProviderLatencyMs ?? latestExtractionJob.PrimaryProviderLatencyMs
                : latestExtractionJob?.PrimaryProviderLatencyMs
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
}
