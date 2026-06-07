using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;

namespace Api.Tests;

public class FinancialExtractionParsersTests
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

    [Fact]
    public void TaxLabelNormalizer_Maps_Gst_And_Tps_To_Gst()
    {
        Assert.Equal("gst", CanadianTaxLabelNormalizer.NormalizeTaxLabel("GST"));
        Assert.Equal("gst", CanadianTaxLabelNormalizer.NormalizeTaxLabel("T.P.S."));
    }

    [Fact]
    public void TaxLabelNormalizer_Maps_Qst_And_Tvq_To_Qst()
    {
        Assert.Equal("qst", CanadianTaxLabelNormalizer.NormalizeTaxLabel("QST"));
        Assert.Equal("qst", CanadianTaxLabelNormalizer.NormalizeTaxLabel("T.V.Q."));
    }

    [Fact]
    public void Normalization_Supports_Accented_And_Unaccented_French()
    {
        var accented = TextNormalizationHelper.NormalizeForMatching("Reçu - Montant dû");
        var unaccented = TextNormalizationHelper.NormalizeForMatching("Recu - Montant du");

        Assert.Equal(unaccented, accented);
    }

    [Theory]
    [InlineData("2026-06-07")]
    [InlineData("07/06/2026")]
    [InlineData("06/07/2026")]
    [InlineData("07-06-2026")]
    [InlineData("2026/06/07")]
    [InlineData("7 juin 2026")]
    [InlineData("June 7, 2026")]
    public void DateParser_Parses_English_And_French_Dates(string value)
    {
        var ok = DateParser.TryParseDate(value, DocumentLanguage.BilingualCanada, out _, out var confidence);

        Assert.True(ok);
        Assert.True(confidence > 0m);
    }

    [Fact]
    public async Task FinancialExtractor_Extracts_English_Amount_Labels()
    {
        var rawText = "Store ABC\nInvoice Number: INV-123\nDate: 2026-06-07\nSubtotal: 100.00\nGST: 5.00\nQST: 9.98\nTotal: 114.98";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada
        }, CancellationToken.None);

        Assert.Equal(100.00m, result.Subtotal);
        Assert.Equal(5.00m, result.Gst);
        Assert.Equal(9.98m, result.Qst);
        Assert.Equal(114.98m, result.Total);
    }

    [Fact]
    public async Task FinancialExtractor_Extracts_French_Amount_Labels()
    {
        var rawText = "Marchand Exemple\nNo de facture: FAC-88\nDate: 7 juin 2026\nSous-total: 100,00\nTPS: 5,00\nTVQ: 9,98\nMontant dû: 114,98";
        var extractor = new FinancialFieldExtractor();

        var result = await extractor.ExtractAsync(new FinancialExtractionInput
        {
            DocumentId = Guid.NewGuid(),
            RawText = rawText,
            DocumentType = DocumentType.Invoice,
            RequestedDocumentLanguage = DocumentLanguage.FrenchCanada,
            DetectedLanguage = DocumentLanguage.FrenchCanada
        }, CancellationToken.None);

        Assert.Equal(100.00m, result.Subtotal);
        Assert.Equal(5.00m, result.Gst);
        Assert.Equal(9.98m, result.Qst);
        Assert.Equal(114.98m, result.Total);
    }
}
