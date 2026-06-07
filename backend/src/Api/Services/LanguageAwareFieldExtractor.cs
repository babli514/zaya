using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Api.Services;

public static class LanguageAwareFieldExtractor
{
    public static IReadOnlyList<string> PrioritizeLabels(DocumentLanguage requested, DocumentLanguage detected, IReadOnlyList<string> english, IReadOnlyList<string> french)
    {
        var language = ResolveLanguage(requested, detected);
        if (language == DocumentLanguage.FrenchCanada)
        {
            return french.Concat(english).ToList();
        }

        if (language == DocumentLanguage.EnglishCanada)
        {
            return english.Concat(french).ToList();
        }

        return english.Concat(french).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
    }

    public static string? TryExtractTextAfterLabel(IReadOnlyList<string> lines, IReadOnlyCollection<string> labels)
    {
        foreach (var line in lines)
        {
            var normalized = TextNormalizationHelper.NormalizeForMatching(line);
            foreach (var label in labels)
            {
                var normalizedLabel = TextNormalizationHelper.NormalizeForMatching(label);
                if (!normalized.Contains(normalizedLabel, StringComparison.Ordinal))
                {
                    continue;
                }

                var separatorIndex = line.IndexOf(':');
                if (separatorIndex >= 0 && separatorIndex < line.Length - 1)
                {
                    var value = line[(separatorIndex + 1)..].Trim();
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        return value;
                    }
                }

                var tokenized = line.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                if (tokenized.Length > 1)
                {
                    return string.Join(' ', tokenized.Skip(1));
                }
            }
        }

        return null;
    }

    public static decimal ComputeOverallConfidence(DocumentType documentType, FinancialExtractionResult result, decimal dateConfidence, bool languageMatched)
    {
        var score = 0.2m;
        if (!string.IsNullOrWhiteSpace(result.VendorName) && !string.Equals(result.VendorName, "Unknown", StringComparison.OrdinalIgnoreCase))
        {
            score += 0.25m;
        }

        if (result.DocumentDate.HasValue)
        {
            score += 0.2m * Math.Max(0.5m, dateConfidence);
        }

        if (result.Total.HasValue)
        {
            score += 0.2m;
        }

        if (documentType == DocumentType.Invoice)
        {
            if (!string.IsNullOrWhiteSpace(result.DocumentNumber))
            {
                score += 0.1m;
            }

            if (result.Subtotal.HasValue || result.Gst.HasValue || result.Qst.HasValue || result.Hst.HasValue || result.Pst.HasValue)
            {
                score += 0.15m;
            }
        }

        if (languageMatched)
        {
            score += 0.05m;
        }

        return Math.Min(1m, score);
    }

    private static DocumentLanguage ResolveLanguage(DocumentLanguage requested, DocumentLanguage detected)
    {
        if (requested != DocumentLanguage.Unknown)
        {
            return requested;
        }

        return detected;
    }
}
