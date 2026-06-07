namespace FinancialOCR.Domain.Entities;

public class ExtractedFinancialDocument
{
    public Guid Id { get; set; }

    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }

    public Guid ExtractionJobId { get; set; }
    public ExtractionJob? ExtractionJob { get; set; }

    public required string VendorName { get; set; }
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

    public decimal? Confidence { get; set; }

    public DocumentLanguage DetectedLanguage { get; set; } = DocumentLanguage.Unknown;

    public bool IsValidated { get; set; }
    public string? ValidationSummary { get; set; }

    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }

    public List<ExtractedLineItem> LineItems { get; set; } = new();
}
