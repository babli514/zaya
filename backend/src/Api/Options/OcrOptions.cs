namespace FinancialOCR.Api.Options;

public class OcrOptions
{
    public const string SectionName = "Ocr";
    public bool EnableNativePdfText { get; set; } = true;
    public bool EnableTesseract { get; set; } = true;
    public string TesseractDataPath { get; set; } = "App_Data/tessdata";
    public string DefaultLanguage { get; set; } = "eng+fra";
    public string EnglishLanguage { get; set; } = "eng";
    public string FrenchLanguage { get; set; } = "fra";
    public string BilingualLanguage { get; set; } = "eng+fra";
    public string PreferredFallbackProvider { get; set; } = "GeminiFlashLite";
    public bool EnableFallbackOnLowConfidence { get; set; } = true;
    public bool EnableFallbackOnValidationFailure { get; set; } = true;
    public decimal MinimumOcrConfidence { get; set; } = 0.75m;
    public int MinimumRawTextLength { get; set; } = 80;
    public decimal AutoCompleteConfidenceThreshold { get; set; } = 0.75m;
    public VisionOcrOptions VisionOcr { get; set; } = new();
}

public class VisionOcrOptions
{
    public string PreferredProvider { get; set; } = "GeminiFlashLite";
    public bool FallbackEnabled { get; set; } = true;
    public GeminiFlashLiteOptions GeminiFlashLite { get; set; } = new();
}

public class GeminiFlashLiteOptions
{
    public bool Enabled { get; set; } = true;
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
