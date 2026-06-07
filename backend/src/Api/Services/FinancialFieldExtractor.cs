using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class FinancialFieldExtractor : IFinancialFieldExtractor
{
    private readonly RuleBasedFinancialExtractionProvider _ruleBasedProvider;
    private readonly IFinancialExtractionProviderSelector _providerSelector;

    public FinancialFieldExtractor()
    {
        var options = Microsoft.Extensions.Options.Options.Create(new FinancialExtractionOptions());
        _ruleBasedProvider = new RuleBasedFinancialExtractionProvider();
        _providerSelector = new FinancialExtractionProviderSelector(
            options,
            _ruleBasedProvider,
            new GeminiFlashLiteFinancialExtractionProvider(options),
            new LlmFinancialExtractionProvider(options));
    }

    public FinancialFieldExtractor(
        RuleBasedFinancialExtractionProvider ruleBasedProvider,
        IFinancialExtractionProviderSelector providerSelector)
    {
        _ruleBasedProvider = ruleBasedProvider;
        _providerSelector = providerSelector;
    }

    public async Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var ruleBasedResult = await _ruleBasedProvider.ExtractAsync(input, cancellationToken);
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
        return llmResult;
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
