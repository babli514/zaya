using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Application.DTOs;

public class UploadDocumentRequestDto
{
    public required string OriginalFileName { get; set; }
    public required string StoredFileName { get; set; }
    public required string StoragePath { get; set; }
    public required string ContentType { get; set; }
    public required string FileExtension { get; set; }
    public long FileSizeBytes { get; set; }
    public required DocumentType DocumentType { get; set; }
    public required DocumentLanguage DocumentLanguage { get; set; }
}

public class UploadDocumentResponseDto
{
    public Guid DocumentId { get; set; }
    public required string OriginalFileName { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentLanguage { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime UploadedAtUtc { get; set; }
}

public class DocumentListItemDto
{
    public Guid Id { get; set; }
    public required string FileName { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentLanguage { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime UploadedAtUtc { get; set; }
    public DateTime? ProcessedAtUtc { get; set; }
}

public class DocumentDetailDto
{
    public Guid Id { get; set; }
    public required string OriginalFileName { get; set; }
    public required string StoredFileName { get; set; }
    public required string ContentType { get; set; }
    public long FileSizeBytes { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentLanguage { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime UploadedAtUtc { get; set; }
    public DateTime? ProcessedAtUtc { get; set; }
}
