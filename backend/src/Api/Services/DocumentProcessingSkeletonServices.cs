using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Text;
using Tesseract;
using UglyToad.PdfPig;

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
        var preferredVisionProvider = string.IsNullOrWhiteSpace(_ocrOptions.PreferredVisionProvider)
            ? "Gemini"
            : _ocrOptions.PreferredVisionProvider;

        var engineType = OcrEngineType.Unknown;
        var providerName = "Unsupported";

        if (isPdf)
        {
            engineType = OcrEngineType.NativePdfText;
            providerName = "NativePdf";
        }
        else if (isImage)
        {
            engineType = OcrEngineType.Tesseract;
            providerName = "Tesseract";
        }

        return Task.FromResult(new OcrRouteDecision
        {
            OcrEngineType = engineType,
            RequestedDocumentLanguage = document.DocumentLanguage,
            DetectedLanguage = document.DocumentLanguage,
            PreferredVisionProvider = preferredVisionProvider,
            ProviderName = providerName,
            ModelName = string.Empty,
            UseVisionFallback = true
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

public class NativePdfTextOcrProvider : IOcrProvider
{
    private const int MeaningfulTextThreshold = 40;

    public OcrEngineType EngineType => OcrEngineType.NativePdfText;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        if (!IsPdf(request))
        {
            throw new NotSupportedException("Native PDF text extraction supports only PDF documents.");
        }

        var stopwatch = Stopwatch.StartNew();
        var warnings = new List<string>();
        var pageTexts = new List<string>();
        var pageCount = 0;

        using (var pdfDocument = PdfDocument.Open(request.FilePath))
        {
            foreach (var page in pdfDocument.GetPages())
            {
                cancellationToken.ThrowIfCancellationRequested();
                pageCount++;
                pageTexts.Add(page.Text ?? string.Empty);
            }
        }

        var rawText = BuildRawText(pageTexts);
        var normalizedLength = CountNonWhitespaceCharacters(rawText);
        var confidence = normalizedLength >= MeaningfulTextThreshold ? 0.95m : 0.2m;

        if (string.IsNullOrWhiteSpace(rawText))
        {
            warnings.Add("Extracted text is empty.");
        }
        else if (normalizedLength < MeaningfulTextThreshold)
        {
            warnings.Add("Extracted text is too short for reliable field extraction.");
        }

        stopwatch.Stop();

        return Task.FromResult(new OcrResult
        {
            RawText = rawText,
            PageCount = pageCount,
            Warnings = warnings,
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = request.PreferredVisionProvider,
            OcrEngineType = EngineType,
            ProviderName = "NativePdf",
            ModelName = "PdfPig",
            ProviderLatencyMs = stopwatch.ElapsedMilliseconds,
            Confidence = confidence
        });
    }

    internal static bool IsPdf(OcrRequest request)
    {
        return string.Equals(Path.GetExtension(request.FilePath), ".pdf", StringComparison.OrdinalIgnoreCase)
            || string.Equals(request.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase);
    }

    internal static string BuildRawText(IReadOnlyList<string> pageTexts)
    {
        if (pageTexts.Count == 0)
        {
            return string.Empty;
        }

        var builder = new StringBuilder();
        for (var i = 0; i < pageTexts.Count; i++)
        {
            if (i > 0)
            {
                builder.AppendLine();
                builder.AppendLine("----------");
                builder.AppendLine();
            }

            builder.Append(pageTexts[i]);
        }

        return builder.ToString();
    }

    internal static int CountNonWhitespaceCharacters(string value)
    {
        return value.Count(ch => !char.IsWhiteSpace(ch));
    }
}

public interface ITesseractOcrEngineAdapter
{
    TesseractAdapterResult Extract(string tesseractDataPath, string language, string filePath, CancellationToken cancellationToken);
}

public class TesseractAdapterResult
{
    public string RawText { get; set; } = string.Empty;
    public decimal? Confidence { get; set; }
}

public class TesseractOcrEngineAdapter : ITesseractOcrEngineAdapter
{
    public TesseractAdapterResult Extract(string tesseractDataPath, string language, string filePath, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        using var engine = new TesseractEngine(tesseractDataPath, language, EngineMode.Default);
        using var image = Pix.LoadFromFile(filePath);
        using var page = engine.Process(image);

        return new TesseractAdapterResult
        {
            RawText = page.GetText() ?? string.Empty,
            Confidence = (decimal)page.GetMeanConfidence()
        };
    }
}

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
