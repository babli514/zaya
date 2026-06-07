using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace FinancialOCR.Api.Services;

public class GeminiFlashLiteFinancialExtractionProvider : IStructuredFinancialExtractionProvider
{
    private const string PlaceholderModel = "CONFIGURE_ACTUAL_MODEL_ID_HERE";
    private const string DefaultEndpoint = "https://generativelanguage.googleapis.com/v1beta/models";
    private readonly FinancialExtractionOptions _options;
    private readonly IFinancialDocumentValidator _validator;

    public GeminiFlashLiteFinancialExtractionProvider(IOptions<FinancialExtractionOptions> options, IFinancialDocumentValidator? validator = null)
    {
        _options = options.Value;
        _validator = validator ?? new FinancialDocumentValidator();
    }

    public string ProviderName => string.IsNullOrWhiteSpace(_options.GeminiFlashLite.ProviderName)
        ? "GoogleGemini"
        : _options.GeminiFlashLite.ProviderName;

    public async Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var settings = _options.GeminiFlashLite;
        if (!settings.Enabled)
        {
            throw new NotSupportedException("Gemini Flash Lite structured extraction provider is disabled.");
        }

        if (string.IsNullOrWhiteSpace(settings.ApiKey) || string.IsNullOrWhiteSpace(settings.Model) || string.Equals(settings.Model, PlaceholderModel, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Gemini Flash Lite structured extraction provider is enabled but missing required configuration values: ApiKey and/or Model.");
        }

        var endpoint = BuildEndpoint(settings.Endpoint, settings.Model);
        var prompt = BuildStructuredPrompt(input.RequestedDocumentLanguage, input.DetectedLanguage, input.DocumentType, input.RawText);
        var timeoutSeconds = settings.TimeoutSeconds <= 0 ? 60 : settings.TimeoutSeconds;
        var maxRetries = Math.Max(0, settings.MaxRetries);

        var requestPayload = BuildRequestPayload(prompt);
        var responseBody = await SendGeminiRequestAsync(endpoint, settings.ApiKey, requestPayload, timeoutSeconds, maxRetries, cancellationToken);
        var jsonText = ExtractResponseText(responseBody);
        if (string.IsNullOrWhiteSpace(jsonText))
        {
            throw new InvalidOperationException("Gemini structured extraction returned empty JSON content.");
        }

        GeminiStructuredJsonResponse parsed;
        try
        {
            parsed = ParseStrictJson(jsonText);
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("Gemini structured extraction returned invalid JSON.", ex);
        }

        var normalized = NormalizeParsedResult(parsed, input);
        var validation = _validator.Validate(normalized, input.DocumentType);
        if (!validation.IsValid)
        {
            throw new InvalidOperationException($"Gemini structured extraction did not pass validation: {validation.ValidationSummary}");
        }

        return normalized;
    }

