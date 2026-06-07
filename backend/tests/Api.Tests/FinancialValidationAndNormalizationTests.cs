using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;

namespace Api.Tests;

public class FinancialValidationAndNormalizationTests
{
    [Theory]
    [InlineData("GST", "gst")]
    [InlineData("TPS", "gst")]
    [InlineData("QST", "qst")]
    [InlineData("TVQ", "qst")]
    [InlineData("HST", "hst")]
    [InlineData("TVH", "hst")]
    [InlineData("PST", "pst")]
    [InlineData("TVP", "pst")]
    [InlineData("Tip", "tip")]
    [InlineData("Pourboire", "tip")]
    public void CanadianTaxLabelNormalizer_Maps_To_Canonical_Labels(string input, string expected)
    {
        var normalized = CanadianTaxLabelNormalizer.NormalizeTaxLabel(input);

        Assert.Equal(expected, normalized);
    }

    [Fact]
    public void FinancialValidator_Valid_Quebec_English_Receipt_Passes()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 114.98m
        }, DocumentType.Receipt);

        Assert.True(result.IsValid);
        Assert.DoesNotContain(result.Warnings, w => w.Code == "TaxTotalMismatch");
    }

    [Fact]
    public void FinancialValidator_Valid_Quebec_French_Receipt_Passes()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Marchand",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 114.98m
        }, DocumentType.Receipt);

        Assert.True(result.IsValid);
        Assert.DoesNotContain(result.Warnings, w => w.Code == "TaxTotalMismatch");
    }

    [Fact]
    public void FinancialValidator_Valid_Receipt_With_Tip_Passes()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Tip = 10m,
            Total = 124.98m
        }, DocumentType.Receipt);

        Assert.True(result.IsValid);
        Assert.DoesNotContain(result.Warnings, w => w.Code == "TaxTotalMismatch");
    }

    [Fact]
    public void FinancialValidator_Invalid_Total_Mismatch_Is_Error()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 120m
        }, DocumentType.Receipt);

        Assert.False(result.IsValid);
        Assert.Contains(result.Warnings, w => w.Code == "TaxTotalMismatch" && w.Severity == ValidationSeverity.Error);
    }

    [Fact]
    public void FinancialValidator_Missing_Total_Is_Error()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31)
        }, DocumentType.Receipt);

        Assert.False(result.IsValid);
        Assert.Contains(result.Warnings, w => w.Code == "MissingTotal" && w.Severity == ValidationSeverity.Error);
    }

    [Fact]
    public void FinancialValidator_Invoice_Missing_Invoice_Number_Warns()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Vendor",
            DocumentDate = new DateTime(2026, 5, 31),
            DueDate = new DateTime(2026, 6, 30),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 114.98m
        }, DocumentType.Invoice);

        Assert.True(result.IsValid);
        Assert.Contains(result.Warnings, w => w.Code == "MissingInvoiceNumber" && w.Severity == ValidationSeverity.Warning);
    }

    [Fact]
    public void FinancialValidator_Invoice_Missing_Numero_De_Facture_Uses_Same_Warning_Code()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Fournisseur",
            DocumentDate = new DateTime(2026, 5, 31),
            DueDate = new DateTime(2026, 6, 30),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 114.98m
        }, DocumentType.Invoice);

        Assert.Contains(result.Warnings, w => w.Code == "MissingInvoiceNumber");
    }

    [Fact]
    public void FinancialValidator_Invoice_Total_Mismatch_Is_Error()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Vendor",
            DocumentNumber = "INV-1",
            DocumentDate = new DateTime(2026, 5, 31),
            DueDate = new DateTime(2026, 6, 30),
            Gst = 5m,
            Total = 200m,
            LineItems =
            [
                new FinancialExtractionLineItem { Description = "Item 1", Amount = 50m },
                new FinancialExtractionLineItem { Description = "Item 2", Amount = 50m }
            ]
        }, DocumentType.Invoice);

        Assert.False(result.IsValid);
        Assert.Contains(result.Warnings, w => w.Code == "TaxTotalMismatch" && w.Severity == ValidationSeverity.Error);
    }

    [Fact]
    public void FinancialValidator_Warnings_Include_Both_English_And_French_Messages()
    {
        var validator = new FinancialDocumentValidator();
        var result = validator.Validate(new FinancialExtractionResult
        {
            VendorName = "Unknown",
            DocumentDate = new DateTime(2026, 5, 31)
        }, DocumentType.Receipt);

        Assert.NotEmpty(result.Warnings);
        Assert.All(result.Warnings, w =>
        {
            Assert.False(string.IsNullOrWhiteSpace(w.MessageEn));
            Assert.False(string.IsNullOrWhiteSpace(w.MessageFr));
        });
    }

    [Fact]
    public void ConfidenceScoring_English_Receipt_High_When_Valid()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 114.98m,
            Confidence = 0.84m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Receipt);

        var score = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.90m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedDocumentLanguage = DocumentLanguage.EnglishCanada
        });

        Assert.InRange(score, 0.80m, 1.00m);
    }

    [Fact]
    public void ConfidenceScoring_French_Receipt_High_When_Valid()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Marchand",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 80m,
            Gst = 4m,
            Qst = 7.98m,
            Total = 91.98m,
            Confidence = 0.80m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Receipt);

        var score = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.86m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.FrenchCanada,
            DetectedDocumentLanguage = DocumentLanguage.FrenchCanada
        });

        Assert.InRange(score, 0.78m, 1.00m);
    }

    [Fact]
    public void ConfidenceScoring_Bilingual_Invoice_High_When_Complete_And_Valid()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Bureau Example",
            DocumentNumber = "FAC-123",
            DocumentDate = new DateTime(2026, 5, 31),
            DueDate = new DateTime(2026, 6, 30),
            Subtotal = 200m,
            Gst = 10m,
            Qst = 19.95m,
            Total = 229.95m,
            Confidence = 0.82m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Invoice);

        var score = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Invoice,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.88m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.BilingualCanada,
            DetectedDocumentLanguage = DocumentLanguage.BilingualCanada
        });

        Assert.InRange(score, 0.76m, 1.00m);
    }

    [Fact]
    public void ConfidenceScoring_Language_Mismatch_Reduces_Confidence()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 114.98m,
            Confidence = 0.84m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Receipt);

        var matched = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.90m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedDocumentLanguage = DocumentLanguage.EnglishCanada
        });

        var mismatched = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.90m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedDocumentLanguage = DocumentLanguage.FrenchCanada
        });

        Assert.True(mismatched < matched);
    }

    [Fact]
    public void ConfidenceScoring_Missing_Required_Fields_Is_Low()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Unknown",
            Confidence = 0.45m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Receipt);

        var score = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.55m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedDocumentLanguage = DocumentLanguage.EnglishCanada
        });

        Assert.InRange(score, 0m, 0.45m);
    }

    [Fact]
    public void ConfidenceScoring_Tax_Mismatch_Is_Low()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 140m,
            Confidence = 0.80m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Receipt);

        var score = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.84m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedDocumentLanguage = DocumentLanguage.EnglishCanada
        });

        Assert.InRange(score, 0m, 0.60m);
    }

    [Fact]
    public void ConfidenceScoring_Low_Confidence_Primary_Recovered_By_Gemini_Fallback()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 114.98m,
            Confidence = 0.82m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Receipt);

        var score = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.82m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedDocumentLanguage = DocumentLanguage.EnglishCanada,
            FallbackNeeded = true,
            FallbackUsed = true,
            GeminiFlashLiteUsed = true,
            GeminiUsedAfterLowConfidencePrimary = true
        });

        Assert.InRange(score, 0.78m, 1.00m);
    }

    [Fact]
    public void ConfidenceScoring_Gemini_Fallback_With_Failed_Validation_Stays_Low()
    {
        var service = new ConfidenceScoringService();
        var extraction = new FinancialExtractionResult
        {
            VendorName = "Store",
            DocumentDate = new DateTime(2026, 5, 31),
            Subtotal = 100m,
            Gst = 5m,
            Qst = 9.98m,
            Total = 150m,
            Confidence = 0.72m
        };
        var validation = new FinancialDocumentValidator().Validate(extraction, DocumentType.Receipt);

        var score = service.CalculateOverallConfidence(new ConfidenceScoringInput
        {
            DocumentType = DocumentType.Receipt,
            ExtractionResult = extraction,
            ValidationResult = validation,
            OcrConfidence = 0.72m,
            StructuredExtractionConfidence = extraction.Confidence,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedDocumentLanguage = DocumentLanguage.EnglishCanada,
            FallbackNeeded = true,
            FallbackUsed = true,
            GeminiFlashLiteUsed = true,
            GeminiUsedAfterLowConfidencePrimary = true
        });

        Assert.InRange(score, 0m, 0.60m);
    }
}
