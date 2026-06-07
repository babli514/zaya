using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace FinancialOCR.Api.Services;

public class GeminiFlashLiteOcrProvider : IOcrProvider
{
    private sealed record GeminiUsageMetadata(int? InputTokenCount, int? OutputTokenCount, long? OutputBytes);
    private const string PlaceholderModel = "CONFIGURE_ACTUAL_MODEL_ID_HERE";
    private const string DefaultEndpoint = "https://generativelanguage.googleapis.com/v1beta/models";
    private const string DefaultOpenAIEndpoint = "https://api.openai.com/v1";
    private static readonly HashSet<string> SupportedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg",
        ".webp"
    };

    private readonly OcrOptions _ocrOptions;
    private readonly IProviderUsageTracker _providerUsageTracker;

    public GeminiFlashLiteOcrProvider(IOptions<OcrOptions> ocrOptions, IProviderUsageTracker? providerUsageTracker = null)
    {
        _ocrOptions = ocrOptions.Value;
        _providerUsageTracker = providerUsageTracker ?? new NullProviderUsageTracker();
    }

    public OcrEngineType EngineType => OcrEngineType.GeminiFlashLite;

    public async Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var settings = _ocrOptions.VisionOcr.GeminiFlashLite;
        if (!settings.Enabled)
        {
            throw new NotSupportedException("Gemini Flash Lite provider is disabled.");
        }

        if (!IsSupportedFile(request))
        {
            throw new NotSupportedException("Gemini Flash Lite OCR supports only PDF, PNG, JPG, JPEG, and WEBP files.");
        }

        var useOpenAi = settings.UseOpenAICompatibility;
        var modelName = useOpenAi ? settings.OpenAIModel : settings.Model;
        var apiKey = useOpenAi ? settings.OpenAIApiKey : settings.ApiKey;

        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(modelName) || string.Equals(modelName, PlaceholderModel, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Gemini Flash Lite provider is enabled but not fully configured for the active compatibility mode. Missing ApiKey or Model.");
        }

        if (!File.Exists(request.FilePath))
        {
            throw new FileNotFoundException($"Document file was not found at '{request.FilePath}'.", request.FilePath);
        }

        var providerName = ResolveProviderName(settings.ProviderName, useOpenAi);
        var warnings = new List<string>();
        var startedAtUtc = DateTime.UtcNow;
        var stopwatch = Stopwatch.StartNew();
        var usageRecord = await _providerUsageTracker.StartAsync(request.DocumentId, request.ExtractionJobId, providerName, modelName, ProviderOperationType.Ocr, startedAtUtc, cancellationToken);
        byte[]? fileBytes = null;

        try
        {
            var mimeType = ResolveMimeType(request);
            fileBytes = await File.ReadAllBytesAsync(request.FilePath, cancellationToken);
            var base64 = Convert.ToBase64String(fileBytes);
            var prompt = BuildPrompt(request.RequestedDocumentLanguage, request.DetectedLanguage);

            var maxRetries = Math.Max(0, settings.MaxRetries);
            var timeoutSeconds = settings.TimeoutSeconds <= 0 ? 60 : settings.TimeoutSeconds;

            var response = useOpenAi
                ? await ExecuteOpenAiWithRetryAsync(BuildOpenAiEndpoint(settings.OpenAIEndpoint), apiKey, modelName, timeoutSeconds, maxRetries, prompt, mimeType, fileBytes, cancellationToken)
                : await ExecuteWithRetryAsync(BuildEndpoint(settings.Endpoint, modelName), apiKey, timeoutSeconds, maxRetries, prompt, mimeType, base64, cancellationToken);
            var responseText = response.ResponseText;

            stopwatch.Stop();

            if (string.IsNullOrWhiteSpace(responseText))
            {
                warnings.Add("Gemini returned empty OCR text.");
                responseText = "[unreadable]";
            }

            var estimatedCostUsd = _providerUsageTracker.EstimateCostUsd(modelName, response.UsageMetadata.InputTokenCount, response.UsageMetadata.OutputTokenCount);
            await _providerUsageTracker.CompleteSuccessAsync(
                usageRecord,
                DateTime.UtcNow,
                stopwatch.ElapsedMilliseconds,
                response.UsageMetadata.InputTokenCount,
                response.UsageMetadata.OutputTokenCount,
                fileBytes.LongLength,
                response.UsageMetadata.OutputBytes,
                estimatedCostUsd,
                cancellationToken);

            var confidence = EstimateConfidence(responseText);

            return new OcrResult
            {
                ExtractionJobId = request.ExtractionJobId,
                RawText = responseText,
                PageCount = null,
                Warnings = warnings,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = EngineType,
                ProviderName = providerName,
                ModelName = modelName,
                ProviderLatencyMs = stopwatch.ElapsedMilliseconds,
                ProviderCostEstimate = estimatedCostUsd,
                Confidence = confidence
            };
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            await _providerUsageTracker.CompleteFailureAsync(
                usageRecord,
                DateTime.UtcNow,
                stopwatch.ElapsedMilliseconds,
                ResolveErrorCode(ex),
                ex.Message,
                null,
                null,
                fileBytes?.LongLength,
                null,
                null,
                cancellationToken);
            throw;
        }
    }

    private static bool IsSupportedFile(OcrRequest request)
    {
        var extension = Path.GetExtension(request.FilePath);
        return SupportedExtensions.Contains(extension);
    }

    private static string ResolveMimeType(OcrRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.ContentType))
        {
            return request.ContentType;
        }

        var extension = Path.GetExtension(request.FilePath);
        return extension.ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };
    }

    private static Uri BuildEndpoint(string configuredEndpoint, string model)
    {
        var baseEndpoint = string.IsNullOrWhiteSpace(configuredEndpoint)
            ? DefaultEndpoint
            : configuredEndpoint.TrimEnd('/');

        var endpoint = baseEndpoint.Contains("generateContent", StringComparison.OrdinalIgnoreCase)
            ? baseEndpoint
            : $"{baseEndpoint}/{model}:generateContent";

        return new Uri(endpoint);
    }

    private static Uri BuildOpenAiEndpoint(string configuredEndpoint)
    {
        var baseEndpoint = string.IsNullOrWhiteSpace(configuredEndpoint)
            ? DefaultOpenAIEndpoint
            : configuredEndpoint.TrimEnd('/');
        var endpoint = baseEndpoint.EndsWith("/responses", StringComparison.OrdinalIgnoreCase)
            ? baseEndpoint
            : $"{baseEndpoint}/responses";
        return new Uri(endpoint);
    }

    private static string ResolveProviderName(string configuredProviderName, bool useOpenAi)
    {
        if (!useOpenAi)
        {
            return string.IsNullOrWhiteSpace(configuredProviderName) ? "GoogleGemini" : configuredProviderName;
        }

        if (string.IsNullOrWhiteSpace(configuredProviderName)
            || string.Equals(configuredProviderName, "GoogleGemini", StringComparison.OrdinalIgnoreCase))
        {
            return "OpenAI";
        }

        return configuredProviderName;
    }

    private static string BuildPrompt(DocumentLanguage requestedLanguage, DocumentLanguage detectedLanguage)
    {
        var requested = ToLanguageLabel(requestedLanguage);
        var detected = ToLanguageLabel(detectedLanguage);

        return $"""
You are performing faithful OCR transcription for Canadian financial documents.

Requested language mode: {requested}
Detected language hint: {detected}

The document may be:
- English Canadian
- French Canadian
- bilingual English/French

The document may contain:
- GST/TPS
- QST/TVQ
- HST/TVH
- PST/TVP
- Tip/Pourboire
- invoice/facture labels
- receipt/reçu labels

Instructions:
- Transcribe all visible text as accurately as possible
- Preserve line breaks and table-like layout where possible
- Preserve monetary amounts exactly
- Preserve dates exactly
- Preserve document numbers exactly
- Preserve French accents such as é, è, ê, à, ç, ù, ô
- Do not translate
- Do not summarize
- Do not infer or invent missing values
- If a portion is unreadable, write [unreadable]
- Return plain text only
""";
    }

    private static string ToLanguageLabel(DocumentLanguage language)
    {
        return language switch
        {
            DocumentLanguage.EnglishCanada => "EnglishCanada",
            DocumentLanguage.FrenchCanada => "FrenchCanada",
            DocumentLanguage.BilingualCanada => "BilingualCanada",
            _ => "Unknown/auto"
        };
    }

    private static decimal EstimateConfidence(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return 0m;
        }

        var unreadableCount = text.Split("[unreadable]", StringSplitOptions.None).Length - 1;
        var lengthScore = Math.Min(1m, text.Trim().Length / 500m);
        var penalty = Math.Min(0.7m, unreadableCount * 0.15m);
        var score = 0.35m + (0.6m * lengthScore) - penalty;

        if (score < 0m)
        {
            return 0m;
        }

        if (score > 0.99m)
        {
            return 0.99m;
        }

        return decimal.Round(score, 2, MidpointRounding.AwayFromZero);
    }

    private static bool IsTransientStatus(HttpStatusCode statusCode)
    {
        return statusCode == HttpStatusCode.RequestTimeout ||
               (int)statusCode == 429 ||
               statusCode == HttpStatusCode.InternalServerError ||
               statusCode == HttpStatusCode.BadGateway ||
               statusCode == HttpStatusCode.ServiceUnavailable ||
               statusCode == HttpStatusCode.GatewayTimeout;
    }

    private static async Task<(string ResponseText, GeminiUsageMetadata UsageMetadata)> ExecuteWithRetryAsync(Uri endpoint, string apiKey, int timeoutSeconds, int maxRetries, string prompt, string mimeType, string base64Data, CancellationToken cancellationToken)
    {
        using var httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(timeoutSeconds)
        };

        Exception? lastException = null;
        var totalAttempts = maxRetries + 1;
        for (var attempt = 1; attempt <= totalAttempts; attempt++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            try
            {
                var payload = new
                {
                    contents = new object[]
                    {
                        new
                        {
                            parts = new object[]
                            {
                                new { text = prompt },
                                new
                                {
                                    inline_data = new
                                    {
                                        mime_type = mimeType,
                                        data = base64Data
                                    }
                                }
                            }
                        }
                    },
                    generationConfig = new
                    {
                        temperature = 0,
                        topP = 0.1,
                        candidateCount = 1
                    }
                };

                var requestJson = JsonSerializer.Serialize(payload);
                using var requestMessage = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
                };
                requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                requestMessage.Headers.TryAddWithoutValidation("x-goog-api-key", apiKey);

                using var response = await httpClient.SendAsync(requestMessage, cancellationToken);
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    if (attempt < totalAttempts && IsTransientStatus(response.StatusCode))
                    {
                        var delayMs = (int)Math.Min(3000, 250 * Math.Pow(2, attempt - 1));
                        await Task.Delay(delayMs, cancellationToken);
                        continue;
                    }

                    if ((int)response.StatusCode == 429)
                    {
                        throw new InvalidOperationException("Gemini OCR request was rate-limited. Please retry later.");
                    }

                    throw new InvalidOperationException($"Gemini OCR request failed with status code {(int)response.StatusCode}.");
                }

                var text = ExtractPlainText(responseBody);
                var usageMetadata = ExtractUsageMetadata(responseBody);
                return (text, usageMetadata);
            }
            catch (TaskCanceledException ex) when (!cancellationToken.IsCancellationRequested)
            {
                lastException = ex;
                if (attempt < totalAttempts)
                {
                    var delayMs = (int)Math.Min(3000, 250 * Math.Pow(2, attempt - 1));
                    await Task.Delay(delayMs, cancellationToken);
                    continue;
                }
            }
            catch (HttpRequestException ex)
            {
                lastException = ex;
                if (attempt < totalAttempts)
                {
                    var delayMs = (int)Math.Min(3000, 250 * Math.Pow(2, attempt - 1));
                    await Task.Delay(delayMs, cancellationToken);
                    continue;
                }
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException("Gemini OCR returned an unexpected response format.", ex);
            }
        }

        throw new InvalidOperationException("Gemini OCR request failed after retries due to transient errors.", lastException);
    }

    private static async Task<(string ResponseText, GeminiUsageMetadata UsageMetadata)> ExecuteOpenAiWithRetryAsync(Uri endpoint, string apiKey, string modelName, int timeoutSeconds, int maxRetries, string prompt, string mimeType, byte[] fileBytes, CancellationToken cancellationToken)
    {
        using var httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(timeoutSeconds)
        };

        Exception? lastException = null;
        var totalAttempts = maxRetries + 1;
        for (var attempt = 1; attempt <= totalAttempts; attempt++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            try
            {
                var payload = new
                {
                    model = modelName,
                    input = new object[]
                    {
                        new
                        {
                            role = "user",
                            content = new object[]
                            {
                                new
                                {
                                    type = "input_text",
                                    text = prompt
                                },
                                new
                                {
                                    type = "input_file",
                                    filename = "document",
                                    file_data = $"data:{mimeType};base64,{Convert.ToBase64String(fileBytes)}"
                                }
                            }
                        }
                    }
                };

                var requestJson = JsonSerializer.Serialize(payload);
                using var requestMessage = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
                };
                requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                using var response = await httpClient.SendAsync(requestMessage, cancellationToken);
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    if (attempt < totalAttempts && IsTransientStatus(response.StatusCode))
                    {
                        var delayMs = (int)Math.Min(3000, 250 * Math.Pow(2, attempt - 1));
                        await Task.Delay(delayMs, cancellationToken);
                        continue;
                    }

                    if ((int)response.StatusCode == 429)
                    {
                        throw new InvalidOperationException("OpenAI OCR request was rate-limited. Please retry later.");
                    }

                    throw new InvalidOperationException($"OpenAI OCR request failed with status code {(int)response.StatusCode}.");
                }

                var text = ExtractOpenAiPlainText(responseBody);
                var usageMetadata = ExtractOpenAiUsageMetadata(responseBody);
                return (text, usageMetadata);
            }
            catch (TaskCanceledException ex) when (!cancellationToken.IsCancellationRequested)
            {
                lastException = ex;
                if (attempt < totalAttempts)
                {
                    var delayMs = (int)Math.Min(3000, 250 * Math.Pow(2, attempt - 1));
                    await Task.Delay(delayMs, cancellationToken);
                    continue;
                }
            }
            catch (HttpRequestException ex)
            {
                lastException = ex;
                if (attempt < totalAttempts)
                {
                    var delayMs = (int)Math.Min(3000, 250 * Math.Pow(2, attempt - 1));
                    await Task.Delay(delayMs, cancellationToken);
                    continue;
                }
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException("OpenAI OCR returned an unexpected response format.", ex);
            }
        }

        throw new InvalidOperationException("OpenAI OCR request failed after retries due to transient errors.", lastException);
    }

    private static string ExtractPlainText(string responseBody)
    {
        using var json = JsonDocument.Parse(responseBody);

        if (json.RootElement.TryGetProperty("candidates", out var candidates) &&
            candidates.ValueKind == JsonValueKind.Array &&
            candidates.GetArrayLength() > 0)
        {
            var candidate = candidates[0];
            if (candidate.TryGetProperty("content", out var content) &&
                content.TryGetProperty("parts", out var parts) &&
                parts.ValueKind == JsonValueKind.Array)
            {
                var sb = new StringBuilder();
                foreach (var part in parts.EnumerateArray())
                {
                    if (part.TryGetProperty("text", out var textElement) && textElement.ValueKind == JsonValueKind.String)
                    {
                        sb.Append(textElement.GetString());
                    }
                }

                var text = sb.ToString().Trim();
                if (text.StartsWith("```", StringComparison.Ordinal))
                {
                    text = text.Trim('`').Trim();
                }

                return text;
            }
        }

        return string.Empty;
    }

    private static string ExtractOpenAiPlainText(string responseBody)
    {
        using var json = JsonDocument.Parse(responseBody);

        if (json.RootElement.TryGetProperty("output_text", out var outputTextElement)
            && outputTextElement.ValueKind == JsonValueKind.String)
        {
            return outputTextElement.GetString()?.Trim() ?? string.Empty;
        }

        if (json.RootElement.TryGetProperty("output", out var outputElement)
            && outputElement.ValueKind == JsonValueKind.Array)
        {
            var builder = new StringBuilder();
            foreach (var outputItem in outputElement.EnumerateArray())
            {
                if (!outputItem.TryGetProperty("content", out var contentElement)
                    || contentElement.ValueKind != JsonValueKind.Array)
                {
                    continue;
                }

                foreach (var contentItem in contentElement.EnumerateArray())
                {
                    if (contentItem.TryGetProperty("text", out var textElement)
                        && textElement.ValueKind == JsonValueKind.String)
                    {
                        builder.Append(textElement.GetString());
                    }
                }
            }

            return builder.ToString().Trim();
        }

        return string.Empty;
    }

    private static GeminiUsageMetadata ExtractUsageMetadata(string responseBody)
    {
        using var json = JsonDocument.Parse(responseBody);

        if (!json.RootElement.TryGetProperty("usageMetadata", out var usageMetadataElement))
        {
            return new GeminiUsageMetadata(null, null, null);
        }

        int? inputTokenCount = null;
        int? outputTokenCount = null;

        if (usageMetadataElement.TryGetProperty("promptTokenCount", out var promptTokenCountElement)
            && promptTokenCountElement.ValueKind == JsonValueKind.Number
            && promptTokenCountElement.TryGetInt32(out var promptTokenCount))
        {
            inputTokenCount = promptTokenCount;
        }

        if (usageMetadataElement.TryGetProperty("candidatesTokenCount", out var candidatesTokenCountElement)
            && candidatesTokenCountElement.ValueKind == JsonValueKind.Number
            && candidatesTokenCountElement.TryGetInt32(out var candidatesTokenCount))
        {
            outputTokenCount = candidatesTokenCount;
        }

        if (!outputTokenCount.HasValue
            && usageMetadataElement.TryGetProperty("totalTokenCount", out var totalTokenCountElement)
            && totalTokenCountElement.ValueKind == JsonValueKind.Number
            && totalTokenCountElement.TryGetInt32(out var totalTokenCount)
            && inputTokenCount.HasValue)
        {
            outputTokenCount = Math.Max(0, totalTokenCount - inputTokenCount.Value);
        }

        long? outputBytes = null;
        if (json.RootElement.TryGetProperty("candidates", out var candidates)
            && candidates.ValueKind == JsonValueKind.Array
            && candidates.GetArrayLength() > 0)
        {
            var firstCandidateRaw = candidates[0].GetRawText();
            outputBytes = Encoding.UTF8.GetByteCount(firstCandidateRaw);
        }

        return new GeminiUsageMetadata(inputTokenCount, outputTokenCount, outputBytes);
    }

    private static GeminiUsageMetadata ExtractOpenAiUsageMetadata(string responseBody)
    {
        using var json = JsonDocument.Parse(responseBody);
        if (!json.RootElement.TryGetProperty("usage", out var usageElement))
        {
            return new GeminiUsageMetadata(null, null, null);
        }

        int? inputTokenCount = null;
        int? outputTokenCount = null;

        if (usageElement.TryGetProperty("input_tokens", out var inputTokensElement)
            && inputTokensElement.ValueKind == JsonValueKind.Number
            && inputTokensElement.TryGetInt32(out var inputTokens))
        {
            inputTokenCount = inputTokens;
        }

        if (usageElement.TryGetProperty("output_tokens", out var outputTokensElement)
            && outputTokensElement.ValueKind == JsonValueKind.Number
            && outputTokensElement.TryGetInt32(out var outputTokens))
        {
            outputTokenCount = outputTokens;
        }

        var outputBytes = Encoding.UTF8.GetByteCount(responseBody);
        return new GeminiUsageMetadata(inputTokenCount, outputTokenCount, outputBytes);
    }

    private static string ResolveErrorCode(Exception exception)
    {
        return exception switch
        {
            TaskCanceledException => "Timeout",
            OperationCanceledException => "Canceled",
            TimeoutException => "Timeout",
            HttpRequestException => "HttpRequest",
            JsonException => "InvalidResponseFormat",
            InvalidOperationException => "InvalidOperation",
            FileNotFoundException => "FileNotFound",
            NotSupportedException => "NotSupported",
            _ => "UnhandledException"
        };
    }
}
