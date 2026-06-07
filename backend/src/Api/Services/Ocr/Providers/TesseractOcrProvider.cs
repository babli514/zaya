using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Diagnostics;

namespace FinancialOCR.Api.Services;

public class TesseractOcrProvider : IOcrProvider
{
    private const decimal LowConfidenceThreshold = 0.6m;
    private const int MeaningfulTextThreshold = 40;
    private readonly OcrOptions _ocrOptions;
    private readonly ITesseractOcrEngineAdapter _adapter;

    public TesseractOcrProvider(IOptions<OcrOptions> ocrOptions, ITesseractOcrEngineAdapter adapter)
    {
        _ocrOptions = ocrOptions.Value;
        _adapter = adapter;
    }

    public OcrEngineType EngineType => OcrEngineType.Tesseract;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        if (!IsSupportedImage(request))
        {
            throw new NotSupportedException("Tesseract OCR provider supports only PNG, JPG, JPEG, and WEBP images.");
        }

        var dataPath = ResolveDataPath(_ocrOptions.TesseractDataPath);
        if (!Directory.Exists(dataPath))
        {
            throw new InvalidOperationException($"Tesseract data path '{dataPath}' was not found.");
        }

        var warnings = new List<string>();
        var selectedLanguage = ResolveLanguageCode(request.RequestedDocumentLanguage, _ocrOptions);
        var executableLanguage = ResolveExecutableLanguage(selectedLanguage, _ocrOptions, dataPath, warnings);

        var stopwatch = Stopwatch.StartNew();
        TesseractAdapterResult adapterResult;
        try
        {
            adapterResult = _adapter.Extract(dataPath, executableLanguage, request.FilePath, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Tesseract OCR failed: {ex.Message}", ex);
        }

        stopwatch.Stop();

        var rawText = adapterResult.RawText;
        var normalizedLength = NativePdfTextOcrProvider.CountNonWhitespaceCharacters(rawText);
        var confidence = NormalizeConfidence(adapterResult.Confidence);

        if (string.IsNullOrWhiteSpace(rawText))
        {
            warnings.Add("Extracted text is empty.");
        }
        else if (normalizedLength < MeaningfulTextThreshold)
        {
            warnings.Add("Extracted text is too short for reliable field extraction.");
        }

        if (confidence.HasValue && confidence.Value < LowConfidenceThreshold)
        {
            warnings.Add("Tesseract confidence is low.");
        }

        return Task.FromResult(new OcrResult
        {
            RawText = rawText,
            PageCount = 1,
            Warnings = warnings,
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = request.PreferredVisionProvider,
            OcrEngineType = EngineType,
            ProviderName = "Tesseract",
            ModelName = executableLanguage,
            ProviderLatencyMs = stopwatch.ElapsedMilliseconds,
            Confidence = confidence
        });
    }

    internal static bool IsSupportedImage(OcrRequest request)
    {
        var extension = Path.GetExtension(request.FilePath);
        return OcrRouter.IsSupportedImageFile(extension, request.ContentType);
    }

    internal static string ResolveDataPath(string configuredPath)
    {
        if (Path.IsPathRooted(configuredPath))
        {
            return configuredPath;
        }

        return Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, configuredPath));
    }

    internal static string ResolveLanguageCode(DocumentLanguage documentLanguage, OcrOptions options)
    {
        return documentLanguage switch
        {
            DocumentLanguage.EnglishCanada => options.EnglishLanguage,
            DocumentLanguage.FrenchCanada => options.FrenchLanguage,
            DocumentLanguage.BilingualCanada => options.BilingualLanguage,
            _ => string.IsNullOrWhiteSpace(options.DefaultLanguage) ? options.BilingualLanguage : options.DefaultLanguage
        };
    }

    internal static string ResolveExecutableLanguage(string selectedLanguage, OcrOptions options, string dataPath, List<string> warnings)
    {
        if (HasLanguageData(selectedLanguage, dataPath))
        {
            return selectedLanguage;
        }

        if (string.Equals(selectedLanguage, options.BilingualLanguage, StringComparison.OrdinalIgnoreCase))
        {
            if (HasLanguageData(options.EnglishLanguage, dataPath))
            {
                warnings.Add($"Language '{selectedLanguage}' is unavailable. Falling back to '{options.EnglishLanguage}'.");
                return options.EnglishLanguage;
            }

            throw new InvalidOperationException($"Neither '{selectedLanguage}' nor fallback '{options.EnglishLanguage}' language data were found in '{dataPath}'.");
        }

        throw new InvalidOperationException($"Tesseract language data for '{selectedLanguage}' were not found in '{dataPath}'.");
    }

    internal static bool HasLanguageData(string languageCode, string dataPath)
    {
        if (string.IsNullOrWhiteSpace(languageCode))
        {
            return false;
        }

        var languageTokens = languageCode.Split('+', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        if (languageTokens.Length == 0)
        {
            return false;
        }

        foreach (var token in languageTokens)
        {
            var trainedDataPath = Path.Combine(dataPath, token + ".traineddata");
            if (!File.Exists(trainedDataPath))
            {
                return false;
            }
        }

        return true;
    }

    internal static decimal? NormalizeConfidence(decimal? rawConfidence)
    {
        if (!rawConfidence.HasValue)
        {
            return null;
        }

        var confidence = rawConfidence.Value;
        if (confidence > 1m)
        {
            confidence /= 100m;
        }

        if (confidence < 0m)
        {
            return 0m;
        }

        if (confidence > 1m)
        {
            return 1m;
        }

        return confidence;
    }
}
