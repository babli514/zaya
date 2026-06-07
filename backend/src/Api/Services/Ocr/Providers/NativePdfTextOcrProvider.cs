using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using System.Diagnostics;
using System.Text;
using UglyToad.PdfPig;

namespace FinancialOCR.Api.Services;

public class NativePdfTextOcrProvider : IOcrProvider
{
    private const int MeaningfulTextThreshold = 40;

    public OcrEngineType EngineType => OcrEngineType.NativePdfText;

    public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
    {
        if (!IsPdf(request))
        {
            throw new NotSupportedException("Native PDF text extraction supports only PDF documents.");
        }

        var stopwatch = Stopwatch.StartNew();
        var warnings = new List<string>();
        var pageTexts = new List<string>();
        var pageCount = 0;

        using (var pdfDocument = PdfDocument.Open(request.FilePath))
        {
            foreach (var page in pdfDocument.GetPages())
            {
                cancellationToken.ThrowIfCancellationRequested();
                pageCount++;
                pageTexts.Add(page.Text ?? string.Empty);
            }
        }

        var rawText = BuildRawText(pageTexts);
        var normalizedLength = CountNonWhitespaceCharacters(rawText);
        var confidence = normalizedLength >= MeaningfulTextThreshold ? 0.95m : 0.2m;

        if (string.IsNullOrWhiteSpace(rawText))
        {
            warnings.Add("Extracted text is empty.");
        }
        else if (normalizedLength < MeaningfulTextThreshold)
        {
            warnings.Add("Extracted text is too short for reliable field extraction.");
        }

        stopwatch.Stop();

        return Task.FromResult(new OcrResult
        {
            RawText = rawText,
            PageCount = pageCount,
            Warnings = warnings,
            RequestedDocumentLanguage = request.RequestedDocumentLanguage,
            DetectedLanguage = request.DetectedLanguage,
            PreferredVisionProvider = request.PreferredVisionProvider,
            OcrEngineType = EngineType,
            ProviderName = "NativePdf",
            ModelName = "PdfPig",
            ProviderLatencyMs = stopwatch.ElapsedMilliseconds,
            Confidence = confidence
        });
    }

    internal static bool IsPdf(OcrRequest request)
    {
        return string.Equals(Path.GetExtension(request.FilePath), ".pdf", StringComparison.OrdinalIgnoreCase)
            || string.Equals(request.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase);
    }

    internal static string BuildRawText(IReadOnlyList<string> pageTexts)
    {
        if (pageTexts.Count == 0)
        {
            return string.Empty;
        }

        var builder = new StringBuilder();
        for (var i = 0; i < pageTexts.Count; i++)
        {
            if (i > 0)
            {
                builder.AppendLine();
                builder.AppendLine("----------");
                builder.AppendLine();
            }

            builder.Append(pageTexts[i]);
        }

        return builder.ToString();
    }

    internal static int CountNonWhitespaceCharacters(string value)
    {
        return value.Count(ch => !char.IsWhiteSpace(ch));
    }
}
