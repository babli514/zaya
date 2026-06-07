using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace FinancialOCR.Api.Services;

public static class TextNormalizationHelper
{
    public static string NormalizeForMatching(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var formD = value.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(formD.Length);
        foreach (var ch in formD)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(char.ToLowerInvariant(ch));
            }
        }

        return Regex.Replace(builder.ToString().Normalize(NormalizationForm.FormC), "\\s+", " ").Trim();
    }

    public static IReadOnlyList<string> SplitLines(string rawText)
    {
        return rawText
            .Replace("\r\n", "\n", StringComparison.Ordinal)
            .Replace('\r', '\n')
            .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }
}
