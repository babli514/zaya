namespace FinancialOCR.Api.Services;

public static class CanadianTaxLabelNormalizer
{
    public static string NormalizeTaxLabel(string label)
    {
        var normalized = TextNormalizationHelper.NormalizeForMatching(label).Replace(".", string.Empty, StringComparison.Ordinal);
        return normalized switch
        {
            "gst" or "tps" => "gst",
            "qst" or "tvq" => "qst",
            "hst" or "tvh" => "hst",
            "pst" or "tvp" => "pst",
            _ => normalized
        };
    }
}
