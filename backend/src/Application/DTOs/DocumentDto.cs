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

public class DocumentResultDto
{
    public required DocumentResultMetadataDto Document { get; set; }
    public string RequestedDocumentLanguage { get; set; } = string.Empty;
    public string DetectedDocumentLanguage { get; set; } = string.Empty;
    public ExtractionJobResultDto? LatestExtractionJob { get; set; }
    public string RawText { get; set; } = string.Empty;
    public ExtractedFieldsDto? StructuredExtractedFields { get; set; }
    public List<ExtractedLineItemDto> LineItems { get; set; } = new();
    public ValidationResultSummaryDto? ValidationResult { get; set; }
    public List<ValidationWarningDto> BilingualWarnings { get; set; } = new();
    public decimal? Confidence { get; set; }
    public string PrimaryOcrEngineUsed { get; set; } = string.Empty;
    public string? FallbackOcrEngineUsed { get; set; }
    public bool FallbackUsed { get; set; }
    public string? ProviderName { get; set; }
    public string? ModelName { get; set; }
    public long? ProviderLatencyMs { get; set; }
}

public class DocumentResultMetadataDto
{
    public Guid Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime UploadedAtUtc { get; set; }
    public DateTime? ProcessedAtUtc { get; set; }
}

public class ExtractionJobResultDto
{
    public Guid Id { get; set; }
    public DateTime StartedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
}

public class ExtractedFieldsDto
{
    public string VendorName { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public string? DocumentNumber { get; set; }
    public DateTime? DocumentDate { get; set; }
    public DateTime? DueDate { get; set; }
    public string Currency { get; set; } = "CAD";
    public decimal? Subtotal { get; set; }
    public decimal? Gst { get; set; }
    public decimal? Qst { get; set; }
    public decimal? Hst { get; set; }
    public decimal? Pst { get; set; }
    public decimal? Tip { get; set; }
    public decimal? Total { get; set; }
}

public class ExtractedLineItemDto
{
    public string Description { get; set; } = string.Empty;
    public decimal? Quantity { get; set; }
    public decimal? UnitPrice { get; set; }
    public decimal? Amount { get; set; }
    public decimal? Confidence { get; set; }
}

public class ValidationResultSummaryDto
{
    public bool IsValidated { get; set; }
    public string Summary { get; set; } = string.Empty;
}

public class ValidationWarningDto
{
    public string Code { get; set; } = string.Empty;
    public string MessageEn { get; set; } = string.Empty;
    public string MessageFr { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string? FieldName { get; set; }
}

public class DocumentRawTextDto
{
    public string RawText { get; set; } = string.Empty;
}
