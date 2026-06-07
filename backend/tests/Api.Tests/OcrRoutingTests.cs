using FinancialOCR.Api.Options;
using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;
using Microsoft.Extensions.Options;

namespace Api.Tests;

public class OcrRoutingTests
{
    [Fact]
    public async Task OcrRouter_Selects_NativePdf_For_Pdf()
    {
        var options = Options.Create(new OcrOptions());
        var router = new OcrRouter(options);
        var document = new Document
        {
            Id = Guid.NewGuid(),
            ContentType = "application/pdf",
            FileExtension = ".pdf"
        };

        var decision = await router.SelectRouteAsync(document, CancellationToken.None);

        Assert.Equal(OcrEngineType.NativePdfText, decision.OcrEngineType);
        Assert.True(decision.IsPdf);
        Assert.False(decision.IsImage);
        Assert.Equal(options.Value.MinimumRawTextLength, decision.MinimumRawTextLength);
        Assert.Equal(options.Value.MinimumOcrConfidence, decision.MinimumOcrConfidence);
        Assert.Equal(options.Value.AutoCompleteConfidenceThreshold, decision.AutoCompleteConfidenceThreshold);
    }

    [Fact]
    public async Task OcrRouter_Selects_Tesseract_For_Image()
    {
        var options = Options.Create(new OcrOptions());
        var router = new OcrRouter(options);
        var document = new Document
        {
            Id = Guid.NewGuid(),
            ContentType = "image/png",
            FileExtension = ".png"
        };

        var decision = await router.SelectRouteAsync(document, CancellationToken.None);

        Assert.Equal(OcrEngineType.Tesseract, decision.OcrEngineType);
        Assert.True(decision.IsImage);
        Assert.False(decision.IsPdf);
    }

}
