using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;

namespace Api.Tests;

public class FinancialParsersAndExtractorTests
{
    [Theory]
    [InlineData("$12.34", 12.34)]
    [InlineData("12.34", 12.34)]
    [InlineData("12,34", 12.34)]
    [InlineData("1,234.56", 1234.56)]
    [InlineData("1 234,56", 1234.56)]
    [InlineData("1 234.56", 1234.56)]
    [InlineData("CAD 12.34", 12.34)]
    [InlineData("12,34 $", 12.34)]
    public void MoneyParser_Parses_Expected_Formats(string value, decimal expected)
    {
        var ok = MoneyParser.TryParseAmount(value, out var amount);

        Assert.True(ok);
        Assert.Equal(expected, amount);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("hello")]
    [InlineData("-")]
    [InlineData("12")]
    public void MoneyParser_Rejects_Invalid_Values(string value)
    {
        var ok = MoneyParser.TryParseAmount(value, out _);

        Assert.False(ok);
    }

    [Theory]
    [InlineData("2026-05-31", 2026, 5, 31)]
    [InlineData("31/05/2026", 2026, 5, 31)]
    [InlineData("05/31/2026", 2026, 5, 31)]
    [InlineData("31-05-2026", 2026, 5, 31)]
    [InlineData("2026/05/31", 2026, 5, 31)]
    [InlineData("31 mai 2026", 2026, 5, 31)]
    [InlineData("31 août 2026", 2026, 8, 31)]
    [InlineData("31 aout 2026", 2026, 8, 31)]
    [InlineData("31 décembre 2026", 2026, 12, 31)]
    [InlineData("31 decembre 2026", 2026, 12, 31)]
    [InlineData("May 31, 2026", 2026, 5, 31)]
    public void DateParser_Parses_English_And_French_Dates(string value, int year, int month, int day)
    {
        var ok = DateParser.TryParseDate(value, DocumentLanguage.BilingualCanada, out var date, out var confidence);

        Assert.True(ok);
        Assert.Equal(new DateTime(year, month, day), date);
        Assert.True(confidence > 0m);
    }

    [Fact]
    public void DateParser_Uses_Lower_Confidence_For_MmDdYyyy_Format()
    {
        var ok = DateParser.TryParseDate("05/31/2026", DocumentLanguage.BilingualCanada, out var date, out var confidence);

        Assert.True(ok);
        Assert.Equal(new DateTime(2026, 5, 31), date);
        Assert.Equal(0.55m, confidence);
    }

    [Fact]
    public async Task FinancialExtractor_Extracts_English_Receipt_Amounts()
    {
        var rawText = "Store ABC\nDate: 2026-05-31\nSubtotal: 100.00\nGST: 5.00\nQST: 9.98\nTotal: 114.98";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Receipt,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada
        }, CancellationToken.None);

        Assert.Equal(100.00m, result.Subtotal);
        Assert.Equal(5.00m, result.Gst);
        Assert.Equal(9.98m, result.Qst);
        Assert.Equal(114.98m, result.Total);
    }

    [Theory]
    [InlineData("Marchand Exemple\nDate: 31 août 2026\nSous-total: 100,00\nTPS: 5,00\nTVQ: 9,98\nMontant dû: 114,98")]
    [InlineData("Marchand Exemple\nDate: 31 aout 2026\nSous-total: 100,00\nTPS: 5,00\nTVQ: 9,98\nMontant du: 114,98")]
    public async Task FinancialExtractor_Extracts_French_Receipt_Amounts_With_And_Without_Accents(string rawText)
    {
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Receipt,
            RequestedDocumentLanguage = DocumentLanguage.FrenchCanada,
            DetectedLanguage = DocumentLanguage.FrenchCanada
        }, CancellationToken.None);

        Assert.Equal(100.00m, result.Subtotal);
        Assert.Equal(5.00m, result.Gst);
        Assert.Equal(9.98m, result.Qst);
        Assert.Equal(114.98m, result.Total);
    }

    [Fact]
    public async Task FinancialExtractor_Extracts_Bilingual_Receipt_With_Gst_And_Tvq_Labels()
    {
        var rawText = "Vendor: Cafe Mixte\nDate: 2026-05-31\nSubtotal: 50.00\nGST: 2.50\nTVQ: 4.99\nTotal: 57.49";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Receipt,
            RequestedDocumentLanguage = DocumentLanguage.BilingualCanada,
            DetectedLanguage = DocumentLanguage.BilingualCanada
        }, CancellationToken.None);

        Assert.Equal(50.00m, result.Subtotal);
        Assert.Equal(2.50m, result.Gst);
        Assert.Equal(4.99m, result.Qst);
        Assert.Equal(57.49m, result.Total);
    }

    [Fact]
    public async Task FinancialExtractor_Extracts_English_Invoice_Fields()
    {
        var rawText = "Vendor: Office Co\nInvoice Number: INV-123\nDate: 2026-05-31\nDue Date: 2026-06-30\nSubtotal: 100.00\nGST: 5.00\nQST: 9.98\nTotal: 114.98";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada
        }, CancellationToken.None);

        Assert.Equal("INV-123", result.DocumentNumber);
        Assert.Equal(new DateTime(2026, 5, 31), result.DocumentDate);
        Assert.Equal(new DateTime(2026, 6, 30), result.DueDate);
        Assert.Equal(114.98m, result.Total);
    }

    [Fact]
    public async Task FinancialExtractor_Extracts_French_Invoice_Fields()
    {
        var rawText = "Marchand: Bureau Exemple\nNo de facture: FAC-88\nDate: 31 mai 2026\nDate d'échéance: 30/06/2026\nSous-total: 100,00\nTPS: 5,00\nTVQ: 9,98\nMontant dû: 114,98";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.FrenchCanada,
            DetectedLanguage = DocumentLanguage.FrenchCanada
        }, CancellationToken.None);

        Assert.Equal("FAC-88", result.DocumentNumber);
        Assert.Equal(new DateTime(2026, 5, 31), result.DocumentDate);
        Assert.Equal(new DateTime(2026, 6, 30), result.DueDate);
        Assert.Equal(114.98m, result.Total);
    }

    [Fact]
    public async Task FinancialExtractor_Missing_Total_Remains_Null_When_No_Amounts_Present()
    {
        var rawText = "Vendor: Store ABC\nDate: 2026-05-31\nThank you";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Receipt,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada
        }, CancellationToken.None);

        Assert.Null(result.Total);
    }

    [Fact]
    public async Task FinancialExtractor_Missing_Vendor_Defaults_To_Unknown()
    {
        var rawText = "\n\nTotal: 20.00";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Receipt,
            RequestedDocumentLanguage = DocumentLanguage.BilingualCanada,
            DetectedLanguage = DocumentLanguage.BilingualCanada
        }, CancellationToken.None);

        Assert.Equal("Unknown", result.VendorName);
    }
}
