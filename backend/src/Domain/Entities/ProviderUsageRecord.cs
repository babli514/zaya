namespace FinancialOCR.Domain.Entities;

public class ProviderUsageRecord
{
    public Guid Id { get; set; }
    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }
    public Guid? ExtractionJobId { get; set; }
    public ExtractionJob? ExtractionJob { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public ProviderOperationType OperationType { get; set; }
    public DateTime StartedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public long? LatencyMs { get; set; }
    public bool Success { get; set; }
    public string? ErrorCode { get; set; }
    public string? ErrorMessage { get; set; }
    public int? InputTokenCount { get; set; }
    public int? OutputTokenCount { get; set; }
    public long? InputBytes { get; set; }
    public long? OutputBytes { get; set; }
    public decimal? EstimatedCostUsd { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
