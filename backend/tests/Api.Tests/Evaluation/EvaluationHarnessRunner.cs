using FinancialOCR.Api.Options;
using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Text;
using System.Text.Json;

namespace Api.Tests.Evaluation;

public static class EvaluationHarnessRunner
{
    private static readonly string[] Providers = ["NativePdfText", "Tesseract", "GeminiFlashLite"];

    public static async Task<EvaluationRunOutput> RunAsync(EvaluationRunOptions? options = null, CancellationToken cancellationToken = default)
    {
        var resolvedOptions = options ?? BuildDefaultOptions();
        Directory.CreateDirectory(Path.GetDirectoryName(resolvedOptions.ResultsJsonPath)!);
        Directory.CreateDirectory(Path.GetDirectoryName(resolvedOptions.SummaryCsvPath)!);

        var dataset = await LoadDatasetAsync(resolvedOptions.ExpectedFilePath, cancellationToken);
        var rows = new List<EvaluationResultRow>();

        foreach (var sample in dataset.Documents)
        {
            cancellationToken.ThrowIfCancellationRequested();
            foreach (var provider in Providers)
            {
                var row = await EvaluateSampleForProviderAsync(sample, provider, resolvedOptions, cancellationToken);
                rows.Add(row);
            }
        }

        var summary = BuildSummary(rows, resolvedOptions.AmountTolerance);
        var output = new EvaluationRunOutput
        {
            GeneratedAtUtc = DateTime.UtcNow,
            EvaluationRootPath = resolvedOptions.EvaluationRootPath,
            ExpectedFilePath = resolvedOptions.ExpectedFilePath,
            Results = rows,
            Summary = summary
        };

        var jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true
        };
        var outputJson = JsonSerializer.Serialize(output, jsonOptions);
        await File.WriteAllTextAsync(resolvedOptions.ResultsJsonPath, outputJson, cancellationToken);
        await File.WriteAllTextAsync(resolvedOptions.SummaryCsvPath, BuildSummaryCsv(summary), cancellationToken);

