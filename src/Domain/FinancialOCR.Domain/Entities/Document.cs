namespace FinancialOCR.Domain.Entities;

/// <summary>
/// Represents a financial document (receipt or invoice)
/// </summary>
public class Document
{
    public Guid Id { get; set; }
    public required string FileName { get; set; }
    public required string ContentType { get; set; }
    public long FileSizeBytes { get; set; }
    public required byte[] FileContent { get; set; }
    public DocumentType Type { get; set; }
    public ProcessingStatus Status { get; set; }
    public DateTime UploadedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public string? ErrorMessage { get; set; }
    public Dictionary<string, object> ExtractedData { get; set; } = new();
}

public enum DocumentType
{
    Receipt,
    Invoice
}

public enum ProcessingStatus
{
    Pending,
    Processing,
    Completed,
    Failed
}
