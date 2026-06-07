using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Api.Services;

public class FinancialDocumentValidator : IFinancialDocumentValidator
{
    public FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType)
    {
        var warnings = new List<ValidationWarning>();

        if (result.Subtotal.HasValue && result.Total.HasValue)
        {
            var expected = (result.Subtotal ?? 0m) + (result.Gst ?? 0m) + (result.Qst ?? 0m) + (result.Hst ?? 0m) + (result.Pst ?? 0m) + (result.Tip ?? 0m);
            var delta = Math.Abs((result.Total ?? 0m) - expected);
            if (delta > 0.05m)
            {
                warnings.Add(new ValidationWarning
                {
                    Code = "TOTAL_MISMATCH",
                    Message = "Total does not match Subtotal + taxes + tip within tolerance."
                });
            }
        }

        return new FinancialValidationResult
        {
            IsValid = warnings.Count == 0,
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
}
