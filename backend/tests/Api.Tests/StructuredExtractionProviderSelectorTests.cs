using FinancialOCR.Api.Options;
using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

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
    public async Task Hybrid_Mode_Runs_RuleBased_First_Then_Uses_Fake_Gemini_Response_When_Selected()
    {
        var selector = new CapturingSelector();
        var fakeGemini = new FakeStructuredProvider("GoogleGemini", new FinancialExtractionResult
        {
            VendorName = "Gemini Vendor",
            DocumentNumber = "INV-GEM-1",
            DocumentDate = new DateTime(2026, 5, 31),
            Total = 222.22m,
            Confidence = 0.99m
        });
        selector.SelectedProvider = fakeGemini;

        var extractor = new FinancialFieldExtractor(new RuleBasedFinancialExtractionProvider(), selector);
        var input = new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = "Vendor: Store ABC\nInvoice Number: INV-1\nDate: 2026-05-31\nTotal: 114.98",
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            PreferredVisionProvider = "GeminiFlashLite",
            OcrEngineType = OcrEngineType.Tesseract,
            ProviderName = "Tesseract",
            ModelName = "n/a"
        };

        var result = await extractor.ExtractAsync(input, CancellationToken.None);

        Assert.NotNull(selector.LastSelectionInput);
        Assert.Equal(222.22m, result.Total);
        Assert.Equal("INV-GEM-1", result.DocumentNumber);
        Assert.Equal(input.RequestedDocumentLanguage, result.RequestedDocumentLanguage);
        Assert.Equal(input.DetectedLanguage, result.DetectedLanguage);
        Assert.Equal(input.PreferredVisionProvider, result.PreferredVisionProvider);
        Assert.Equal(input.OcrEngineType, result.OcrEngineType);
        Assert.Equal(1, fakeGemini.CallCount);
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
