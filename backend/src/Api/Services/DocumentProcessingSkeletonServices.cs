using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
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
            PreferredVisionProvider = vision.PreferredProvider,
            ProviderName = providerName,
            ModelName = string.Empty,
            UseVisionFallback = vision.FallbackEnabled,
            FallbackOcrEngineType = OcrEngineType.VisionFallback,
            MinPrimaryOcrConfidence = vision.MinPrimaryOcrConfidence,
            MinRawTextLength = vision.MinRawTextLength,
            UseForLowConfidenceResults = vision.UseForLowConfidenceResults,
            UseForValidationFailures = vision.UseForValidationFailures,
            UseForScannedPdf = vision.UseForScannedPdf
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
            Confidence = 0m
        });
    }
}

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
            var gemini = _serviceProvider.GetServices<IOcrProvider>().FirstOrDefault(p => p.EngineType == OcrEngineType.GeminiFlashLite);
            if (gemini != null)
            {
                return gemini.ExtractAsync(request, cancellationToken);
            }
        }

        throw new NotSupportedException("No enabled vision fallback provider is registered.");
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

public static class TextNormalizationHelper
{
    public static string NormalizeForMatching(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var formD = value.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(formD.Length);
        foreach (var ch in formD)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(char.ToLowerInvariant(ch));
            }
        }

        return Regex.Replace(builder.ToString().Normalize(NormalizationForm.FormC), "\\s+", " ").Trim();
    }

    public static IReadOnlyList<string> SplitLines(string rawText)
    {
        return rawText
            .Replace("\r\n", "\n", StringComparison.Ordinal)
            .Replace('\r', '\n')
            .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }
}

public static class CanadianTaxLabelNormalizer
{
    public static string NormalizeTaxLabel(string label)
    {
        var normalized = TextNormalizationHelper.NormalizeForMatching(label).Replace(".", string.Empty, StringComparison.Ordinal);
        return normalized switch
        {
            "gst" or "tps" => "gst",
            "qst" or "tvq" => "qst",
            "hst" or "tvh" => "hst",
            "pst" or "tvp" => "pst",
            _ => normalized
        };
    }
}

public static class BilingualFinancialLabelPatterns
{
    public static readonly string[] SubtotalLabels = ["subtotal", "sub-total", "sous-total", "sous total"];
    public static readonly string[] TotalLabels = ["total", "amount", "montant", "balance due", "solde du", "solde dû", "amount due", "montant du", "montant dû"];
    public static readonly string[] GstLabels = ["gst", "g.s.t.", "tps", "t.p.s."];
    public static readonly string[] QstLabels = ["qst", "q.s.t.", "tvq", "t.v.q."];
    public static readonly string[] HstLabels = ["hst", "tvh"];
    public static readonly string[] PstLabels = ["pst", "tvp"];
    public static readonly string[] TipLabels = ["tip", "gratuity", "pourboire"];

    public static readonly string[] InvoiceNumberEnglishLabels = ["invoice no", "invoice number", "invoice", "receipt", "ticket", "transaction"];
    public static readonly string[] InvoiceNumberFrenchLabels = ["facture", "no de facture", "n° de facture", "numero de facture", "numéro de facture", "recu", "reçu", "ticket", "transaction"];
    public static readonly string[] DateEnglishLabels = ["date", "due date"];
    public static readonly string[] DateFrenchLabels = ["date", "date d'echeance", "date d’échéance", "date echeance", "echeance", "échéance"];
    public static readonly string[] VendorEnglishLabels = ["vendor", "supplier", "merchant"];
    public static readonly string[] VendorFrenchLabels = ["fournisseur", "marchand"];
    public static readonly string[] CustomerEnglishLabels = ["customer"];
    public static readonly string[] CustomerFrenchLabels = ["client"];

