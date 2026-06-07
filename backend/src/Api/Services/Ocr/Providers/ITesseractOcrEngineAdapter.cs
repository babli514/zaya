namespace FinancialOCR.Api.Services;

public interface ITesseractOcrEngineAdapter
{
    TesseractAdapterResult Extract(string tesseractDataPath, string language, string filePath, CancellationToken cancellationToken);
}
