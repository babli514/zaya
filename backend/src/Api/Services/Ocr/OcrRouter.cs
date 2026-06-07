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
        var fileExtension = document.FileExtension ?? string.Empty;
        var contentType = document.ContentType ?? string.Empty;
        var isPdf = string.Equals(fileExtension, ".pdf", StringComparison.OrdinalIgnoreCase)
            || string.Equals(contentType, "application/pdf", StringComparison.OrdinalIgnoreCase);
        var isImage = IsSupportedImageFile(fileExtension, contentType);

        var vision = _ocrOptions.VisionOcr;
        var engineType = OcrEngineType.Unknown;
        var providerName = "Unsupported";

        if (isPdf && _ocrOptions.EnableNativePdfText)
        {
            engineType = OcrEngineType.NativePdfText;
            providerName = "NativePdf";
        }
        else if (isImage && _ocrOptions.EnableTesseract)
        {
            engineType = OcrEngineType.Tesseract;
            providerName = "Tesseract";
        }
        else if (vision.FallbackEnabled)
        {
            engineType = OcrEngineType.VisionFallback;
            providerName = vision.PreferredProvider;
        }

        return Task.FromResult(new OcrRouteDecision
        {
            OcrEngineType = engineType,
            RequestedDocumentLanguage = document.DocumentLanguage,
            DetectedLanguage = document.DocumentLanguage,
            PreferredVisionProvider = string.IsNullOrWhiteSpace(_ocrOptions.PreferredFallbackProvider)
                ? vision.PreferredProvider
                : _ocrOptions.PreferredFallbackProvider,
            ProviderName = providerName,
            ModelName = string.Empty,
            IsPdf = isPdf,
            IsImage = isImage,
            EnableFallback = vision.FallbackEnabled,
            FallbackOcrEngineType = OcrEngineType.VisionFallback,
            MinimumOcrConfidence = _ocrOptions.MinimumOcrConfidence,
            MinimumRawTextLength = _ocrOptions.MinimumRawTextLength,
            EnableFallbackOnLowConfidence = _ocrOptions.EnableFallbackOnLowConfidence,
            EnableFallbackOnValidationFailure = _ocrOptions.EnableFallbackOnValidationFailure,
            AutoCompleteConfidenceThreshold = _ocrOptions.AutoCompleteConfidenceThreshold
        });
    }

    internal static bool IsSupportedImageFile(string fileExtension, string contentType)
    {
        return string.Equals(fileExtension, ".png", StringComparison.OrdinalIgnoreCase)
            || string.Equals(fileExtension, ".jpg", StringComparison.OrdinalIgnoreCase)
            || string.Equals(fileExtension, ".jpeg", StringComparison.OrdinalIgnoreCase)
            || string.Equals(fileExtension, ".webp", StringComparison.OrdinalIgnoreCase)
            || string.Equals(contentType, "image/png", StringComparison.OrdinalIgnoreCase)
            || string.Equals(contentType, "image/jpg", StringComparison.OrdinalIgnoreCase)
            || string.Equals(contentType, "image/jpeg", StringComparison.OrdinalIgnoreCase)
            || string.Equals(contentType, "image/webp", StringComparison.OrdinalIgnoreCase);
    }
}
