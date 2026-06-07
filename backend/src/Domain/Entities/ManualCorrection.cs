namespace FinancialOCR.Domain.Entities;

public class ManualCorrection
{
    public Guid Id { get; set; }

    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }

    public required string FieldName { get; set; }
    public string? OriginalValue { get; set; }
    public string? CorrectedValue { get; set; }

    public DateTime CorrectedAtUtc { get; set; }
    public string? CorrectedBy { get; set; }
}
