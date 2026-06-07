using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public class OcrRouter : IOcrRouter
{
    private readonly OcrOptions _ocrOptions;

    public OcrRouter(IOptions<OcrOptions> ocrOptions)
    {
        _ocrOptions = ocrOptions.Value;
    }

    public Task<OcrRouteDecision> SelectRouteAsync(Document document, CancellationToken cancellationToken)
    {
        var isPdf = string.Equals(document.FileExtension, ".pdf", StringComparison.OrdinalIgnoreCase)
            || string.Equals(document.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase);

        var preferredVisionProvider = string.IsNullOrWhiteSpace(_ocrOptions.PreferredVisionProvider)
            ? "Gemini"
            : _ocrOptions.PreferredVisionProvider;

        var modelName = string.IsNullOrWhiteSpace(_ocrOptions.GeminiModelName)
            ? "configured-at-runtime"
            : _ocrOptions.GeminiModelName;

        var engineType = OcrEngineType.VisionFallback;
        var providerName = preferredVisionProvider;

        if (isPdf && _ocrOptions.EnableNativePdfText)
        {
            engineType = OcrEngineType.NativePdfText;
            providerName = "NativePdf";
        }
        else if (_ocrOptions.EnableTesseract)
        {
            engineType = OcrEngineType.Tesseract;
            providerName = "Tesseract";
        }
        else if (_ocrOptions.PreferVisionFallback)
        {
            engineType = OcrEngineType.GeminiFlashLite;
            providerName = preferredVisionProvider;
        }

        return Task.FromResult(new OcrRouteDecision
        {
            OcrEngineType = engineType,
            RequestedDocumentLanguage = document.DocumentLanguage,
            DetectedLanguage = document.DocumentLanguage,
            PreferredVisionProvider = preferredVisionProvider,
            ProviderName = providerName,
            ModelName = modelName,
            UseVisionFallback = engineType is OcrEngineType.GeminiFlashLite or OcrEngineType.VisionFallback
        });
    }
}

public class NativePdfTextOcrProvider : IOcrProvider
{
    public OcrEngineType EngineType => OcrEngineType.NativePdfText;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        return Task.FromResult(new OcrResult
        {
            RawText = "Placeholder native PDF text extraction result",
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = request.PreferredVisionProvider,
            OcrEngineType = EngineType,
            ProviderName = "NativePdf",
            ModelName = "embedded-text-extractor",
            ProviderLatencyMs = 5,
            Confidence = 0.95m
        });
    }
}

public class TesseractOcrProvider : IOcrProvider
{
    public OcrEngineType EngineType => OcrEngineType.Tesseract;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        return Task.FromResult(new OcrResult
        {
            RawText = "Placeholder tesseract OCR result",
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = request.PreferredVisionProvider,
            OcrEngineType = EngineType,
            ProviderName = "Tesseract",
            ModelName = "tesseract-configured",
            ProviderLatencyMs = 35,
            Confidence = 0.82m
        });
    }
}

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
        var providerName = string.IsNullOrWhiteSpace(_ocrOptions.PreferredVisionProvider)
            ? "Gemini"
            : _ocrOptions.PreferredVisionProvider;

        var modelName = string.IsNullOrWhiteSpace(_ocrOptions.GeminiModelName)
            ? "configured-at-runtime"
            : _ocrOptions.GeminiModelName;

        return Task.FromResult(new OcrResult
        {
            RawText = "Placeholder gemini flash lite OCR result",
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = providerName,
            OcrEngineType = EngineType,
            ProviderName = providerName,
            ModelName = modelName,
            ProviderLatencyMs = 120,
            Confidence = 0.9m
        });
    }
}

public class VisionFallbackOcrProvider : IOcrProvider
{
    private readonly OcrOptions _ocrOptions;

    public VisionFallbackOcrProvider(IOptions<OcrOptions> ocrOptions)
    {
        _ocrOptions = ocrOptions.Value;
    }

    public OcrEngineType EngineType => OcrEngineType.VisionFallback;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        var providerName = string.IsNullOrWhiteSpace(_ocrOptions.PreferredVisionProvider)
            ? "Gemini"
            : _ocrOptions.PreferredVisionProvider;

        var modelName = string.IsNullOrWhiteSpace(_ocrOptions.GeminiModelName)
            ? "configured-at-runtime"
            : _ocrOptions.GeminiModelName;

        return Task.FromResult(new OcrResult
        {
            RawText = "Placeholder vision fallback OCR result",
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = providerName,
            OcrEngineType = EngineType,
            ProviderName = providerName,
            ModelName = modelName,
            ProviderLatencyMs = 180,
            Confidence = 0.75m
        });
    }
}

public class LanguageDetectionService : ILanguageDetectionService
{
    public DocumentLanguage DetectLanguage(string rawText)
    {
        if (string.IsNullOrWhiteSpace(rawText))
        {
            return DocumentLanguage.Unknown;
        }

        var normalized = rawText.ToLowerInvariant();
        if (normalized.Contains("taxe") || normalized.Contains("total tps") || normalized.Contains("total tvq"))
        {
            return DocumentLanguage.FrenchCanada;
        }

        if (normalized.Contains("gst") || normalized.Contains("receipt") || normalized.Contains("invoice"))
        {
            return DocumentLanguage.EnglishCanada;
        }

        return DocumentLanguage.Unknown;
    }
}

public class FinancialFieldExtractor : IFinancialFieldExtractor
{
    public Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        return Task.FromResult(new FinancialExtractionResult
        {
            VendorName = "Placeholder Vendor",
            Currency = "CAD",
            Subtotal = 100.00m,
            Gst = 5.00m,
            Qst = 9.98m,
            Total = 114.98m,
            Confidence = 0.80m,
            RequestedDocumentLanguage = input.RequestedDocumentLanguage,
            DetectedLanguage = input.DetectedLanguage,
            PreferredVisionProvider = input.PreferredVisionProvider,
            OcrEngineType = input.OcrEngineType,
            ProviderName = input.ProviderName,
            ModelName = input.ModelName,
            ProviderLatencyMs = input.ProviderLatencyMs,
            ProviderCostEstimate = input.ProviderCostEstimate
        });
    }
}

public class FinancialDocumentValidator : IFinancialDocumentValidator
{
    public FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType)
    {
        var warnings = new List<ValidationWarning>();

        if (result.Subtotal.HasValue && result.Total.HasValue)
        {
            var expected = (result.Subtotal ?? 0m) + (result.Gst ?? 0m) + (result.Qst ?? 0m);
            var delta = Math.Abs((result.Total ?? 0m) - expected);
            if (delta > 0.05m)
            {
                warnings.Add(new ValidationWarning
                {
                    Code = "TOTAL_MISMATCH",
                    Message = "Total does not match Subtotal + GST/TPS + QST/TVQ within tolerance."
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
