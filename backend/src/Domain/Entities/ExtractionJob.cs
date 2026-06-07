namespace FinancialOCR.Domain.Entities;

public class ExtractionJob
{
    public Guid Id { get; set; }

    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }

    public DateTime StartedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }

    public ExtractionJobStatus Status { get; set; }

    public DocumentLanguage RequestedDocumentLanguage { get; set; } = DocumentLanguage.Unknown;
    public DocumentLanguage DetectedLanguage { get; set; } = DocumentLanguage.Unknown;

    public OcrEngineType PrimaryOcrEngine { get; set; }
    public OcrEngineType? FallbackOcrEngine { get; set; }
    public bool FallbackUsed { get; set; }
    public string? PrimaryProviderName { get; set; }
    public string? PrimaryModelName { get; set; }
    public long PrimaryLatencyMs { get; set; }
    public string? FallbackProviderName { get; set; }
    public string? FallbackModelName { get; set; }
    public long? FallbackLatencyMs { get; set; }
    public decimal? EstimatedProviderCost { get; set; }
    public int? PageCount { get; set; }

    public string? RawText { get; set; }

    public decimal? OverallConfidence { get; set; }

    public string? WarningsJson { get; set; }

    public string? ErrorMessage { get; set; }

    public List<ExtractedFinancialDocument> ExtractedFinancialDocuments { get; set; } = new();
}
