using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialOCR.Application.Services;

public interface IDocumentService
{
    Task<UploadDocumentResponseDto> UploadDocumentAsync(UploadDocumentRequestDto requestDto, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<DocumentListItemDto>> GetRecentDocumentsAsync(CancellationToken cancellationToken = default);
    Task<DocumentDetailDto> GetDocumentAsync(Guid id, CancellationToken cancellationToken = default);
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
}
