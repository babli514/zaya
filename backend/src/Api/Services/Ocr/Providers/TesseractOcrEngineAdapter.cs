using Tesseract;

namespace FinancialOCR.Api.Services;

public class TesseractOcrEngineAdapter : ITesseractOcrEngineAdapter
{
    public TesseractAdapterResult Extract(string tesseractDataPath, string language, string filePath, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        using var engine = new TesseractEngine(tesseractDataPath, language, EngineMode.Default);
        using var image = Pix.LoadFromFile(filePath);
        using var page = engine.Process(image);

        return new TesseractAdapterResult
        {
            RawText = page.GetText() ?? string.Empty,
            Confidence = (decimal)page.GetMeanConfidence()
        };
    }
}
