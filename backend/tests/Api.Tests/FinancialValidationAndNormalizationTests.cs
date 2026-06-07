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
}
