using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Api.Services;

public class ConfidenceScoringService : IConfidenceScoringService
{
    public decimal CalculateOverallConfidence(ConfidenceScoringInput input)
    {
        var confidence = 0.15m;

        confidence += (input.OcrConfidence ?? 0.55m) * 0.20m;
        confidence += (input.StructuredExtractionConfidence ?? 0.55m) * 0.20m;

        confidence += input.DocumentType == DocumentType.Invoice
            ? ScoreInvoice(input)
            : ScoreReceipt(input);

        confidence += ScoreValidation(input);
        confidence += ScoreLanguageSignals(input);
        confidence += ScoreFallbackAndGemini(input);

        if (input.DocumentType == DocumentType.Invoice && input.GeminiExtractionConflictsWithDeterministic)
        {
            confidence -= input.ValidationResult.IsValid ? 0.03m : 0.08m;
        }

        if (HasLanguageMismatch(input.RequestedDocumentLanguage, input.DetectedDocumentLanguage))
        {
            confidence *= 0.92m;
        }

        return Clamp(confidence);
    }

    private static decimal ScoreReceipt(ConfidenceScoringInput input)
    {
        var result = input.ExtractionResult;
        var score = 0m;

        if (HasVendor(result.VendorName))
        {
            score += 0.10m;
        }

        if (result.DocumentDate.HasValue)
        {
            score += 0.10m;
        }

        if (result.Total.HasValue)
        {
            score += 0.20m;
        }

        if (result.Subtotal.HasValue && (result.Gst.HasValue || result.Qst.HasValue))
        {
            score += 0.07m;
        }

        var hasGstAndQst = result.Gst.HasValue && result.Qst.HasValue;
        if (result.Subtotal.HasValue && hasGstAndQst && input.ValidationResult.IsValid)
        {
            score += 0.04m;
        }

        if (input.OcrConfidence.HasValue && input.OcrConfidence.Value < 0.55m)
        {
            score -= 0.07m;
        }

        return score;
    }

    private static decimal ScoreInvoice(ConfidenceScoringInput input)
    {
        var result = input.ExtractionResult;
        var score = 0m;

        if (HasVendor(result.VendorName))
        {
            score += 0.08m;
        }

        if (!string.IsNullOrWhiteSpace(result.DocumentNumber))
        {
            score += 0.09m;
        }

        if (result.DocumentDate.HasValue)
        {
            score += 0.08m;
        }

        if (result.Total.HasValue)
        {
            score += 0.20m;
        }

        if (result.DueDate.HasValue)
        {
            score += 0.04m;
        }

        return score;
    }

    private static decimal ScoreValidation(ConfidenceScoringInput input)
    {
        var adjustment = 0m;
        var hasTaxMismatch = input.ValidationResult.Warnings.Any(w => string.Equals(w.Code, "TaxTotalMismatch", StringComparison.OrdinalIgnoreCase));

        if (input.ValidationResult.IsValid)
        {
            adjustment += 0.06m;

            if (!hasTaxMismatch)
            {
                adjustment += 0.03m;
            }
            else
            {
                adjustment -= 0.14m;
            }
        }
        else
        {
            adjustment -= 0.10m;
            if (hasTaxMismatch)
            {
                adjustment -= 0.17m;
            }
        }

        adjustment += input.ValidationResult.ConfidenceAdjustment * 0.35m;

        var errorCount = input.ValidationResult.Warnings.Count(w => w.Severity == ValidationSeverity.Error);
        adjustment -= errorCount * 0.03m;

        return adjustment;
    }

    private static decimal ScoreLanguageSignals(ConfidenceScoringInput input)
    {
        var requested = input.RequestedDocumentLanguage;
        var detected = input.DetectedDocumentLanguage;

        if (requested == DocumentLanguage.Unknown || detected == DocumentLanguage.Unknown || requested == DocumentLanguage.BilingualCanada)
        {
            return 0m;
        }

        if (requested == detected)
        {
            return 0.03m;
        }

        return -0.04m;
    }

    private static decimal ScoreFallbackAndGemini(ConfidenceScoringInput input)
    {
        var score = 0m;

        if (input.FallbackNeeded)
        {
            score -= 0.04m;
        }

        if (!input.GeminiFlashLiteUsed)
        {
            return score;
        }

        if (input.GeminiUsedAfterLowConfidencePrimary && input.ValidationResult.IsValid)
        {
            score += 0.08m;
        }

        if (!input.ValidationResult.IsValid)
        {
            score -= 0.10m;
        }

        return score;
    }

    private static bool HasLanguageMismatch(DocumentLanguage requested, DocumentLanguage detected)
    {
        if (requested == DocumentLanguage.Unknown || detected == DocumentLanguage.Unknown)
        {
            return false;
        }

        if (requested == DocumentLanguage.BilingualCanada || detected == DocumentLanguage.BilingualCanada)
        {
            return false;
        }

        return requested != detected;
    }

    private static bool HasVendor(string? vendorName)
    {
        return !string.IsNullOrWhiteSpace(vendorName)
            && !string.Equals(vendorName, "Unknown", StringComparison.OrdinalIgnoreCase);
    }

    private static decimal Clamp(decimal value)
    {
        if (value < 0m)
        {
            return 0m;
        }

        if (value > 1m)
        {
            return 1m;
        }

        return value;
    }
}