    public static readonly string[] InvoiceNumberLabels = InvoiceNumberEnglishLabels.Concat(InvoiceNumberFrenchLabels).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
    public static readonly string[] DateLabels = ["date"];
    public static readonly string[] DueDateLabels = ["due date", "date d'echeance", "date d’échéance", "date echeance", "echeance", "échéance"];
    public static readonly string[] VendorLabels = VendorEnglishLabels.Concat(VendorFrenchLabels).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
    public static readonly string[] CustomerLabels = CustomerEnglishLabels.Concat(CustomerFrenchLabels).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();

    public static bool ContainsAnyLabel(string normalizedLine, IReadOnlyCollection<string> labels)
    {
        return labels.Any(label => normalizedLine.Contains(TextNormalizationHelper.NormalizeForMatching(label), StringComparison.Ordinal));
    }
}

public static class MoneyParser
{
    private static readonly Regex AmountCandidateRegex = new(@"(?:(?:CAD|USD|EUR|C\$|\$)\s*)?-?\d{1,3}(?:[\s\u00A0,.]\d{3})*(?:[.,]\d{2})?\s*(?:\$)?|(?:(?:CAD|USD|EUR|C\$|\$)\s*)?-?\d+(?:[.,]\d{2})\s*(?:\$)?", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public static bool TryParseAmount(string value, out decimal amount)
    {
        amount = 0m;
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var containsCurrencySymbol = Regex.IsMatch(value, @"(?i)\b(CAD|USD|EUR)\b|C\$|\$");
        var cleaned = Regex.Replace(value, @"(?i)\b(CAD|USD|EUR)\b|C\$|\$", string.Empty).Trim();
        cleaned = cleaned.Replace("\u00A0", " ", StringComparison.Ordinal).Replace(" ", string.Empty, StringComparison.Ordinal);
        cleaned = Regex.Replace(cleaned, @"[^0-9,\.\-]", string.Empty);
        if (string.IsNullOrWhiteSpace(cleaned) || cleaned == "-")
        {
            return false;
        }

        var hasDecimalSeparator = cleaned.Contains(',') || cleaned.Contains('.');
        if (!hasDecimalSeparator && !containsCurrencySymbol)
        {
            return false;
        }

        var normalized = NormalizeNumericSeparators(cleaned);
        return decimal.TryParse(normalized, NumberStyles.AllowLeadingSign | NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out amount);
    }

    public static bool TryExtractAmountFromLine(string line, out decimal amount)
    {
        amount = 0m;
        foreach (Match match in AmountCandidateRegex.Matches(line))
        {
            if (TryParseAmount(match.Value, out amount))
            {
                return true;
            }
        }

        return false;
    }

    private static string NormalizeNumericSeparators(string value)
    {
        var lastComma = value.LastIndexOf(',');
        var lastDot = value.LastIndexOf('.');

        if (lastComma >= 0 && lastDot >= 0)
        {
            if (lastComma > lastDot)
            {
                return value.Replace(".", string.Empty, StringComparison.Ordinal).Replace(',', '.');
            }

            return value.Replace(",", string.Empty, StringComparison.Ordinal);
        }

        if (lastComma >= 0)
        {
            var decimals = value.Length - lastComma - 1;
            return decimals == 2
                ? value.Replace(',', '.')
                : value.Replace(",", string.Empty, StringComparison.Ordinal);
        }

        if (lastDot >= 0)
        {
            var decimals = value.Length - lastDot - 1;
            return decimals == 2
                ? value
                : value.Replace(".", string.Empty, StringComparison.Ordinal);
        }

        return value;
    }
}

public static class DateParser
{
    private static readonly Dictionary<string, int> MonthLookup = new(StringComparer.OrdinalIgnoreCase)
    {
        ["january"] = 1, ["jan"] = 1,
        ["february"] = 2, ["feb"] = 2,
        ["march"] = 3, ["mar"] = 3,
        ["april"] = 4, ["apr"] = 4,
        ["may"] = 5,
        ["june"] = 6, ["jun"] = 6,
        ["july"] = 7, ["jul"] = 7,
        ["august"] = 8, ["aug"] = 8,
        ["september"] = 9, ["sep"] = 9,
        ["october"] = 10, ["oct"] = 10,
        ["november"] = 11, ["nov"] = 11,
        ["december"] = 12, ["dec"] = 12,
        ["janvier"] = 1,
        ["fevrier"] = 2, ["février"] = 2,
        ["mars"] = 3,
        ["avril"] = 4,
        ["mai"] = 5,
        ["juin"] = 6,
        ["juillet"] = 7,
        ["aout"] = 8, ["août"] = 8,
        ["septembre"] = 9,
        ["octobre"] = 10,
        ["novembre"] = 11,
        ["decembre"] = 12, ["décembre"] = 12
    };

