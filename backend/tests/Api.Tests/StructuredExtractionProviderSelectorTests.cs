using FinancialOCR.Api.Options;
using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Api.Tests;

public class StructuredExtractionProviderSelectorTests
{
    [Fact]
    public void RuleBased_Mode_Selects_RuleBased_Provider()
    {
        var selector = CreateSelector(new FinancialExtractionOptions
        {
            Mode = "RuleBased",
            RuleBased = new RuleBasedFinancialExtractionOptions { Enabled = true },
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions { Enabled = true }
        });

        var selected = selector.Select(new FinancialExtractionProviderSelectionInput
        {
            DocumentType = DocumentType.Receipt,
            RequestedLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            RuleBasedSucceeded = true,
            RuleBasedHasRequiredFields = true,
            RuleBasedConfidence = 0.95m
        });

        Assert.Equal("RuleBased", selected.ProviderName);
    }

    [Fact]
    public void GeminiFlashLite_Mode_Selects_Gemini_When_Enabled()
    {
        var selector = CreateSelector(new FinancialExtractionOptions
        {
            Mode = "GeminiFlashLite",
            RuleBased = new RuleBasedFinancialExtractionOptions { Enabled = true },
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions { Enabled = true }
        });

        var selected = selector.Select(new FinancialExtractionProviderSelectionInput
        {
            DocumentType = DocumentType.Receipt,
            RequestedLanguage = DocumentLanguage.BilingualCanada,
            DetectedLanguage = DocumentLanguage.BilingualCanada,
            RuleBasedSucceeded = true,
            RuleBasedHasRequiredFields = true,
            RuleBasedConfidence = 0.95m
        });

        Assert.IsType<GeminiFlashLiteFinancialExtractionProvider>(selected);
    }

    [Fact]
    public void Hybrid_Mode_Selects_Gemini_When_Required_Fields_Are_Missing()
    {
        var selector = CreateSelector(new FinancialExtractionOptions
        {
            Mode = "Hybrid",
            HybridLowConfidenceThreshold = 0.75m,
            RuleBased = new RuleBasedFinancialExtractionOptions { Enabled = true },
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions { Enabled = true }
        });

        var selected = selector.Select(new FinancialExtractionProviderSelectionInput
        {
            DocumentType = DocumentType.Invoice,
            RequestedLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            RuleBasedSucceeded = true,
            RuleBasedHasRequiredFields = false,
            RuleBasedConfidence = 0.98m
        });

        Assert.IsType<GeminiFlashLiteFinancialExtractionProvider>(selected);
    }

    [Fact]
    public void Hybrid_Mode_Does_Not_Select_Gemini_When_RuleBased_Is_High_Confidence_And_Valid()
    {
        var selector = CreateSelector(new FinancialExtractionOptions
        {
            Mode = "Hybrid",
            HybridLowConfidenceThreshold = 0.75m,
            RuleBased = new RuleBasedFinancialExtractionOptions { Enabled = true },
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions { Enabled = true }
        });

        var selected = selector.Select(new FinancialExtractionProviderSelectionInput
        {
            DocumentType = DocumentType.Receipt,
            RequestedLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            RuleBasedSucceeded = true,
            RuleBasedHasRequiredFields = true,
            RuleBasedConfidence = 0.95m
        });

        Assert.IsType<RuleBasedFinancialExtractionProvider>(selected);
    }

    [Fact]
    public void Gemini_Is_Skipped_When_Disabled()
    {
        var selector = CreateSelector(new FinancialExtractionOptions
        {
            Mode = "GeminiFlashLite",
            RuleBased = new RuleBasedFinancialExtractionOptions { Enabled = true },
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions { Enabled = false },
            Llm = new LlmFinancialExtractionOptions { Enabled = false }
        });

        var selected = selector.Select(new FinancialExtractionProviderSelectionInput
        {
            DocumentType = DocumentType.Receipt,
            RequestedLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            RuleBasedSucceeded = true,
            RuleBasedHasRequiredFields = true,
            RuleBasedConfidence = 0.95m
        });

        Assert.IsType<RuleBasedFinancialExtractionProvider>(selected);
    }

