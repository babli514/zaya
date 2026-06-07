namespace FinancialOCR.Domain.Entities;

public enum DocumentType
{
    Unknown,
    Receipt,
    Invoice
}

public enum DocumentLanguage
{
    Unknown,
    EnglishCanada,
    FrenchCanada,
    BilingualCanada
}

public enum ProcessingStatus
{
    Pending,
    Uploaded,
    Processing,
    Completed,
    Failed,
    NeedsReview
}

public enum ExtractionJobStatus
{
    Pending,
    Running,
    Completed,
    Failed
}

public enum OcrEngineType
{
    Unknown,
    Tesseract,
    AzureRead,
    GoogleVision,
    Custom
}
