namespace FinancialOCR.Api.Options;

public class ProviderUsageOptions
{
    public const string SectionName = "ProviderUsage";
    public bool TrackUsage { get; set; } = true;
    public ProviderUsagePricingOptions Pricing { get; set; } = new();
}

public class ProviderUsagePricingOptions
{
    public ProviderModelPricingOptions GeminiFlashLite { get; set; } = new();
}

public class ProviderModelPricingOptions
{
    public decimal? InputCostPerMillionTokens { get; set; }
    public decimal? OutputCostPerMillionTokens { get; set; }
}