        return output;
    }

    public static EvaluationRunOptions BuildDefaultOptions()
    {
        var evaluationRoot = ResolveEvaluationRootPath();
        var enableGemini = ParseBoolean(Environment.GetEnvironmentVariable("EVAL_ENABLE_GEMINI_API"));
        var resultsPath = Path.Combine(evaluationRoot, "evaluation-results.json");
        var csvPath = Path.Combine(evaluationRoot, "evaluation-summary.csv");

        return new EvaluationRunOptions
        {
            EvaluationRootPath = evaluationRoot,
            ExpectedFilePath = Path.Combine(evaluationRoot, "expected", "expected-results.json"),
            SamplesRootPath = Path.Combine(evaluationRoot, "samples"),
            ResultsJsonPath = resultsPath,
            SummaryCsvPath = csvPath,
            EnableGeminiApiCalls = enableGemini
        };
    }

    private static async Task<EvaluationDataset> LoadDatasetAsync(string expectedFilePath, CancellationToken cancellationToken)
    {
        if (!File.Exists(expectedFilePath))
        {
            return new EvaluationDataset();
        }

        var content = await File.ReadAllTextAsync(expectedFilePath, cancellationToken);
        if (string.IsNullOrWhiteSpace(content))
        {
            return new EvaluationDataset();
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        return JsonSerializer.Deserialize<EvaluationDataset>(content, options) ?? new EvaluationDataset();
    }

    private static async Task<EvaluationResultRow> EvaluateSampleForProviderAsync(EvaluationSampleDefinition sample, string provider, EvaluationRunOptions options, CancellationToken cancellationToken)
    {
        var row = new EvaluationResultRow
        {
            SampleRelativePath = sample.SampleRelativePath,
            Provider = provider
        };

        var samplePath = Path.Combine(options.SamplesRootPath, sample.SampleRelativePath);
        if (!File.Exists(samplePath))
        {
            row.Error = "Sample file not found.";
            return row;
        }

        var contentType = ResolveContentType(samplePath);

        try
        {
            var ocrProvider = CreateProvider(provider, options);
            if (ocrProvider == null)
            {
                row.Error = "Provider is disabled or not configured.";
                return row;
            }

            var ocrRequest = new OcrRequest
            {
                DocumentId = Guid.NewGuid(),
                FilePath = samplePath,
                ContentType = contentType,
                RequestedDocumentLanguage = sample.DocumentLanguage,
                DetectedLanguage = sample.DocumentLanguage,
                PreferredVisionProvider = provider,
                OcrEngineType = ToEngineType(provider),
                ProviderName = provider,
                ModelName = string.Empty
            };

            var ocr = await ocrProvider.ExtractAsync(ocrRequest, cancellationToken);
            var extractor = new FinancialFieldExtractor();
            var extraction = await extractor.ExtractAsync(new FinancialExtractionInput
            {
                DocumentId = Guid.NewGuid(),
                RawText = ocr.RawText,
                DocumentType = sample.DocumentType,
                RequestedDocumentLanguage = sample.DocumentLanguage,
                DetectedLanguage = sample.DocumentLanguage,
                PreferredVisionProvider = provider,
                OcrEngineType = ocr.OcrEngineType,
                ProviderName = ocr.ProviderName,
                ModelName = ocr.ModelName,
                ProviderLatencyMs = ocr.ProviderLatencyMs,
                ProviderCostEstimate = ocr.ProviderCostEstimate
            }, cancellationToken);

            var validation = new FinancialDocumentValidator().Validate(extraction, sample.DocumentType);

            row.Executed = true;
            row.VendorMatch = ValueEquals(extraction.VendorName, sample.Expected.VendorName);
            row.DateMatch = DateEquals(extraction.DocumentDate, sample.Expected.DocumentDate);
            row.TotalMatch = AmountEquals(extraction.Total, sample.Expected.Total, options.AmountTolerance);
            row.SubtotalMatch = AmountEquals(extraction.Subtotal, sample.Expected.Subtotal, options.AmountTolerance);
            row.GstMatch = AmountEquals(extraction.Gst, sample.Expected.Gst, options.AmountTolerance);
            row.QstMatch = AmountEquals(extraction.Qst, sample.Expected.Qst, options.AmountTolerance);
            row.DocumentNumberMatch = ValueEquals(extraction.DocumentNumber, sample.Expected.DocumentNumber);
            row.ValidationSuccess = validation.IsValid;
            row.Confidence = extraction.Confidence ?? 0m;
            row.NeedsReview = !validation.IsValid || row.Confidence < options.NeedsReviewConfidenceThreshold;
            row.LatencyMs = ocr.ProviderLatencyMs ?? 0;
            row.EstimatedCost = ocr.ProviderCostEstimate ?? 0m;
            return row;
        }
        catch (Exception ex)
        {
            row.Error = ex.Message;
            return row;
        }
    }

    private static List<EvaluationProviderSummary> BuildSummary(IReadOnlyCollection<EvaluationResultRow> rows, decimal amountTolerance)
    {
        var summaries = new List<EvaluationProviderSummary>();
        foreach (var provider in Providers)
        {
            var providerRows = rows.Where(r => string.Equals(r.Provider, provider, StringComparison.OrdinalIgnoreCase)).ToList();
            var executed = providerRows.Where(r => r.Executed).ToList();
            var successful = executed.Where(r => r.ValidationSuccess).ToList();

            var allFieldChecks = executed.SelectMany(r => new[]
            {
                r.VendorMatch,
                r.DateMatch,
                r.TotalMatch,
                r.SubtotalMatch,
                r.GstMatch,
                r.QstMatch,
                r.DocumentNumberMatch
            }).ToList();

            var amountChecks = executed.SelectMany(r => new[] { r.TotalMatch, r.SubtotalMatch, r.GstMatch, r.QstMatch }).ToList();
            var dateChecks = executed.Select(r => r.DateMatch).ToList();

            var summary = new EvaluationProviderSummary
            {
                Provider = provider,
                TotalDocuments = providerRows.Count,
                ExecutedDocuments = executed.Count,
                FieldLevelAccuracy = ComputeRate(allFieldChecks),
                AmountAccuracy = ComputeRate(amountChecks),
                DateAccuracy = ComputeRate(dateChecks),
                ValidationPassRate = ComputeRate(executed.Select(r => r.ValidationSuccess)),
                NeedsReviewRate = ComputeRate(executed.Select(r => r.NeedsReview)),
                AverageLatencyMs = executed.Count == 0 ? 0m : decimal.Round((decimal)executed.Average(r => r.LatencyMs), 2, MidpointRounding.AwayFromZero),
                EstimatedCostPerSuccessfulDocument = successful.Count == 0
                    ? 0m
                    : decimal.Round(successful.Sum(r => r.EstimatedCost) / successful.Count, 6, MidpointRounding.AwayFromZero)
            };

            summaries.Add(summary);
        }

        return summaries;
    }

    private static string BuildSummaryCsv(IReadOnlyCollection<EvaluationProviderSummary> summary)
    {
        var sb = new StringBuilder();
        sb.AppendLine("provider,totalDocuments,executedDocuments,fieldLevelAccuracy,amountAccuracy,dateAccuracy,validationPassRate,needsReviewRate,averageLatencyMs,estimatedCostPerSuccessfulDocument");
        foreach (var row in summary)
        {
            sb.Append(row.Provider).Append(',')
                .Append(row.TotalDocuments.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.ExecutedDocuments.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.FieldLevelAccuracy.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.AmountAccuracy.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.DateAccuracy.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.ValidationPassRate.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.NeedsReviewRate.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.AverageLatencyMs.ToString(CultureInfo.InvariantCulture)).Append(',')
                .Append(row.EstimatedCostPerSuccessfulDocument.ToString(CultureInfo.InvariantCulture))
                .AppendLine();
        }

        return sb.ToString();
    }

    private static IOcrProvider? CreateProvider(string provider, EvaluationRunOptions options)
    {
        if (string.Equals(provider, "NativePdfText", StringComparison.OrdinalIgnoreCase))
        {
            return new NativePdfTextOcrProvider();
        }

        if (string.Equals(provider, "Tesseract", StringComparison.OrdinalIgnoreCase))
        {
            var tesseractOptions = new OcrOptions
            {
                TesseractDataPath = ResolveTesseractDataPath(),
                EnglishLanguage = "eng",
                FrenchLanguage = "fra",
                BilingualLanguage = "eng+fra",
                DefaultLanguage = "eng+fra"
            };
            return new TesseractOcrProvider(Options.Create(tesseractOptions), new TesseractOcrEngineAdapter());
        }

        if (string.Equals(provider, "GeminiFlashLite", StringComparison.OrdinalIgnoreCase))
        {
            if (!options.EnableGeminiApiCalls)
            {
                return null;
            }

            var model = Environment.GetEnvironmentVariable("EVAL_GEMINI_MODEL") ?? "CONFIGURE_ACTUAL_MODEL_ID_HERE";
            var key = Environment.GetEnvironmentVariable("EVAL_GEMINI_API_KEY") ?? string.Empty;
            var endpoint = Environment.GetEnvironmentVariable("EVAL_GEMINI_ENDPOINT") ?? string.Empty;

            var geminiOptions = new OcrOptions
            {
                VisionOcr = new VisionOcrOptions
                {
                    FallbackEnabled = true,
                    PreferredProvider = "GeminiFlashLite",
                    GeminiFlashLite = new GeminiFlashLiteOptions
                    {
                        Enabled = true,
                        ProviderName = "GeminiFlashLite",
                        Model = model,
                        ApiKey = key,
                        Endpoint = endpoint,
                        TimeoutSeconds = 60,
                        MaxRetries = 2
                    }
                }
            };

            return new GeminiFlashLiteOcrProvider(Options.Create(geminiOptions), new NullProviderUsageTracker());
        }

        return null;
    }

    private static string ResolveEvaluationRootPath()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current != null)
        {
            var candidate = Path.Combine(current.FullName, "evaluation", "expected", "expected-results.json");
            if (File.Exists(candidate))
            {
                return Path.Combine(current.FullName, "evaluation");
            }

            current = current.Parent;
        }

        throw new DirectoryNotFoundException("Could not locate evaluation/expected/expected-results.json from current test execution path.");
    }

    private static bool ValueEquals(string? actual, string? expected)
    {
        var normalizedActual = (actual ?? string.Empty).Trim();
        var normalizedExpected = (expected ?? string.Empty).Trim();
        return string.Equals(normalizedActual, normalizedExpected, StringComparison.OrdinalIgnoreCase);
    }

    private static bool DateEquals(DateTime? actual, DateTime? expected)
    {
        if (!actual.HasValue && !expected.HasValue)
        {
            return true;
        }

        if (!actual.HasValue || !expected.HasValue)
        {
            return false;
        }

        return actual.Value.Date == expected.Value.Date;
    }

    private static bool AmountEquals(decimal? actual, decimal? expected, decimal tolerance)
    {
        if (!actual.HasValue && !expected.HasValue)
        {
            return true;
        }

        if (!actual.HasValue || !expected.HasValue)
        {
            return false;
        }

        return Math.Abs(actual.Value - expected.Value) <= tolerance;
    }

    private static decimal ComputeRate(IEnumerable<bool> checks)
    {
        var values = checks.ToList();
        if (values.Count == 0)
        {
            return 0m;
        }

        var passed = values.Count(v => v);
        return decimal.Round((decimal)passed / values.Count, 4, MidpointRounding.AwayFromZero);
    }

    private static OcrEngineType ToEngineType(string provider)
    {
        return provider switch
        {
            "NativePdfText" => OcrEngineType.NativePdfText,
            "Tesseract" => OcrEngineType.Tesseract,
            "GeminiFlashLite" => OcrEngineType.GeminiFlashLite,
            _ => OcrEngineType.Unknown
        };
    }

    private static string ResolveContentType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".pdf" => "application/pdf",
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };
    }

    private static string ResolveTesseractDataPath()
    {
        var fromEnvironment = Environment.GetEnvironmentVariable("EVAL_TESSDATA_PATH");
        if (!string.IsNullOrWhiteSpace(fromEnvironment))
        {
            return fromEnvironment;
        }

        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current != null)
        {
            var candidate = Path.Combine(current.FullName, "backend", "src", "Api", "App_Data", "tessdata");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            current = current.Parent;
        }

        return "App_Data/tessdata";
    }

    private static bool ParseBoolean(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        return string.Equals(value, "1", StringComparison.OrdinalIgnoreCase)
            || string.Equals(value, "true", StringComparison.OrdinalIgnoreCase)
            || string.Equals(value, "yes", StringComparison.OrdinalIgnoreCase)
            || string.Equals(value, "on", StringComparison.OrdinalIgnoreCase);
    }
}
