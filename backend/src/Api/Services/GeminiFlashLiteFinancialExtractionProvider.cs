using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class GeminiFlashLiteFinancialExtractionProvider : IStructuredFinancialExtractionProvider
{
    private readonly FinancialExtractionOptions _options;

    public GeminiFlashLiteFinancialExtractionProvider(IOptions<FinancialExtractionOptions> options)
    {
        _options = options.Value;
    }

    public string ProviderName => string.IsNullOrWhiteSpace(_options.GeminiFlashLite.ProviderName)
        ? "GeminiFlashLite"
        : _options.GeminiFlashLite.ProviderName;

    public Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var settings = _options.GeminiFlashLite;
        if (!settings.Enabled)
        {
            throw new NotSupportedException("Gemini Flash Lite structured extraction provider is disabled.");
        }

        if (string.IsNullOrWhiteSpace(settings.ApiKey) || string.IsNullOrWhiteSpace(settings.Model) || string.Equals(settings.Model, "CONFIGURE_ACTUAL_MODEL_ID_HERE", StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Gemini Flash Lite structured extraction provider is enabled but missing required configuration values: ApiKey and/or Model.");
        }

        if (string.IsNullOrWhiteSpace(settings.ProviderName))
        {
            throw new InvalidOperationException("Gemini Flash Lite structured extraction provider is enabled but ProviderName is missing.");
        }

        throw new NotSupportedException("Gemini Flash Lite structured extraction is configured but real API integration is not implemented. Configure exact SDK/API package and model id before enabling live extraction.");
    }

    public static string BuildStructuredPrompt(DocumentLanguage requestedLanguage, DocumentLanguage detectedLanguage)
    {
        var requested = requestedLanguage.ToString();
        var detected = detectedLanguage.ToString();
        return $"You are extracting structured financial fields from OCR text for Canadian documents. RequestedLanguage={requested}; DetectedLanguage={detected}. Extract only values present in OCR text. Do not guess missing values. Preserve Canadian French accents. Preserve exact document number/numéro de facture. Preserve original vendor and customer names. Do not translate vendor names, customer names, labels, document numbers, or values. Normalize GST/TPS to Gst. Normalize QST/TVQ to Qst. Normalize HST/TVH to Hst. Normalize PST/TVP to Pst. Normalize Tip/Pourboire to Tip. Return null for missing fields. Default currency to CAD only if no other currency appears. Parse totals carefully. Support English, French, and bilingual labels. Return per-field confidence if possible. Return strict JSON only matching the required schema.";
    }
}