    private static readonly string[] NumericFormats = ["yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy", "yyyy/MM/dd"];

    public static bool TryParseDate(string rawValue, DocumentLanguage languagePreference, out DateTime date, out decimal confidence)
    {
        date = default;
        confidence = 0m;
        if (string.IsNullOrWhiteSpace(rawValue))
        {
            return false;
        }

        var candidate = rawValue.Trim();
        foreach (var format in NumericFormats)
        {
            if (DateTime.TryParseExact(candidate, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                confidence = format == "MM/dd/yyyy" ? 0.55m : 0.8m;
                if (format == "MM/dd/yyyy" && languagePreference == DocumentLanguage.EnglishCanada)
                {
                    confidence = 0.7m;
                }

                return true;
            }
        }

        return TryParseMonthNameDate(candidate, out date, out confidence);
    }

    public static bool TryFindDateInLine(string line, DocumentLanguage languagePreference, out DateTime date, out decimal confidence)
    {
        date = default;
        confidence = 0m;

        var numericCandidates = Regex.Matches(line, @"\b\d{1,4}[/-]\d{1,2}[/-]\d{1,4}\b");
        foreach (Match candidate in numericCandidates)
        {
            if (TryParseDate(candidate.Value, languagePreference, out date, out confidence))
            {
                return true;
            }
        }

        var monthNameCandidate = Regex.Match(line, @"\b\d{1,2}\s+[A-Za-zÀ-ÿ]+\s+\d{4}\b|\b[A-Za-zÀ-ÿ]+\s+\d{1,2},?\s+\d{4}\b");
        if (monthNameCandidate.Success)
        {
            return TryParseDate(monthNameCandidate.Value, languagePreference, out date, out confidence);
        }

        return false;
    }

    private static bool TryParseMonthNameDate(string value, out DateTime date, out decimal confidence)
    {
        date = default;
        confidence = 0m;

        var normalized = TextNormalizationHelper.NormalizeForMatching(value).Replace(",", string.Empty, StringComparison.Ordinal);
        var dayFirst = Regex.Match(normalized, @"\b(\d{1,2})\s+([a-z]+)\s+(\d{4})\b");
        if (dayFirst.Success)
        {
            var day = int.Parse(dayFirst.Groups[1].Value, CultureInfo.InvariantCulture);
            var monthToken = dayFirst.Groups[2].Value;
            var year = int.Parse(dayFirst.Groups[3].Value, CultureInfo.InvariantCulture);
            if (MonthLookup.TryGetValue(monthToken, out var month) && DateTime.TryParseExact($"{year:D4}-{month:D2}-{day:D2}", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                confidence = 0.9m;
                return true;
            }
        }

        var monthFirst = Regex.Match(normalized, @"\b([a-z]+)\s+(\d{1,2})\s+(\d{4})\b");
        if (!monthFirst.Success)
        {
            return false;
        }

        var monthName = monthFirst.Groups[1].Value;
        var dayOfMonth = int.Parse(monthFirst.Groups[2].Value, CultureInfo.InvariantCulture);
        var y = int.Parse(monthFirst.Groups[3].Value, CultureInfo.InvariantCulture);
        if (!MonthLookup.TryGetValue(monthName, out var m))
        {
            return false;
        }

        if (!DateTime.TryParseExact($"{y:D4}-{m:D2}-{dayOfMonth:D2}", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
        {
            return false;
        }

        confidence = 0.9m;
        return true;
    }
}

public static class LanguageAwareFieldExtractor
{
    public static IReadOnlyList<string> PrioritizeLabels(DocumentLanguage requested, DocumentLanguage detected, IReadOnlyList<string> english, IReadOnlyList<string> french)
    {
        var language = ResolveLanguage(requested, detected);
        if (language == DocumentLanguage.FrenchCanada)
        {
            return french.Concat(english).ToList();
        }

        if (language == DocumentLanguage.EnglishCanada)
        {
            return english.Concat(french).ToList();
        }

        return english.Concat(french).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
    }

    public static string? TryExtractTextAfterLabel(IReadOnlyList<string> lines, IReadOnlyCollection<string> labels)
    {
        foreach (var line in lines)
        {
            var normalized = TextNormalizationHelper.NormalizeForMatching(line);
            foreach (var label in labels)
            {
                var normalizedLabel = TextNormalizationHelper.NormalizeForMatching(label);
                if (!normalized.Contains(normalizedLabel, StringComparison.Ordinal))
                {
                    continue;
                }

                var separatorIndex = line.IndexOf(':');
                if (separatorIndex >= 0 && separatorIndex < line.Length - 1)
                {
                    var value = line[(separatorIndex + 1)..].Trim();
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        return value;
                    }
                }

                var tokenized = line.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                if (tokenized.Length > 1)
                {
                    return string.Join(' ', tokenized.Skip(1));
                }
            }
        }

        return null;
    }

    public static decimal ComputeOverallConfidence(DocumentType documentType, FinancialExtractionResult result, decimal dateConfidence, bool languageMatched)
    {
        var score = 0.2m;
        if (!string.IsNullOrWhiteSpace(result.VendorName) && !string.Equals(result.VendorName, "Unknown", StringComparison.OrdinalIgnoreCase))
        {
            score += 0.25m;
        }

        if (result.DocumentDate.HasValue)
        {
            score += 0.2m * Math.Max(0.5m, dateConfidence);
        }

        if (result.Total.HasValue)
        {
            score += 0.2m;
        }

        if (documentType == DocumentType.Invoice)
        {
            if (!string.IsNullOrWhiteSpace(result.DocumentNumber))
            {
                score += 0.1m;
            }

            if (result.Subtotal.HasValue || result.Gst.HasValue || result.Qst.HasValue || result.Hst.HasValue || result.Pst.HasValue)
            {
                score += 0.15m;
            }
        }

        if (languageMatched)
        {
            score += 0.05m;
        }

        return Math.Min(1m, score);
    }

    private static DocumentLanguage ResolveLanguage(DocumentLanguage requested, DocumentLanguage detected)
    {
        if (requested != DocumentLanguage.Unknown)
        {
            return requested;
        }

        return detected;
    }
}

public class FinancialFieldExtractor : IFinancialFieldExtractor
{
    public Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var lines = TextNormalizationHelper.SplitLines(input.RawText);
        var normalizedLines = lines.Select(TextNormalizationHelper.NormalizeForMatching).ToList();

        var result = new FinancialExtractionResult
        {
            VendorName = ExtractVendorName(lines, input.RequestedDocumentLanguage, input.DetectedLanguage),
            CustomerName = LanguageAwareFieldExtractor.TryExtractTextAfterLabel(
                lines,
                LanguageAwareFieldExtractor.PrioritizeLabels(
                    input.RequestedDocumentLanguage,
                    input.DetectedLanguage,
                    BilingualFinancialLabelPatterns.CustomerEnglishLabels,
                    BilingualFinancialLabelPatterns.CustomerFrenchLabels)),
            DocumentNumber = LanguageAwareFieldExtractor.TryExtractTextAfterLabel(
                lines,
                LanguageAwareFieldExtractor.PrioritizeLabels(
                    input.RequestedDocumentLanguage,
                    input.DetectedLanguage,
                    BilingualFinancialLabelPatterns.InvoiceNumberEnglishLabels,
                    BilingualFinancialLabelPatterns.InvoiceNumberFrenchLabels)),
            Currency = DetectCurrency(input.RawText),
            RequestedDocumentLanguage = input.RequestedDocumentLanguage,
            DetectedLanguage = input.DetectedLanguage,
            PreferredVisionProvider = input.PreferredVisionProvider,
            OcrEngineType = input.OcrEngineType,
            ProviderName = input.ProviderName,
            ModelName = input.ModelName,
            ProviderLatencyMs = input.ProviderLatencyMs,
            ProviderCostEstimate = input.ProviderCostEstimate
        };

        ExtractAmounts(lines, normalizedLines, result);
        var dateConfidence = ExtractDates(lines, normalizedLines, input, result);
        var languageMatched = LanguageMatchesLabels(normalizedLines, input.RequestedDocumentLanguage, input.DetectedLanguage);
        result.Confidence = LanguageAwareFieldExtractor.ComputeOverallConfidence(input.DocumentType, result, dateConfidence, languageMatched);

        return Task.FromResult(result);
    }

    private static string ExtractVendorName(IReadOnlyList<string> lines, DocumentLanguage requestedLanguage, DocumentLanguage detectedLanguage)
    {
        var prioritizedLabels = LanguageAwareFieldExtractor.PrioritizeLabels(
            requestedLanguage,
            detectedLanguage,
            BilingualFinancialLabelPatterns.VendorEnglishLabels,
            BilingualFinancialLabelPatterns.VendorFrenchLabels);
        var labeled = LanguageAwareFieldExtractor.TryExtractTextAfterLabel(lines, prioritizedLabels);
        if (!string.IsNullOrWhiteSpace(labeled))
        {
            return labeled;
        }

        foreach (var line in lines.Take(5))
        {
            if (line.Length > 2 && !MoneyParser.TryExtractAmountFromLine(line, out _))
            {
                return line.Trim();
            }
        }

        return "Unknown";
    }

    private static string DetectCurrency(string rawText)
    {
        var normalized = TextNormalizationHelper.NormalizeForMatching(rawText);
        if (normalized.Contains("usd", StringComparison.Ordinal) || normalized.Contains("us$", StringComparison.Ordinal))
        {
            return "USD";
        }

        if (normalized.Contains("eur", StringComparison.Ordinal))
        {
            return "EUR";
        }

        return "CAD";
    }

    private static void ExtractAmounts(IReadOnlyList<string> lines, IReadOnlyList<string> normalizedLines, FinancialExtractionResult result)
    {
        for (var i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            var normalized = normalizedLines[i];

            if (!MoneyParser.TryExtractAmountFromLine(line, out var amount))
            {
                continue;
            }

            if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.SubtotalLabels) && !result.Subtotal.HasValue)
            {
                result.Subtotal = amount;
                continue;
            }

            if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.TipLabels) && !result.Tip.HasValue)
            {
                result.Tip = amount;
                continue;
            }

