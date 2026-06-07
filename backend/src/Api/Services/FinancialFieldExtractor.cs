using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class FinancialFieldExtractor : IFinancialFieldExtractor
{
    private const decimal HighConfidenceDeterministicThreshold = 0.85m;
    private readonly RuleBasedFinancialExtractionProvider _ruleBasedProvider;
    private readonly IFinancialExtractionProviderSelector _providerSelector;
    private readonly FinancialExtractionOptions _options;
    private readonly IFinancialDocumentValidator _validator;

    public FinancialFieldExtractor()
    {
        var options = Microsoft.Extensions.Options.Options.Create(new FinancialExtractionOptions());
        _options = options.Value;
        _validator = new FinancialDocumentValidator();
        _ruleBasedProvider = new RuleBasedFinancialExtractionProvider();
        _providerSelector = new FinancialExtractionProviderSelector(
            options,
            _ruleBasedProvider,
            new GeminiFlashLiteFinancialExtractionProvider(options, _validator),
            new LlmFinancialExtractionProvider(options));
    }

    public FinancialFieldExtractor(
        RuleBasedFinancialExtractionProvider ruleBasedProvider,
        IFinancialExtractionProviderSelector providerSelector,
        IOptions<FinancialExtractionOptions> options,
        IFinancialDocumentValidator validator)
    {
        _ruleBasedProvider = ruleBasedProvider;
        _providerSelector = providerSelector;
        _options = options.Value;
        _validator = validator;
    }

    public async Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var ruleBasedResult = await _ruleBasedProvider.ExtractAsync(input, cancellationToken);
        var ruleBasedValidation = _validator.Validate(ruleBasedResult, input.DocumentType);
        var selectionInput = new FinancialExtractionProviderSelectionInput
        {
            DocumentType = input.DocumentType,
            RequestedLanguage = input.RequestedDocumentLanguage,
            DetectedLanguage = input.DetectedLanguage,
            RuleBasedConfidence = ruleBasedResult.Confidence,
            RuleBasedSucceeded = RuleBasedSucceeded(ruleBasedResult),
            RuleBasedHasRequiredFields = HasRequiredFields(ruleBasedResult, input.DocumentType)
        };

        var selectedProvider = _providerSelector.Select(selectionInput);
        if (string.Equals(selectedProvider.ProviderName, _ruleBasedProvider.ProviderName, StringComparison.OrdinalIgnoreCase))
        {
            return ruleBasedResult;
        }

        var llmResult = await selectedProvider.ExtractAsync(input, cancellationToken);
        llmResult.RequestedDocumentLanguage = input.RequestedDocumentLanguage;
        llmResult.DetectedLanguage = input.DetectedLanguage;
        llmResult.PreferredVisionProvider = input.PreferredVisionProvider;
        llmResult.OcrEngineType = input.OcrEngineType;
        llmResult.ProviderLatencyMs = input.ProviderLatencyMs;
        llmResult.ProviderCostEstimate = input.ProviderCostEstimate;

        if (!string.Equals(_options.Mode, "Hybrid", StringComparison.OrdinalIgnoreCase))
        {
            return llmResult;
        }

        var llmValidation = _validator.Validate(llmResult, input.DocumentType);
        var deterministicHighConfidence = (ruleBasedResult.Confidence ?? 0m) >= HighConfidenceDeterministicThreshold && ruleBasedValidation.IsValid;
        if (deterministicHighConfidence)
        {
            return ruleBasedResult;
        }

        var ruleCompleteness = ComputeCompletenessScore(ruleBasedResult, input.DocumentType);
        var llmCompleteness = ComputeCompletenessScore(llmResult, input.DocumentType);
        var ruleConfidence = ruleBasedResult.Confidence ?? 0m;
        var llmConfidence = llmResult.Confidence ?? 0m;

        if (llmValidation.IsValid && (!ruleBasedValidation.IsValid || llmCompleteness > ruleCompleteness || llmConfidence > ruleConfidence))
        {
            return llmResult;
        }

        if (ruleBasedValidation.IsValid)
        {
            return ruleBasedResult;
        }

        if (llmValidation.IsValid)
        {
            return llmResult;
        }

        var reviewResult = llmCompleteness >= ruleCompleteness ? llmResult : ruleBasedResult;
        reviewResult.Confidence = Math.Min(reviewResult.Confidence ?? 0.5m, 0.45m);
        return reviewResult;
    }

    private static int ComputeCompletenessScore(FinancialExtractionResult result, DocumentType documentType)
    {
        var score = 0;
        if (!string.IsNullOrWhiteSpace(result.VendorName) && !string.Equals(result.VendorName, "Unknown", StringComparison.OrdinalIgnoreCase)) score++;
        if (result.DocumentDate.HasValue) score++;
        if (result.Total.HasValue) score++;
        if (!string.IsNullOrWhiteSpace(result.Currency)) score++;
        if (result.Subtotal.HasValue) score++;
        if (result.Gst.HasValue || result.Qst.HasValue || result.Hst.HasValue || result.Pst.HasValue) score++;
        if (result.Tip.HasValue) score++;
        if (documentType == DocumentType.Invoice && !string.IsNullOrWhiteSpace(result.DocumentNumber)) score++;
        if (documentType == DocumentType.Invoice && result.DueDate.HasValue) score++;
        if (result.LineItems.Count > 0) score++;
        return score;
    }

    private static bool RuleBasedSucceeded(FinancialExtractionResult result)
    {
        return !string.IsNullOrWhiteSpace(result.VendorName)
            && !string.Equals(result.VendorName, "Unknown", StringComparison.OrdinalIgnoreCase)
            && result.Total.HasValue
            && result.DocumentDate.HasValue;
    }

    private static bool HasRequiredFields(FinancialExtractionResult result, DocumentType documentType)
    {
        if (!RuleBasedSucceeded(result))
        {
            return false;
        }

        if (documentType == DocumentType.Invoice)
        {
            return !string.IsNullOrWhiteSpace(result.DocumentNumber);
        }

        return true;
    }
}
