namespace FinancialOCR.Api.Services;

public class TesseractAdapterResult
{
    public string RawText { get; set; } = string.Empty;
    public decimal? Confidence { get; set; }
}
