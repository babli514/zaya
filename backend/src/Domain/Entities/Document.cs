namespace FinancialOCR.Domain.Entities;

/// <summary>
/// Represents a stored document file (receipt or invoice)
/// </summary>
public class Document
{
    public Guid Id { get; set; }

    public string? OriginalFileName { get; set; }

    public string? StoredFileName { get; set; }

    public required string ContentType { get; set; }

    public string? FileExtension { get; set; }

    public long FileSizeBytes { get; set; }

    public string? StoragePath { get; set; }

    public DocumentType DocumentType { get; set; } = DocumentType.Unknown;

    public DocumentLanguage DocumentLanguage { get; set; } = DocumentLanguage.Unknown;

    public ProcessingStatus ProcessingStatus { get; set; } = ProcessingStatus.Uploaded;

    public DateTime UploadedAtUtc { get; set; }

    public DateTime? ProcessedAtUtc { get; set; }

    public string? FailureReason { get; set; }

    // Persisted raw file content (kept for backwards compatibility)
    public byte[]? FileContent { get; set; }

    // Persisted extracted key/value map (kept for backwards compatibility with existing DTOs)
    public Dictionary<string, object> ExtractedData { get; set; } = new();

    // Back-compat properties used by older services - not separately mapped
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string FileName { get => OriginalFileName ?? string.Empty; set => OriginalFileName = value; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public ProcessingStatus Status { get => ProcessingStatus; set => ProcessingStatus = value; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DocumentType Type { get => DocumentType; set => DocumentType = value; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTime UploadedAt { get => UploadedAtUtc; set => UploadedAtUtc = value; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTime? ProcessedAt { get => ProcessedAtUtc; set => ProcessedAtUtc = value; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string? ErrorMessage { get => FailureReason; set => FailureReason = value; }

    // Navigation
    public List<ExtractionJob> ExtractionJobs { get; set; } = new();
    public List<ManualCorrection> ManualCorrections { get; set; } = new();
}

