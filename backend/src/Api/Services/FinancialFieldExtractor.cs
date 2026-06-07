using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Api.Services;

public class FinancialFieldExtractor : IFinancialFieldExtractor
{
    public Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var lines = TextNormalizationHelper.SplitLines(input.RawText);
        var normalizedLines = lines.Select(TextNormalizationHelper.NormalizeForMatching).ToList();

        var result = new FinancialExtractionResult
        {
            VendorName = ExtractVendorName(lines, input.RequestedDocumentLanguage, input.DetectedLanguage),
            CustomerName = LanguageAwareFieldExtractor.TryExtractTextAfterLabel(
                lines,
                LanguageAwareFieldExtractor.PrioritizeLabels(
                    input.RequestedDocumentLanguage,
                    input.DetectedLanguage,
                    BilingualFinancialLabelPatterns.CustomerEnglishLabels,
                    BilingualFinancialLabelPatterns.CustomerFrenchLabels)),
            DocumentNumber = LanguageAwareFieldExtractor.TryExtractTextAfterLabel(
                lines,
                LanguageAwareFieldExtractor.PrioritizeLabels(
                    input.RequestedDocumentLanguage,
                    input.DetectedLanguage,
                    BilingualFinancialLabelPatterns.InvoiceNumberEnglishLabels,
                    BilingualFinancialLabelPatterns.InvoiceNumberFrenchLabels)),
            Currency = DetectCurrency(input.RawText),
            RequestedDocumentLanguage = input.RequestedDocumentLanguage,
            DetectedLanguage = input.DetectedLanguage,
            PreferredVisionProvider = input.PreferredVisionProvider,
            OcrEngineType = input.OcrEngineType,
            ProviderName = input.ProviderName,
            ModelName = input.ModelName,
            ProviderLatencyMs = input.ProviderLatencyMs,
            ProviderCostEstimate = input.ProviderCostEstimate
        };

        ExtractAmounts(lines, normalizedLines, result);
        var dateConfidence = ExtractDates(lines, normalizedLines, input, result);
        var languageMatched = LanguageMatchesLabels(normalizedLines, input.RequestedDocumentLanguage, input.DetectedLanguage);
        result.Confidence = LanguageAwareFieldExtractor.ComputeOverallConfidence(input.DocumentType, result, dateConfidence, languageMatched);

