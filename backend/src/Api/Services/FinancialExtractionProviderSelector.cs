using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class FinancialExtractionProviderSelector : IFinancialExtractionProviderSelector
{
    private readonly FinancialExtractionOptions _options;
    private readonly RuleBasedFinancialExtractionProvider _ruleBasedProvider;
    private readonly GeminiFlashLiteFinancialExtractionProvider _geminiProvider;
    private readonly LlmFinancialExtractionProvider _llmProvider;

    public FinancialExtractionProviderSelector(
        IOptions<FinancialExtractionOptions> options,
        RuleBasedFinancialExtractionProvider ruleBasedProvider,
        GeminiFlashLiteFinancialExtractionProvider geminiProvider,
        LlmFinancialExtractionProvider llmProvider)
    {
        _options = options.Value;
        _ruleBasedProvider = ruleBasedProvider;
        _geminiProvider = geminiProvider;
        _llmProvider = llmProvider;
    }

    public IStructuredFinancialExtractionProvider Select(FinancialExtractionProviderSelectionInput input)
    {
        var mode = _options.Mode?.Trim();
        if (string.Equals(mode, "GeminiFlashLite", StringComparison.OrdinalIgnoreCase))
        {
            return SelectGeminiOrFallback();
        }

        if (string.Equals(mode, "Llm", StringComparison.OrdinalIgnoreCase))
        {
            return SelectLlmOrFallback();
        }

        if (string.Equals(mode, "Hybrid", StringComparison.OrdinalIgnoreCase))
        {
            if (ShouldUseLlmFallback(input))
            {
                if (_options.GeminiFlashLite.Enabled)
                {
                    return _geminiProvider;
                }

                if (_options.Llm.Enabled)
                {
                    return _llmProvider;
                }
            }

            return _ruleBasedProvider;
        }

        if (_options.RuleBased.Enabled)
        {
            return _ruleBasedProvider;
        }

        if (_options.GeminiFlashLite.Enabled)
        {
            return _geminiProvider;
        }

        if (_options.Llm.Enabled)
        {
            return _llmProvider;
        }

        throw new InvalidOperationException("Financial extraction mode is RuleBased but RuleBased provider is disabled and no alternative provider is enabled.");
    }

    private IStructuredFinancialExtractionProvider SelectGeminiOrFallback()
    {
        if (_options.GeminiFlashLite.Enabled)
        {
            return _geminiProvider;
        }

        if (_options.RuleBased.Enabled)
        {
            return _ruleBasedProvider;
        }

        if (_options.Llm.Enabled)
        {
            return _llmProvider;
        }

        throw new InvalidOperationException("Financial extraction mode is GeminiFlashLite but provider is disabled and no fallback provider is enabled.");
    }

    private IStructuredFinancialExtractionProvider SelectLlmOrFallback()
    {
        if (_options.Llm.Enabled)
        {
            return _llmProvider;
        }

        if (_options.RuleBased.Enabled)
        {
            return _ruleBasedProvider;
        }

        if (_options.GeminiFlashLite.Enabled)
        {
            return _geminiProvider;
        }

        throw new InvalidOperationException("Financial extraction mode is Llm but provider is disabled and no fallback provider is enabled.");
    }

    private bool ShouldUseLlmFallback(FinancialExtractionProviderSelectionInput input)
    {
        if (!input.RuleBasedSucceeded || !input.RuleBasedHasRequiredFields)
        {
            return true;
        }

        var threshold = _options.HybridLowConfidenceThreshold;
        if (input.DocumentType == DocumentType.Invoice)
        {
            threshold += 0.03m;
        }

        if (input.RequestedLanguage == DocumentLanguage.BilingualCanada || input.DetectedLanguage == DocumentLanguage.BilingualCanada)
        {
            threshold += 0.05m;
        }

        var confidence = input.RuleBasedConfidence ?? 0m;
        return confidence < threshold;
    }
}