    protected virtual async Task<string> SendGeminiRequestAsync(Uri endpoint, string apiKey, string requestJson, int timeoutSeconds, int maxRetries, CancellationToken cancellationToken)
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
                using var requestMessage = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
                };
                requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                requestMessage.Headers.TryAddWithoutValidation("x-goog-api-key", apiKey);

                using var response = await httpClient.SendAsync(requestMessage, cancellationToken);
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
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
                        throw new InvalidOperationException("Gemini structured extraction was rate-limited. Please retry later.");
                    }

                    throw new InvalidOperationException($"Gemini structured extraction failed with status code {(int)response.StatusCode}.");
                }

                return body;
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
        }

        throw new InvalidOperationException("Gemini structured extraction request failed after retries due to transient errors.", lastException);
    }

    private static bool IsTransientStatus(HttpStatusCode statusCode)
    {
        return statusCode == HttpStatusCode.RequestTimeout
            || (int)statusCode == 429
            || statusCode == HttpStatusCode.InternalServerError
            || statusCode == HttpStatusCode.BadGateway
            || statusCode == HttpStatusCode.ServiceUnavailable
            || statusCode == HttpStatusCode.GatewayTimeout;
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

    private static string BuildRequestPayload(string prompt)
    {
        var payload = new
        {
            contents = new object[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                responseMimeType = "application/json",
                candidateCount = 1,
                temperature = 0,
                topP = 0.1
            }
        };

        return JsonSerializer.Serialize(payload);
    }

    private static string ExtractResponseText(string responseBody)
    {
        using var json = JsonDocument.Parse(responseBody);

        if (json.RootElement.TryGetProperty("candidates", out var candidates)
            && candidates.ValueKind == JsonValueKind.Array
            && candidates.GetArrayLength() > 0)
        {
            var first = candidates[0];
            if (first.TryGetProperty("content", out var content)
                && content.TryGetProperty("parts", out var parts)
                && parts.ValueKind == JsonValueKind.Array)
            {
                var builder = new StringBuilder();
                foreach (var part in parts.EnumerateArray())
                {
                    if (part.TryGetProperty("text", out var text) && text.ValueKind == JsonValueKind.String)
                    {
                        builder.Append(text.GetString());
                    }
                }

                var normalized = builder.ToString().Trim();
                if (normalized.StartsWith("```", StringComparison.Ordinal))
                {
                    normalized = normalized.Trim('`').Trim();
                    if (normalized.StartsWith("json", StringComparison.OrdinalIgnoreCase))
                    {
                        normalized = normalized[4..].Trim();
                    }
                }

                return normalized;
            }
        }

        return string.Empty;
    }

    private static GeminiStructuredJsonResponse ParseStrictJson(string jsonText)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var result = JsonSerializer.Deserialize<GeminiStructuredJsonResponse>(jsonText, options);
        if (result == null)
        {
            throw new JsonException("Gemini JSON payload is empty.");
        }

        return result;
    }

    private static FinancialExtractionResult NormalizeParsedResult(GeminiStructuredJsonResponse parsed, FinancialExtractionInput input)
    {
        var preferredLanguage = input.DetectedLanguage == DocumentLanguage.Unknown ? input.RequestedDocumentLanguage : input.DetectedLanguage;
        var lineItems = parsed.LineItems?
            .Select(item => new FinancialExtractionLineItem
            {
                Description = item.Description?.Trim() ?? string.Empty,
                Quantity = TryParseDecimal(item.Quantity),
                UnitPrice = ParseMoney(item.UnitPrice),
                Amount = ParseMoney(item.Amount)
            })
            .Where(item => !string.IsNullOrWhiteSpace(item.Description) || item.Quantity.HasValue || item.UnitPrice.HasValue || item.Amount.HasValue)
            .ToList() ?? new List<FinancialExtractionLineItem>();

        var gst = ParseMoney(parsed.Gst);
        var qst = ParseMoney(parsed.Qst);
        var hst = ParseMoney(parsed.Hst);
        var pst = ParseMoney(parsed.Pst);
        var tip = ParseMoney(parsed.Tip);

        if (parsed.Taxes != null)
        {
            foreach (var tax in parsed.Taxes)
            {
                var normalized = CanadianTaxLabelNormalizer.NormalizeTaxLabel(tax.Key);
                var parsedValue = ParseMoney(tax.Value);
                if (!parsedValue.HasValue)
                {
                    continue;
                }

                switch (normalized)
                {
                    case "gst":
                        gst ??= parsedValue;
                        break;
                    case "qst":
                        qst ??= parsedValue;
                        break;
                    case "hst":
                        hst ??= parsedValue;
                        break;
                    case "pst":
                        pst ??= parsedValue;
                        break;
                    case "tip":
                        tip ??= parsedValue;
                        break;
                }
            }
        }

        var result = new FinancialExtractionResult
        {
            VendorName = NormalizeText(parsed.VendorName) ?? "Unknown",
            CustomerName = NormalizeText(parsed.CustomerName),
            DocumentNumber = NormalizeText(parsed.DocumentNumber),
            DocumentDate = ParseDate(parsed.DocumentDate, preferredLanguage),
            DueDate = ParseDate(parsed.DueDate, preferredLanguage),
            Currency = NormalizeCurrency(parsed.Currency, input.RawText),
            Subtotal = ParseMoney(parsed.Subtotal),
            Gst = gst,
            Qst = qst,
            Hst = hst,
            Pst = pst,
            Tip = tip,
            Discount = ParseMoney(parsed.Discount),
            Total = ParseMoney(parsed.Total),
            LineItems = lineItems,
            Confidence = NormalizeConfidence(parsed.Confidence, lineItems, parsed),
            RequestedDocumentLanguage = input.RequestedDocumentLanguage,
            DetectedLanguage = input.DetectedLanguage,
            PreferredVisionProvider = input.PreferredVisionProvider,
            OcrEngineType = input.OcrEngineType,
            ProviderName = string.IsNullOrWhiteSpace(input.ProviderName) ? "GoogleGemini" : input.ProviderName,
            ModelName = input.ModelName,
            ProviderLatencyMs = input.ProviderLatencyMs,
            ProviderCostEstimate = input.ProviderCostEstimate
        };

        return result;
    }

    private static string? NormalizeText(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    private static decimal? ParseMoney(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        if (MoneyParser.TryParseAmount(value, out var amount))
        {
            return amount;
        }

        if (decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out amount))
        {
            return amount;
        }

        return null;
    }

    private static decimal? TryParseDecimal(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        if (decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed))
        {
            return parsed;
        }

        if (MoneyParser.TryParseAmount(value, out parsed))
        {
            return parsed;
        }

        return null;
    }

    private static DateTime? ParseDate(string? value, DocumentLanguage preferredLanguage)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return DateParser.TryParseDate(value, preferredLanguage, out var parsed, out _)
            ? parsed
            : null;
    }

    private static string NormalizeCurrency(string? parsedCurrency, string rawText)
    {
        if (!string.IsNullOrWhiteSpace(parsedCurrency))
        {
            return parsedCurrency.Trim().ToUpperInvariant();
        }

        var normalizedRaw = TextNormalizationHelper.NormalizeForMatching(rawText);
        if (normalizedRaw.Contains("usd", StringComparison.Ordinal) || normalizedRaw.Contains("us$", StringComparison.Ordinal))
        {
            return "USD";
        }

        if (normalizedRaw.Contains("eur", StringComparison.Ordinal))
        {
            return "EUR";
        }

        if (normalizedRaw.Contains("cad", StringComparison.Ordinal) || normalizedRaw.Contains("$", StringComparison.Ordinal))
        {
            return "CAD";
        }

        return "CAD";
    }

    private static decimal NormalizeConfidence(string? parsedConfidence, IReadOnlyCollection<FinancialExtractionLineItem> lineItems, GeminiStructuredJsonResponse parsed)
    {
        if (!string.IsNullOrWhiteSpace(parsedConfidence) && decimal.TryParse(parsedConfidence, NumberStyles.Any, CultureInfo.InvariantCulture, out var confidenceFromModel))
        {
            if (confidenceFromModel > 1m)
            {
                confidenceFromModel /= 100m;
            }

            return decimal.Clamp(confidenceFromModel, 0m, 1m);
        }

        var completeness = 0;
        if (!string.IsNullOrWhiteSpace(parsed.VendorName)) completeness++;
        if (!string.IsNullOrWhiteSpace(parsed.DocumentNumber)) completeness++;
        if (!string.IsNullOrWhiteSpace(parsed.DocumentDate)) completeness++;
        if (!string.IsNullOrWhiteSpace(parsed.Total)) completeness++;
        if (!string.IsNullOrWhiteSpace(parsed.Subtotal)) completeness++;
        if (lineItems.Count > 0) completeness++;

        var estimate = 0.45m + (completeness * 0.08m);
        if (estimate > 0.95m)
        {
            estimate = 0.95m;
        }

        return decimal.Round(estimate, 2, MidpointRounding.AwayFromZero);
    }

    public static string BuildStructuredPrompt(DocumentLanguage requestedLanguage, DocumentLanguage detectedLanguage, DocumentType documentType, string rawText)
    {
        var requested = ToLanguageLabel(requestedLanguage);
        var detected = ToLanguageLabel(detectedLanguage);
        var type = documentType.ToString();

        return $$"""
You extract structured data from OCR text for Canadian receipts and invoices.

Document type: {{type}}
Requested language mode: {{requested}}
Detected language hint: {{detected}}

The document may be:
- English Canadian
- French Canadian
- bilingual English/French

Extract only values that are present in the OCR text.

Do not guess missing values.
Do not translate vendor names, customer names, labels, document numbers, or values.
Preserve Canadian French accents.
Preserve the exact document number / numéro de facture.
Parse monetary amounts carefully.

Normalize equivalent Canadian tax fields:
- GST and TPS both map to Gst
- QST and TVQ both map to Qst
- HST and TVH both map to Hst
- PST and TVP both map to Pst
- Tip and Pourboire both map to Tip

Default currency to CAD only if:
- CAD appears, or
- dollar amounts appear and no other currency is indicated

Return null for missing fields.

Support labels including:
- Invoice, Facture
- Invoice No, Invoice Number, No de facture, N° de facture, Numéro de facture
- Receipt, Reçu, Recu
- Subtotal, Sous-total, Sous total
- Total
- Amount due, Montant dû, Montant du
- Balance due, Solde dû, Solde du
- Due Date, Date d'échéance, Échéance
- Tip, Pourboire

Return strict JSON only with this shape:
{
  "vendorName": string|null,
  "customerName": string|null,
  "documentNumber": string|null,
  "documentDate": string|null,
  "dueDate": string|null,
  "currency": string|null,
  "subtotal": string|null,
  "gst": string|null,
  "qst": string|null,
  "hst": string|null,
  "pst": string|null,
  "tip": string|null,
  "discount": string|null,
  "total": string|null,
  "confidence": string|null,
  "lineItems": [
    {
      "description": string|null,
      "quantity": string|null,
      "unitPrice": string|null,
      "amount": string|null
    }
  ],
  "taxes": { "label": "amount" }
}

OCR text:
{{rawText}}
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

    private sealed class GeminiStructuredJsonResponse
    {
        public string? VendorName { get; set; }
        public string? CustomerName { get; set; }
        public string? DocumentNumber { get; set; }
        public string? DocumentDate { get; set; }
        public string? DueDate { get; set; }
        public string? Currency { get; set; }
        public string? Subtotal { get; set; }
        public string? Gst { get; set; }
        public string? Qst { get; set; }
        public string? Hst { get; set; }
        public string? Pst { get; set; }
        public string? Tip { get; set; }
        public string? Discount { get; set; }
        public string? Total { get; set; }
        public string? Confidence { get; set; }
        public List<GeminiStructuredLineItem>? LineItems { get; set; }
        public Dictionary<string, string>? Taxes { get; set; }
    }

    private sealed class GeminiStructuredLineItem
    {
        public string? Description { get; set; }
        public string? Quantity { get; set; }
        public string? UnitPrice { get; set; }
        public string? Amount { get; set; }
    }
}
