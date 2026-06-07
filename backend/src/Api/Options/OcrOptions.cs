namespace FinancialOCR.Api.Options;

public class OcrOptions
{
    public const string SectionName = "Ocr";
    public bool EnableNativePdfText { get; set; } = true;
    public bool EnableTesseract { get; set; } = true;
    public bool PreferVisionFallback { get; set; } = false;
    public string PreferredVisionProvider { get; set; } = "Gemini";
    public string GeminiModelName { get; set; } = string.Empty;
    public string GeminiApiKey { get; set; } = string.Empty;
    public string TesseractDataPath { get; set; } = "App_Data/tessdata";
    public string DefaultLanguage { get; set; } = "eng+fra";
    public string EnglishLanguage { get; set; } = "eng";
    public string FrenchLanguage { get; set; } = "fra";
    public string BilingualLanguage { get; set; } = "eng+fra";
}
