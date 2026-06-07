namespace FinancialOCR.Application.DTOs;

public class DocumentDto
{
    public Guid Id { get; set; }
    public required string FileName { get; set; }
    public required string ContentType { get; set; }
    public long FileSizeBytes { get; set; }
    public string Type { get; set; } = "Receipt";
    public string Status { get; set; } = "Pending";
    public DateTime UploadedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public string? ErrorMessage { get; set; }
    public Dictionary<string, object> ExtractedData { get; set; } = new();
}

public class CreateDocumentDto
{
    public required string FileName { get; set; }
    public required string ContentType { get; set; }
    public required byte[] FileContent { get; set; }
    public string Type { get; set; } = "Receipt";
}

public class UpdateDocumentDto
{
    public string? FileName { get; set; }
    public Dictionary<string, object>? ExtractedData { get; set; }
}
