using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class VisionFallbackOcrProvider : IOcrProvider
{
    private readonly IServiceProvider _serviceProvider;
    private readonly OcrOptions _ocrOptions;

    public VisionFallbackOcrProvider(IServiceProvider serviceProvider, IOptions<OcrOptions> ocrOptions)
    {
        _serviceProvider = serviceProvider;
        _ocrOptions = ocrOptions.Value;
    }

    public OcrEngineType EngineType => OcrEngineType.VisionFallback;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        if (!_ocrOptions.VisionOcr.FallbackEnabled)
        {
            throw new NotSupportedException("Vision fallback OCR is disabled.");
        }

        if (string.Equals(_ocrOptions.VisionOcr.PreferredProvider, "GeminiFlashLite", StringComparison.OrdinalIgnoreCase))
        {
            if (!_ocrOptions.VisionOcr.GeminiFlashLite.Enabled)
            {
                throw new NotSupportedException("Gemini Flash Lite vision fallback provider is disabled.");
            }

            var gemini = _serviceProvider.GetServices<IOcrProvider>().FirstOrDefault(p => p.EngineType == OcrEngineType.GeminiFlashLite);
            if (gemini != null)
            {
                return gemini.ExtractAsync(request, cancellationToken);
            }
        }

        throw new NotSupportedException("No enabled vision fallback provider is registered.");
    }
}