    [Fact]
    public async Task Gemini_Structured_Provider_Parses_English_Fixture_With_Fake_Response()
    {
        var options = Options.Create(new FinancialExtractionOptions
        {
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions
            {
                Enabled = true,
                ApiKey = "key",
                Model = "gemini-3.1-flash-lite"
            }
        });
        var provider = new FakeGeminiStructuredProvider(options, """
{
  "vendorName": "ABC Store",
  "documentNumber": "INV-1001",
  "documentDate": "2026-05-31",
  "dueDate": "2026-06-30",
  "currency": "CAD",
  "subtotal": "100.00",
  "gst": "5.00",
  "qst": "9.98",
  "total": "114.98",
  "lineItems": [
    { "description": "Service", "quantity": "1", "unitPrice": "100.00", "amount": "100.00" }
  ]
}
""");

        var result = await provider.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = "Invoice Number: INV-1001\nDate: 2026-05-31\nSubtotal 100.00\nGST 5.00\nQST 9.98\nTotal 114.98",
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            ProviderName = "GoogleGemini",
            ModelName = "gemini-3.1-flash-lite"
        }, CancellationToken.None);

        Assert.Equal("ABC Store", result.VendorName);
        Assert.Equal("INV-1001", result.DocumentNumber);
        Assert.Equal(114.98m, result.Total);
        Assert.Equal(5.00m, result.Gst);
        Assert.Equal(9.98m, result.Qst);
    }

    [Fact]
    public async Task Gemini_Structured_Provider_Parses_French_Fixture_With_Tax_Normalization()
    {
        var options = Options.Create(new FinancialExtractionOptions
        {
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions
            {
                Enabled = true,
                ApiKey = "key",
                Model = "gemini-3.1-flash-lite"
            }
        });
        var provider = new FakeGeminiStructuredProvider(options, """
{
  "vendorName": "Épicerie Québec",
  "documentDate": "31/05/2026",
  "subtotal": "100,00",
  "taxes": {
    "TPS": "5,00",
    "TVQ": "9,98"
  },
  "total": "114,98"
}
""");

        var result = await provider.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = "Reçu\nSous-total 100,00\nTPS 5,00\nTVQ 9,98\nTotal 114,98",
            DocumentType = DocumentType.Receipt,
            RequestedDocumentLanguage = DocumentLanguage.FrenchCanada,
            DetectedLanguage = DocumentLanguage.FrenchCanada,
            ProviderName = "GoogleGemini",
            ModelName = "gemini-3.1-flash-lite"
        }, CancellationToken.None);

        Assert.Equal("Épicerie Québec", result.VendorName);
        Assert.Equal(5.00m, result.Gst);
        Assert.Equal(9.98m, result.Qst);
        Assert.Equal(114.98m, result.Total);
    }

    [Fact]
    public async Task Gemini_Structured_Provider_Parses_Bilingual_Fixture_With_Accents_Preserved()
    {
        var options = Options.Create(new FinancialExtractionOptions
        {
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions
            {
                Enabled = true,
                ApiKey = "key",
                Model = "gemini-3.1-flash-lite"
            }
        });
        var provider = new FakeGeminiStructuredProvider(options, """
{
  "vendorName": "Café Montréal",
  "documentNumber": "N° FAC-22",
  "documentDate": "2026-05-31",
  "subtotal": "50.00",
  "tip": "5.00",
  "total": "55.00"
}
""");

        var result = await provider.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = "Facture / Invoice\nN° FAC-22\nSous-total 50.00\nPourboire 5.00\nTotal 55.00",
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.BilingualCanada,
            DetectedLanguage = DocumentLanguage.BilingualCanada,
            ProviderName = "GoogleGemini",
            ModelName = "gemini-3.1-flash-lite"
        }, CancellationToken.None);

        Assert.Equal("Café Montréal", result.VendorName);
        Assert.Equal("N° FAC-22", result.DocumentNumber);
        Assert.Equal(5.00m, result.Tip);
        Assert.Equal(55.00m, result.Total);
    }

    [Fact]
    public async Task Gemini_Structured_Provider_Returns_Controlled_Error_On_Invalid_Json()
    {
        var options = Options.Create(new FinancialExtractionOptions
        {
            GeminiFlashLite = new GeminiFlashLiteFinancialExtractionOptions
            {
                Enabled = true,
                ApiKey = "key",
                Model = "gemini-3.1-flash-lite"
            }
        });
        var provider = new FakeGeminiStructuredProvider(options, "{ invalid json }");

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => provider.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = "Invoice Number: INV-1",
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            ProviderName = "GoogleGemini",
            ModelName = "gemini-3.1-flash-lite"
        }, CancellationToken.None));

        Assert.Contains("invalid JSON", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Hybrid_Mode_Preserves_High_Confidence_Deterministic_Result()
    {
        var selector = new CapturingSelector();
        var fakeGemini = new FakeStructuredProvider("GoogleGemini", new FinancialExtractionResult
        {
            VendorName = "Gemini Vendor",
            DocumentNumber = "INV-GEM-2",
            DocumentDate = new DateTime(2026, 5, 31),
            Total = 99.99m,
            Confidence = 0.99m
        });
        selector.SelectedProvider = fakeGemini;

        var extractor = new FinancialFieldExtractor(new RuleBasedFinancialExtractionProvider(), selector, Options.Create(new FinancialExtractionOptions
        {
            Mode = "Hybrid"
        }), new FinancialDocumentValidator());

        var input = new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = "Vendor: Store ABC\nDate: 2026-05-31\nSubtotal: 100.00\nGST: 5.00\nQST: 9.98\nTotal: 114.98",
            DocumentType = DocumentType.Receipt,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            PreferredVisionProvider = "GeminiFlashLite",
            OcrEngineType = OcrEngineType.Tesseract,
            ProviderName = "Tesseract",
            ModelName = "n/a"
        };

        var result = await extractor.ExtractAsync(input, CancellationToken.None);

        Assert.Equal(114.98m, result.Total);
        Assert.NotEqual("INV-GEM-2", result.DocumentNumber);
    }

    private static FinancialExtractionProviderSelector CreateSelector(FinancialExtractionOptions options)
    {
        return new FinancialExtractionProviderSelector(
            Options.Create(options),
            new RuleBasedFinancialExtractionProvider(),
            new GeminiFlashLiteFinancialExtractionProvider(Options.Create(options)),
            new LlmFinancialExtractionProvider(Options.Create(options)));
    }

    private sealed class CapturingSelector : IFinancialExtractionProviderSelector
    {
        public FinancialExtractionProviderSelectionInput? LastSelectionInput { get; private set; }

        public IStructuredFinancialExtractionProvider SelectedProvider { get; set; } = new FakeStructuredProvider("RuleBased", new FinancialExtractionResult
        {
            VendorName = "Default",
            DocumentDate = new DateTime(2026, 5, 31),
            Total = 1m
        });

        public IStructuredFinancialExtractionProvider Select(FinancialExtractionProviderSelectionInput input)
        {
            LastSelectionInput = input;
            return SelectedProvider;
        }
    }

    private sealed class FakeGeminiStructuredProvider : GeminiFlashLiteFinancialExtractionProvider
    {
        private readonly string _fakeJson;

        public FakeGeminiStructuredProvider(IOptions<FinancialExtractionOptions> options, string fakeJson)
            : base(options, null, new FinancialDocumentValidator())
        {
            _fakeJson = fakeJson;
        }

        protected override Task<(string ResponseBody, GeminiUsageMetadata UsageMetadata)> SendGeminiRequestAsync(Uri endpoint, string apiKey, string requestJson, int timeoutSeconds, int maxRetries, CancellationToken cancellationToken)
        {
            var wrapped = JsonSerializer.Serialize(new
            {
                candidates = new object[]
                {
                    new
                    {
                        content = new
                        {
                            parts = new object[]
                            {
                                new { text = _fakeJson }
                            }
                        }
                    }
                }
            });

            return Task.FromResult((wrapped, new GeminiUsageMetadata(null, null, null)));
        }
    }

    private sealed class FakeStructuredProvider : IStructuredFinancialExtractionProvider
    {
        private readonly FinancialExtractionResult _response;

        public FakeStructuredProvider(string providerName, FinancialExtractionResult response)
        {
            ProviderName = providerName;
            _response = response;
        }

        public string ProviderName { get; }

        public int CallCount { get; private set; }

        public Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            CallCount++;
            return Task.FromResult(new FinancialExtractionResult
            {
                VendorName = _response.VendorName,
                CustomerName = _response.CustomerName,
                DocumentNumber = _response.DocumentNumber,
                DocumentDate = _response.DocumentDate,
                DueDate = _response.DueDate,
                Currency = _response.Currency,
                Subtotal = _response.Subtotal,
                Gst = _response.Gst,
                Qst = _response.Qst,
                Hst = _response.Hst,
                Pst = _response.Pst,
                Tip = _response.Tip,
                Discount = _response.Discount,
                Total = _response.Total,
                Confidence = _response.Confidence,
                ProviderName = ProviderName,
                ModelName = "gemini-3.1-flash-lite"
            });
        }
    }
}
