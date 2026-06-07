using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace FinancialOCR.Api.Services;

public class GeminiFlashLiteOcrProvider : IOcrProvider
{
    private const string PlaceholderModel = "CONFIGURE_ACTUAL_MODEL_ID_HERE";
    private const string DefaultEndpoint = "https://generativelanguage.googleapis.com/v1beta/models";
    private static readonly HashSet<string> SupportedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg",
        ".webp"
    };

    private readonly OcrOptions _ocrOptions;

    public GeminiFlashLiteOcrProvider(IOptions<OcrOptions> ocrOptions)
    {
        _ocrOptions = ocrOptions.Value;
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

        if (string.IsNullOrWhiteSpace(settings.ApiKey) || string.IsNullOrWhiteSpace(settings.Model) || string.Equals(settings.Model, PlaceholderModel, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Gemini Flash Lite provider is enabled but not fully configured. Missing ApiKey or Model.");
        }

        if (!File.Exists(request.FilePath))
        {
            throw new FileNotFoundException($"Document file was not found at '{request.FilePath}'.", request.FilePath);
        }

        var providerName = string.IsNullOrWhiteSpace(settings.ProviderName) ? "GoogleGemini" : settings.ProviderName;
        var warnings = new List<string>();
        var stopwatch = Stopwatch.StartNew();
        var mimeType = ResolveMimeType(request);
        var fileBytes = await File.ReadAllBytesAsync(request.FilePath, cancellationToken);
        var base64 = Convert.ToBase64String(fileBytes);
        var prompt = BuildPrompt(request.RequestedDocumentLanguage, request.DetectedLanguage);

        var endpoint = BuildEndpoint(settings.Endpoint, settings.Model);
        var maxRetries = Math.Max(0, settings.MaxRetries);
        var timeoutSeconds = settings.TimeoutSeconds <= 0 ? 60 : settings.TimeoutSeconds;

        var responseText = await ExecuteWithRetryAsync(endpoint, settings.ApiKey, timeoutSeconds, maxRetries, prompt, mimeType, base64, cancellationToken);

        stopwatch.Stop();

        if (string.IsNullOrWhiteSpace(responseText))
        {
            warnings.Add("Gemini returned empty OCR text.");
            responseText = "[unreadable]";
        }

        var confidence = EstimateConfidence(responseText);

        return new OcrResult
        {
            RawText = responseText,
            PageCount = null,
            Warnings = warnings,
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = request.PreferredVisionProvider,
            OcrEngineType = EngineType,
            ProviderName = providerName,
            ModelName = settings.Model,
            ProviderLatencyMs = stopwatch.ElapsedMilliseconds,
            ProviderCostEstimate = null,
            Confidence = confidence
        };
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

    private static async Task<string> ExecuteWithRetryAsync(Uri endpoint, string apiKey, int timeoutSeconds, int maxRetries, string prompt, string mimeType, string base64Data, CancellationToken cancellationToken)
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
                return text;
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
}
