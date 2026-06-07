using FinancialOCR.Domain.Entities;
using System.Globalization;
using System.Text.RegularExpressions;

namespace FinancialOCR.Api.Services;

public static class DateParser
{
    private static readonly Dictionary<string, int> MonthLookup = new(StringComparer.OrdinalIgnoreCase)
    {
        ["january"] = 1, ["jan"] = 1,
        ["february"] = 2, ["feb"] = 2,
        ["march"] = 3, ["mar"] = 3,
        ["april"] = 4, ["apr"] = 4,
        ["may"] = 5,
        ["june"] = 6, ["jun"] = 6,
        ["july"] = 7, ["jul"] = 7,
        ["august"] = 8, ["aug"] = 8,
        ["september"] = 9, ["sep"] = 9,
        ["october"] = 10, ["oct"] = 10,
        ["november"] = 11, ["nov"] = 11,
        ["december"] = 12, ["dec"] = 12,
        ["janvier"] = 1,
        ["fevrier"] = 2, ["février"] = 2,
        ["mars"] = 3,
        ["avril"] = 4,
        ["mai"] = 5,
        ["juin"] = 6,
        ["juillet"] = 7,
        ["aout"] = 8, ["août"] = 8,
        ["septembre"] = 9,
        ["octobre"] = 10,
        ["novembre"] = 11,
        ["decembre"] = 12, ["décembre"] = 12
    };

    private static readonly string[] NumericFormats = ["yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy", "yyyy/MM/dd"];

    public static bool TryParseDate(string rawValue, DocumentLanguage languagePreference, out DateTime date, out decimal confidence)
    {
        date = default;
        confidence = 0m;
        if (string.IsNullOrWhiteSpace(rawValue))
        {
            return false;
        }

        var candidate = rawValue.Trim();
        foreach (var format in NumericFormats)
        {
            if (DateTime.TryParseExact(candidate, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                confidence = format == "MM/dd/yyyy" ? 0.55m : 0.8m;
                if (format == "MM/dd/yyyy" && languagePreference == DocumentLanguage.EnglishCanada)
                {
                    confidence = 0.7m;
                }

                return true;
            }
        }

        return TryParseMonthNameDate(candidate, out date, out confidence);
    }

    public static bool TryFindDateInLine(string line, DocumentLanguage languagePreference, out DateTime date, out decimal confidence)
    {
        date = default;
        confidence = 0m;

        var numericCandidates = Regex.Matches(line, @"\b\d{1,4}[/-]\d{1,2}[/-]\d{1,4}\b");
        foreach (Match candidate in numericCandidates)
        {
            if (TryParseDate(candidate.Value, languagePreference, out date, out confidence))
            {
                return true;
            }
        }

        var monthNameCandidate = Regex.Match(line, @"\b\d{1,2}\s+[A-Za-zÀ-ÿ]+\s+\d{4}\b|\b[A-Za-zÀ-ÿ]+\s+\d{1,2},?\s+\d{4}\b");
        if (monthNameCandidate.Success)
        {
            return TryParseDate(monthNameCandidate.Value, languagePreference, out date, out confidence);
        }

        return false;
    }

    private static bool TryParseMonthNameDate(string value, out DateTime date, out decimal confidence)
    {
        date = default;
        confidence = 0m;

        var normalized = TextNormalizationHelper.NormalizeForMatching(value).Replace(",", string.Empty, StringComparison.Ordinal);
        var dayFirst = Regex.Match(normalized, @"\b(\d{1,2})\s+([a-z]+)\s+(\d{4})\b");
        if (dayFirst.Success)
        {
            var day = int.Parse(dayFirst.Groups[1].Value, CultureInfo.InvariantCulture);
            var monthToken = dayFirst.Groups[2].Value;
            var year = int.Parse(dayFirst.Groups[3].Value, CultureInfo.InvariantCulture);
            if (MonthLookup.TryGetValue(monthToken, out var month) && DateTime.TryParseExact($"{year:D4}-{month:D2}-{day:D2}", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                confidence = 0.9m;
                return true;
            }
        }

        var monthFirst = Regex.Match(normalized, @"\b([a-z]+)\s+(\d{1,2})\s+(\d{4})\b");
        if (!monthFirst.Success)
        {
            return false;
        }

        var monthName = monthFirst.Groups[1].Value;
        var dayOfMonth = int.Parse(monthFirst.Groups[2].Value, CultureInfo.InvariantCulture);
        var y = int.Parse(monthFirst.Groups[3].Value, CultureInfo.InvariantCulture);
        if (!MonthLookup.TryGetValue(monthName, out var m))
        {
            return false;
        }

        if (!DateTime.TryParseExact($"{y:D4}-{m:D2}-{dayOfMonth:D2}", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
        {
            return false;
        }

        confidence = 0.9m;
        return true;
    }
}
