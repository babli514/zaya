namespace FinancialOCR.Domain.Entities;

public class ExtractedLineItem
{
    public Guid Id { get; set; }

    public Guid ExtractedFinancialDocumentId { get; set; }
    public ExtractedFinancialDocument? ExtractedFinancialDocument { get; set; }

    public required string Description { get; set; }

    public decimal? Quantity { get; set; }
    public decimal? UnitPrice { get; set; }
    public decimal? Amount { get; set; }

    public decimal? Confidence { get; set; }
}
