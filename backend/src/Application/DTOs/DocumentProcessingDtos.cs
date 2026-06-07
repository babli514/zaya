using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Application.DTOs;

public class OcrRouteDecision
{
    public OcrEngineType OcrEngineType { get; set; }
    public DocumentLanguage RequestedDocumentLanguage { get; set; }
    public DocumentLanguage DetectedLanguage { get; set; }
    public string PreferredVisionProvider { get; set; } = string.Empty;
    public string ProviderName { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public bool UseVisionFallback { get; set; }
    public OcrEngineType FallbackOcrEngineType { get; set; } = OcrEngineType.Unknown;
    public decimal MinPrimaryOcrConfidence { get; set; } = 0.75m;
    public int MinRawTextLength { get; set; } = 80;
    public bool UseForLowConfidenceResults { get; set; }
    public bool UseForValidationFailures { get; set; }
    public bool UseForScannedPdf { get; set; }
}

public class OcrRequest
{
    public Guid DocumentId { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public DocumentLanguage RequestedDocumentLanguage { get; set; }
    public DocumentLanguage DetectedLanguage { get; set; }
    public string PreferredVisionProvider { get; set; } = string.Empty;
    public OcrEngineType OcrEngineType { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
}

public class OcrResult
{
    public string RawText { get; set; } = string.Empty;
    public int PageCount { get; set; }
    public List<string> Warnings { get; set; } = new();
    public DocumentLanguage RequestedDocumentLanguage { get; set; }
    public DocumentLanguage DetectedLanguage { get; set; }
    public string PreferredVisionProvider { get; set; } = string.Empty;
    public OcrEngineType OcrEngineType { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public long? ProviderLatencyMs { get; set; }
    public decimal? ProviderCostEstimate { get; set; }
    public decimal? Confidence { get; set; }
}

public class FinancialExtractionInput
{
    public Guid DocumentId { get; set; }
    public string RawText { get; set; } = string.Empty;
    public DocumentType DocumentType { get; set; }
    public DocumentLanguage RequestedDocumentLanguage { get; set; }
    public DocumentLanguage DetectedLanguage { get; set; }
    public string PreferredVisionProvider { get; set; } = string.Empty;
    public OcrEngineType OcrEngineType { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public long? ProviderLatencyMs { get; set; }
    public decimal? ProviderCostEstimate { get; set; }
}

public class FinancialExtractionResult
{
    public string VendorName { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public string? DocumentNumber { get; set; }
    public DateTime? DocumentDate { get; set; }
    public DateTime? DueDate { get; set; }
    public string Currency { get; set; } = "CAD";
    public decimal? Subtotal { get; set; }
    public decimal? Gst { get; set; }
    public decimal? Qst { get; set; }
    public decimal? Hst { get; set; }
    public decimal? Pst { get; set; }
    public decimal? Tip { get; set; }
    public decimal? Total { get; set; }
    public decimal? Confidence { get; set; }
    public DocumentLanguage RequestedDocumentLanguage { get; set; }
    public DocumentLanguage DetectedLanguage { get; set; }
    public string PreferredVisionProvider { get; set; } = string.Empty;
    public OcrEngineType OcrEngineType { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public long? ProviderLatencyMs { get; set; }
    public decimal? ProviderCostEstimate { get; set; }
}

public class ValidationWarning
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class FinancialValidationResult
{
    public bool IsValid { get; set; }
    public List<ValidationWarning> Warnings { get; set; } = new();
    public DocumentLanguage RequestedDocumentLanguage { get; set; }
    public DocumentLanguage DetectedLanguage { get; set; }
    public string PreferredVisionProvider { get; set; } = string.Empty;
    public OcrEngineType OcrEngineType { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public long? ProviderLatencyMs { get; set; }
    public decimal? ProviderCostEstimate { get; set; }
}
