namespace FinancialOCR.Api.Options;

public class OcrOptions
{
    public const string SectionName = "Ocr";
    public bool EnableNativePdfText { get; set; } = true;
    public bool EnableTesseract { get; set; } = false;
    public bool PreferVisionFallback { get; set; } = true;
    public string PreferredVisionProvider { get; set; } = "Gemini";
    public string GeminiModelName { get; set; } = string.Empty;
    public string GeminiApiKey { get; set; } = string.Empty;
}
