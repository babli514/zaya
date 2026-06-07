using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Api.Services;

public class LanguageDetectionService : ILanguageDetectionService
{
    public DocumentLanguage DetectLanguage(string rawText)
    {
        if (string.IsNullOrWhiteSpace(rawText))
        {
            return DocumentLanguage.Unknown;
        }

        var normalized = rawText.ToLowerInvariant();
        if (normalized.Contains("taxe") || normalized.Contains("total tps") || normalized.Contains("total tvq"))
        {
            return DocumentLanguage.FrenchCanada;
        }

        if (normalized.Contains("gst") || normalized.Contains("receipt") || normalized.Contains("invoice"))
        {
            return DocumentLanguage.EnglishCanada;
        }

        return DocumentLanguage.Unknown;
    }
}
