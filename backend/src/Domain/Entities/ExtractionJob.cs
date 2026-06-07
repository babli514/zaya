namespace FinancialOCR.Domain.Entities;

public class ExtractionJob
{
    public Guid Id { get; set; }

    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }

    public DateTime StartedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }

    public ExtractionJobStatus Status { get; set; }

    public OcrEngineType PrimaryOcrEngine { get; set; }
    public OcrEngineType? FallbackOcrEngine { get; set; }
    public bool FallbackUsed { get; set; }

    public string? RawText { get; set; }

    public DocumentLanguage DetectedLanguage { get; set; } = DocumentLanguage.Unknown;

    public decimal? OverallConfidence { get; set; }

    // Warnings serialized as JSON
    public string? WarningsJson { get; set; }

    public string? ErrorMessage { get; set; }

    public List<ExtractedFinancialDocument> ExtractedFinancialDocuments { get; set; } = new();
}