        return Task.FromResult(result);
    }

    private static string ExtractVendorName(IReadOnlyList<string> lines, DocumentLanguage requestedLanguage, DocumentLanguage detectedLanguage)
    {
        var prioritizedLabels = LanguageAwareFieldExtractor.PrioritizeLabels(
            requestedLanguage,
            detectedLanguage,
            BilingualFinancialLabelPatterns.VendorEnglishLabels,
            BilingualFinancialLabelPatterns.VendorFrenchLabels);
        var labeled = LanguageAwareFieldExtractor.TryExtractTextAfterLabel(lines, prioritizedLabels);
        if (!string.IsNullOrWhiteSpace(labeled))
        {
            return labeled;
        }

        foreach (var line in lines.Take(5))
        {
            if (line.Length > 2 && !MoneyParser.TryExtractAmountFromLine(line, out _))
            {
                return line.Trim();
            }
        }

        return "Unknown";
    }

    private static string DetectCurrency(string rawText)
    {
        var normalized = TextNormalizationHelper.NormalizeForMatching(rawText);
        if (normalized.Contains("usd", StringComparison.Ordinal) || normalized.Contains("us$", StringComparison.Ordinal))
        {
            return "USD";
        }

        if (normalized.Contains("eur", StringComparison.Ordinal))
        {
            return "EUR";
        }

        return "CAD";
    }

    private static void ExtractAmounts(IReadOnlyList<string> lines, IReadOnlyList<string> normalizedLines, FinancialExtractionResult result)
    {
        for (var i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            var normalized = normalizedLines[i];

            if (!MoneyParser.TryExtractAmountFromLine(line, out var amount))
            {
                continue;
            }

            if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.SubtotalLabels) && !result.Subtotal.HasValue)
            {
                result.Subtotal = amount;
                continue;
            }

            if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.TipLabels) && !result.Tip.HasValue)
            {
                result.Tip = amount;
                continue;
            }

            if (TryExtractTaxAmount(normalized, amount, result))
            {
                continue;
            }

            if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.TotalLabels) && !result.Total.HasValue)
            {
                result.Total = amount;
            }
        }

        if (!result.Total.HasValue)
        {
            var allAmounts = lines
                .Select(line => MoneyParser.TryExtractAmountFromLine(line, out var value) ? value : (decimal?)null)
                .Where(value => value.HasValue)
                .Select(value => value!.Value)
                .ToList();
            if (allAmounts.Count > 0)
            {
                result.Total = allAmounts.Max();
            }
        }
    }

    private static bool TryExtractTaxAmount(string normalizedLine, decimal amount, FinancialExtractionResult result)
    {
        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.GstLabels) && !result.Gst.HasValue)
        {
            result.Gst = amount;
            return true;
        }

        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.QstLabels) && !result.Qst.HasValue)
        {
            result.Qst = amount;
            return true;
        }

        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.HstLabels) && !result.Hst.HasValue)
        {
            result.Hst = amount;
            return true;
        }

        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.PstLabels) && !result.Pst.HasValue)
        {
            result.Pst = amount;
            return true;
        }

        return false;
    }

    private static decimal ExtractDates(IReadOnlyList<string> lines, IReadOnlyList<string> normalizedLines, FinancialExtractionInput input, FinancialExtractionResult result)
    {
        var dateConfidence = 0m;
        for (var i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            var normalized = normalizedLines[i];
            if (!DateParser.TryFindDateInLine(line, input.DetectedLanguage == DocumentLanguage.Unknown ? input.RequestedDocumentLanguage : input.DetectedLanguage, out var parsedDate, out var confidence))
            {
                continue;
            }

            if (!result.DocumentDate.HasValue && BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.DateLabels))
            {
                result.DocumentDate = parsedDate;
                dateConfidence = Math.Max(dateConfidence, confidence);
                continue;
            }

            var dueLabels = LanguageAwareFieldExtractor.PrioritizeLabels(
                input.RequestedDocumentLanguage,
                input.DetectedLanguage,
                ["due date"],
                ["date d'echeance", "date d’échéance", "date echeance", "echeance", "échéance"]);
            if (!result.DueDate.HasValue && BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, dueLabels))
            {
                result.DueDate = parsedDate;
                dateConfidence = Math.Max(dateConfidence, confidence);
                continue;
            }

            if (!result.DocumentDate.HasValue)
            {
                result.DocumentDate = parsedDate;
                dateConfidence = Math.Max(dateConfidence, confidence * 0.85m);
            }
        }

        return dateConfidence;
    }

    private static bool LanguageMatchesLabels(IReadOnlyList<string> normalizedLines, DocumentLanguage requestedLanguage, DocumentLanguage detectedLanguage)
    {
        var preferred = requestedLanguage != DocumentLanguage.Unknown ? requestedLanguage : detectedLanguage;
        if (preferred == DocumentLanguage.Unknown || preferred == DocumentLanguage.BilingualCanada)
        {
            return false;
        }

        var frenchSignals = new[] { "sous-total", "montant", "facture", "recu", "reçu", "pourboire", "echeance", "échéance", "tvq", "tps" };
        var englishSignals = new[] { "subtotal", "invoice", "receipt", "tip", "due date", "balance due", "amount due", "gst", "qst" };
        var signalSet = preferred == DocumentLanguage.FrenchCanada ? frenchSignals : englishSignals;
        return normalizedLines.Any(line => signalSet.Any(signal => line.Contains(TextNormalizationHelper.NormalizeForMatching(signal), StringComparison.Ordinal)));
    }
}
