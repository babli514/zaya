using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class LlmFinancialExtractionProvider : IStructuredFinancialExtractionProvider
{
    private readonly FinancialExtractionOptions _options;

    public LlmFinancialExtractionProvider(IOptions<FinancialExtractionOptions> options)
    {
        _options = options.Value;
    }

    public string ProviderName => string.IsNullOrWhiteSpace(_options.Llm.ProviderName)
        ? "Llm"
        : _options.Llm.ProviderName;

    public Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var settings = _options.Llm;
        if (!settings.Enabled)
        {
            throw new NotSupportedException("Generic LLM structured extraction provider is disabled.");
        }

        if (string.IsNullOrWhiteSpace(settings.ProviderName)
            || string.IsNullOrWhiteSpace(settings.Model)
            || string.IsNullOrWhiteSpace(settings.Endpoint)
            || string.IsNullOrWhiteSpace(settings.ApiKey))
        {
            throw new InvalidOperationException("Generic LLM structured extraction provider is enabled but not fully configured. Required: ProviderName, Model, Endpoint, ApiKey.");
        }

        throw new NotSupportedException("Generic LLM structured extraction is configured but no concrete vendor adapter is implemented.");
    }
}
