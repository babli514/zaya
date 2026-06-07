using System.Globalization;
using System.Text.RegularExpressions;

namespace FinancialOCR.Api.Services;

public static class MoneyParser
{
    private static readonly Regex AmountCandidateRegex = new(@"(?:(?:CAD|USD|EUR|C\$|\$)\s*)?-?\d{1,3}(?:[\s\u00A0,.]\d{3})*(?:[.,]\d{2})?\s*(?:\$)?|(?:(?:CAD|USD|EUR|C\$|\$)\s*)?-?\d+(?:[.,]\d{2})\s*(?:\$)?", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public static bool TryParseAmount(string value, out decimal amount)
    {
        amount = 0m;
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var containsCurrencySymbol = Regex.IsMatch(value, @"(?i)\b(CAD|USD|EUR)\b|C\$|\$");
        var cleaned = Regex.Replace(value, @"(?i)\b(CAD|USD|EUR)\b|C\$|\$", string.Empty).Trim();
        cleaned = cleaned.Replace("\u00A0", " ", StringComparison.Ordinal).Replace(" ", string.Empty, StringComparison.Ordinal);
        cleaned = Regex.Replace(cleaned, @"[^0-9,\.\-]", string.Empty);
        if (string.IsNullOrWhiteSpace(cleaned) || cleaned == "-")
        {
            return false;
        }

        var hasDecimalSeparator = cleaned.Contains(',') || cleaned.Contains('.');
        if (!hasDecimalSeparator && !containsCurrencySymbol)
        {
            return false;
        }

        var normalized = NormalizeNumericSeparators(cleaned);
        return decimal.TryParse(normalized, NumberStyles.AllowLeadingSign | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out amount);
    }

    public static bool TryExtractAmountFromLine(string line, out decimal amount)
    {
        amount = 0m;
        foreach (Match match in AmountCandidateRegex.Matches(line))
        {
            if (TryParseAmount(match.Value, out amount))
            {
                return true;
            }
        }

        return false;
    }

    private static string NormalizeNumericSeparators(string value)
    {
        var lastComma = value.LastIndexOf(',');
        var lastDot = value.LastIndexOf('.');

        if (lastComma >= 0 && lastDot >= 0)
        {
            if (lastComma > lastDot)
            {
                return value.Replace(".", string.Empty, StringComparison.Ordinal).Replace(',', '.');
            }

            return value.Replace(",", string.Empty, StringComparison.Ordinal);
        }

        if (lastComma >= 0)
        {
            var decimals = value.Length - lastComma - 1;
            return decimals == 2
                ? value.Replace(',', '.')
                : value.Replace(",", string.Empty, StringComparison.Ordinal);
        }

        if (lastDot >= 0)
        {
            var decimals = value.Length - lastDot - 1;
            return decimals == 2
                ? value
                : value.Replace(".", string.Empty, StringComparison.Ordinal);
        }

        return value;
    }
}
