using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Api.Services;

public class FinancialDocumentValidator : IFinancialDocumentValidator
{
    private const decimal DefaultTolerance = 0.02m;

    public FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType)
    {
        var warnings = new List<ValidationWarning>();

        ValidateRequiredVendor(result, warnings);
        ValidateRequiredDate(result, warnings);
        ValidateRequiredTotal(result, warnings);

        if (documentType == DocumentType.Receipt)
        {
            ValidateReceipt(result, warnings);
        }
        else if (documentType == DocumentType.Invoice)
        {
            ValidateInvoice(result, warnings);
        }

        var errorCount = warnings.Count(w => w.Severity == ValidationSeverity.Error);
        var warningCount = warnings.Count(w => w.Severity == ValidationSeverity.Warning);
        var infoCount = warnings.Count(w => w.Severity == ValidationSeverity.Info);

        var confidenceAdjustment = CalculateConfidenceAdjustment(errorCount, warningCount, infoCount);
        var summary = BuildSummary(warnings, errorCount, warningCount, infoCount);

        return new FinancialValidationResult
        {
            IsValid = errorCount == 0,
            ConfidenceAdjustment = confidenceAdjustment,
            ValidationSummary = summary,
            Warnings = warnings,
            RequestedDocumentLanguage = result.RequestedDocumentLanguage,
            DetectedLanguage = result.DetectedLanguage,
            PreferredVisionProvider = result.PreferredVisionProvider,
            OcrEngineType = result.OcrEngineType,
            ProviderName = result.ProviderName,
            ModelName = result.ModelName,
            ProviderLatencyMs = result.ProviderLatencyMs,
            ProviderCostEstimate = result.ProviderCostEstimate
        };
    }

    private static void ValidateReceipt(FinancialExtractionResult result, List<ValidationWarning> warnings)
    {
        var hasAnyTaxOrTip = result.Gst.HasValue || result.Qst.HasValue || result.Hst.HasValue || result.Pst.HasValue || result.Tip.HasValue;

        if (!result.Subtotal.HasValue && hasAnyTaxOrTip && result.Total.HasValue)
        {
            warnings.Add(CreateWarning(
                "MissingSubtotal",
                "Subtotal is missing; total could not be fully validated against taxes and tip.",
                "Le sous-total est manquant; le total n'a pas pu être entièrement validé avec les taxes et le pourboire.",
                ValidationSeverity.Warning,
                nameof(FinancialExtractionResult.Subtotal)));
            return;
        }

        if (result.Subtotal.HasValue && result.Total.HasValue)
        {
            ValidateSubtotalTaxTotalConsistency(result, warnings, DefaultTolerance);
        }
    }

    private static void ValidateInvoice(FinancialExtractionResult result, List<ValidationWarning> warnings)
    {
        if (string.IsNullOrWhiteSpace(result.DocumentNumber))
        {
            warnings.Add(CreateWarning(
                "MissingInvoiceNumber",
                "Invoice number is missing.",
                "Le numéro de facture est manquant.",
                ValidationSeverity.Warning,
                nameof(FinancialExtractionResult.DocumentNumber)));
        }

        if (!result.DueDate.HasValue)
        {
            warnings.Add(CreateWarning(
                "MissingDueDate",
                "Due date is missing.",
                "La date d'échéance est manquante.",
                ValidationSeverity.Warning,
                nameof(FinancialExtractionResult.DueDate)));
        }

        if (!result.Total.HasValue)
        {
            return;
        }

        var hasAnyTaxOrTip = result.Gst.HasValue || result.Qst.HasValue || result.Hst.HasValue || result.Pst.HasValue || result.Tip.HasValue;

        if (result.LineItems.Count > 0)
        {
            var lineItemSum = result.LineItems.Where(li => li.Amount.HasValue).Sum(li => li.Amount!.Value);
            if (lineItemSum > 0m)
            {
                var expected = lineItemSum + (result.Gst ?? 0m) + (result.Qst ?? 0m) + (result.Hst ?? 0m) + (result.Pst ?? 0m) + (result.Tip ?? 0m) - (result.Discount ?? 0m);
                var delta = Math.Abs((result.Total ?? 0m) - expected);
                if (delta > DefaultTolerance)
                {
                    warnings.Add(CreateWarning(
                        "TaxTotalMismatch",
                        "Total does not match line items, taxes, tip, and discount within tolerance.",
                        "Le total ne correspond pas aux lignes, taxes, pourboire et remise dans la tolérance.",
                        ValidationSeverity.Error,
                        nameof(FinancialExtractionResult.Total)));
                }
                return;
            }
        }

        if (!result.Subtotal.HasValue && hasAnyTaxOrTip)
        {
            warnings.Add(CreateWarning(
                "MissingSubtotal",
                "Subtotal is missing; total could not be fully validated against taxes and tip.",
                "Le sous-total est manquant; le total n'a pas pu être entièrement validé avec les taxes et le pourboire.",
                ValidationSeverity.Warning,
                nameof(FinancialExtractionResult.Subtotal)));
            return;
        }

        if (result.Subtotal.HasValue)
        {
            ValidateSubtotalTaxTotalConsistency(result, warnings, DefaultTolerance);
        }
    }

    private static void ValidateRequiredVendor(FinancialExtractionResult result, List<ValidationWarning> warnings)
    {
        if (!string.IsNullOrWhiteSpace(result.VendorName) && !string.Equals(result.VendorName, "Unknown", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        warnings.Add(CreateWarning(
            "MissingVendor",
            "Vendor name is missing.",
            "Le nom du fournisseur est manquant.",
            ValidationSeverity.Error,
            nameof(FinancialExtractionResult.VendorName)));
    }

    private static void ValidateRequiredDate(FinancialExtractionResult result, List<ValidationWarning> warnings)
    {
        if (result.DocumentDate.HasValue)
        {
            return;
        }

        warnings.Add(CreateWarning(
            "MissingDate",
            "Document date is missing.",
            "La date du document est manquante.",
            ValidationSeverity.Error,
            nameof(FinancialExtractionResult.DocumentDate)));
    }

    private static void ValidateRequiredTotal(FinancialExtractionResult result, List<ValidationWarning> warnings)
    {
        if (result.Total.HasValue)
        {
            return;
        }

        warnings.Add(CreateWarning(
            "MissingTotal",
            "Total amount is missing.",
            "Le montant total est manquant.",
            ValidationSeverity.Error,
            nameof(FinancialExtractionResult.Total)));
    }

    private static void ValidateSubtotalTaxTotalConsistency(FinancialExtractionResult result, List<ValidationWarning> warnings, decimal tolerance)
    {
        var expected = (result.Subtotal ?? 0m) + (result.Gst ?? 0m) + (result.Qst ?? 0m) + (result.Hst ?? 0m) + (result.Pst ?? 0m) + (result.Tip ?? 0m);
        var delta = Math.Abs((result.Total ?? 0m) - expected);
        if (delta <= tolerance)
        {
            return;
        }

        warnings.Add(CreateWarning(
            "TaxTotalMismatch",
            "Total does not match subtotal, taxes, and tip within tolerance.",
            "Le total ne correspond pas au sous-total, aux taxes et au pourboire dans la tolérance.",
            ValidationSeverity.Error,
            nameof(FinancialExtractionResult.Total)));
    }

    private static ValidationWarning CreateWarning(string code, string messageEn, string messageFr, ValidationSeverity severity, string? fieldName)
    {
        return new ValidationWarning
        {
            Code = code,
            MessageEn = messageEn,
            MessageFr = messageFr,
            Severity = severity,
            FieldName = fieldName
        };
    }

    private static decimal CalculateConfidenceAdjustment(int errorCount, int warningCount, int infoCount)
    {
        var adjustment = 0m;
        adjustment -= errorCount * 0.25m;
        adjustment -= warningCount * 0.08m;
        adjustment -= infoCount * 0.02m;
        return Math.Max(-0.9m, adjustment);
    }

    private static string BuildSummary(IReadOnlyCollection<ValidationWarning> warnings, int errorCount, int warningCount, int infoCount)
    {
        if (warnings.Count == 0)
        {
            return "Validation passed";
        }

        return $"Validation found {errorCount} error(s), {warningCount} warning(s), {infoCount} info item(s).";
    }
}
