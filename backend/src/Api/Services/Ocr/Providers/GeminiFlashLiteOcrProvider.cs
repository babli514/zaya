using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class GeminiFlashLiteOcrProvider : IOcrProvider
{
    private readonly OcrOptions _ocrOptions;

    public GeminiFlashLiteOcrProvider(IOptions<OcrOptions> ocrOptions)
    {
        _ocrOptions = ocrOptions.Value;
    }

    public OcrEngineType EngineType => OcrEngineType.GeminiFlashLite;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        var settings = _ocrOptions.VisionOcr.GeminiFlashLite;
        if (!settings.Enabled)
        {
            throw new NotSupportedException("Gemini Flash Lite provider is disabled.");
        }

        if (string.IsNullOrWhiteSpace(settings.ApiKey) || string.IsNullOrWhiteSpace(settings.Model) || settings.Model == "CONFIGURE_ACTUAL_MODEL_ID_HERE")
        {
            throw new InvalidOperationException("Gemini Flash Lite provider is enabled but not fully configured. Missing ApiKey or Model.");
        }

        return Task.FromResult(new OcrResult
        {
            RawText = string.Empty,
            PageCount = 0,
            Warnings = new List<string> { "Gemini Flash Lite integration is configured but not implemented yet." },
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = _ocrOptions.VisionOcr.PreferredProvider,
            OcrEngineType = EngineType,
            ProviderName = string.IsNullOrWhiteSpace(settings.ProviderName) ? "GoogleGemini" : settings.ProviderName,
            ModelName = settings.Model,
            ProviderLatencyMs = 0,
            ProviderCostEstimate = null,
            Confidence = 0m
        });
    }
}
