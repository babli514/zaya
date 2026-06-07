namespace FinancialOCR.Api.Options;

public class FinancialExtractionOptions
{
    public const string SectionName = "FinancialExtraction";
    public string Mode { get; set; } = "RuleBased";
    public RuleBasedFinancialExtractionOptions RuleBased { get; set; } = new();
    public GeminiFlashLiteFinancialExtractionOptions GeminiFlashLite { get; set; } = new();
    public LlmFinancialExtractionOptions Llm { get; set; } = new();
    public decimal HybridLowConfidenceThreshold { get; set; } = 0.75m;
}

public class RuleBasedFinancialExtractionOptions
{
    public bool Enabled { get; set; } = true;
}

public class GeminiFlashLiteFinancialExtractionOptions
{
    public bool Enabled { get; set; }
    public string ProviderName { get; set; } = "GoogleGemini";
    public string Model { get; set; } = "CONFIGURE_ACTUAL_MODEL_ID_HERE";
    public string ApiKey { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public bool UseOpenAICompatibility { get; set; }
    public string OpenAIModel { get; set; } = string.Empty;
    public string OpenAIApiKey { get; set; } = string.Empty;
    public string OpenAIEndpoint { get; set; } = string.Empty;
    public int TimeoutSeconds { get; set; } = 60;
    public int MaxRetries { get; set; } = 2;
}

public class LlmFinancialExtractionOptions
{
    public bool Enabled { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}