            if (TryExtractTaxAmount(normalized, amount, result))
            {
                continue;
            }

            if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.TotalLabels) && !result.Total.HasValue)
            {
                result.Total = amount;
            }
        }

        if (!result.Total.HasValue)
        {
            var allAmounts = lines
                .Select(line => MoneyParser.TryExtractAmountFromLine(line, out var value) ? value : (decimal?)null)
                .Where(value => value.HasValue)
                .Select(value => value!.Value)
                .ToList();
            if (allAmounts.Count > 0)
            {
                result.Total = allAmounts.Max();
            }
        }
    }

    private static bool TryExtractTaxAmount(string normalizedLine, decimal amount, FinancialExtractionResult result)
    {
        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.GstLabels) && !result.Gst.HasValue)
        {
            result.Gst = amount;
            return true;
        }

        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.QstLabels) && !result.Qst.HasValue)
        {
            result.Qst = amount;
            return true;
        }

        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.HstLabels) && !result.Hst.HasValue)
        {
            result.Hst = amount;
            return true;
        }

        if (BilingualFinancialLabelPatterns.ContainsAnyLabel(normalizedLine, BilingualFinancialLabelPatterns.PstLabels) && !result.Pst.HasValue)
        {
            result.Pst = amount;
            return true;
        }

        return false;
    }

    private static decimal ExtractDates(IReadOnlyList<string> lines, IReadOnlyList<string> normalizedLines, FinancialExtractionInput input, FinancialExtractionResult result)
    {
        var dateConfidence = 0m;
        for (var i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            var normalized = normalizedLines[i];
            if (!DateParser.TryFindDateInLine(line, input.DetectedLanguage == DocumentLanguage.Unknown ? input.RequestedDocumentLanguage : input.DetectedLanguage, out var parsedDate, out var confidence))
            {
                continue;
            }

            if (!result.DocumentDate.HasValue && BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, BilingualFinancialLabelPatterns.DateLabels))
            {
                result.DocumentDate = parsedDate;
                dateConfidence = Math.Max(dateConfidence, confidence);
                continue;
            }

            var dueLabels = LanguageAwareFieldExtractor.PrioritizeLabels(
                input.RequestedDocumentLanguage,
                input.DetectedLanguage,
                ["due date"],
                ["date d'echeance", "date d’échéance", "date echeance", "echeance", "échéance"]);
            if (!result.DueDate.HasValue && BilingualFinancialLabelPatterns.ContainsAnyLabel(normalized, dueLabels))
            {
                result.DueDate = parsedDate;
                dateConfidence = Math.Max(dateConfidence, confidence);
                continue;
            }

            if (!result.DocumentDate.HasValue)
            {
                result.DocumentDate = parsedDate;
                dateConfidence = Math.Max(dateConfidence, confidence * 0.85m);
            }
        }

        return dateConfidence;
    }

    private static bool LanguageMatchesLabels(IReadOnlyList<string> normalizedLines, DocumentLanguage requestedLanguage, DocumentLanguage detectedLanguage)
    {
        var preferred = requestedLanguage != DocumentLanguage.Unknown ? requestedLanguage : detectedLanguage;
        if (preferred == DocumentLanguage.Unknown || preferred == DocumentLanguage.BilingualCanada)
        {
            return false;
        }

        var frenchSignals = new[] { "sous-total", "montant", "facture", "recu", "reçu", "pourboire", "echeance", "échéance", "tvq", "tps" };
        var englishSignals = new[] { "subtotal", "invoice", "receipt", "tip", "due date", "balance due", "amount due", "gst", "qst" };
        var signalSet = preferred == DocumentLanguage.FrenchCanada ? frenchSignals : englishSignals;
        return normalizedLines.Any(line => signalSet.Any(signal => line.Contains(TextNormalizationHelper.NormalizeForMatching(signal), StringComparison.Ordinal)));
    }
}

public class FinancialDocumentValidator : IFinancialDocumentValidator
{
    public FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType)
    {
        var warnings = new List<ValidationWarning>();

        if (result.Subtotal.HasValue && result.Total.HasValue)
        {
            var expected = (result.Subtotal ?? 0m) + (result.Gst ?? 0m) + (result.Qst ?? 0m) + (result.Hst ?? 0m) + (result.Pst ?? 0m) + (result.Tip ?? 0m);
            var delta = Math.Abs((result.Total ?? 0m) - expected);
            if (delta > 0.05m)
            {
                warnings.Add(new ValidationWarning
                {
                    Code = "TOTAL_MISMATCH",
                    Message = "Total does not match Subtotal + taxes + tip within tolerance."
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
