using FinancialOCR.Domain.Entities;

namespace Api.Tests.Evaluation;

public sealed class EvaluationDataset
{
    public List<EvaluationSampleDefinition> Documents { get; set; } = new();
}

public sealed class EvaluationSampleDefinition
{
    public string SampleRelativePath { get; set; } = string.Empty;
    public DocumentType DocumentType { get; set; } = DocumentType.Receipt;
    public DocumentLanguage DocumentLanguage { get; set; } = DocumentLanguage.BilingualCanada;
    public EvaluationExpectedFields Expected { get; set; } = new();
}

public sealed class EvaluationExpectedFields
{
    public string? VendorName { get; set; }
    public DateTime? DocumentDate { get; set; }
    public decimal? Total { get; set; }
    public decimal? Subtotal { get; set; }
    public decimal? Gst { get; set; }
    public decimal? Qst { get; set; }
    public string? DocumentNumber { get; set; }
}

public sealed class EvaluationRunOptions
{
    public string EvaluationRootPath { get; set; } = string.Empty;
    public string ExpectedFilePath { get; set; } = string.Empty;
    public string SamplesRootPath { get; set; } = string.Empty;
    public string ResultsJsonPath { get; set; } = string.Empty;
    public string SummaryCsvPath { get; set; } = string.Empty;
    public bool EnableGeminiApiCalls { get; set; }
    public decimal NeedsReviewConfidenceThreshold { get; set; } = 0.75m;
    public decimal AmountTolerance { get; set; } = 0.02m;
}

public sealed class EvaluationResultRow
{
    public string SampleRelativePath { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public bool Executed { get; set; }
    public bool VendorMatch { get; set; }
    public bool DateMatch { get; set; }
    public bool TotalMatch { get; set; }
    public bool SubtotalMatch { get; set; }
    public bool GstMatch { get; set; }
    public bool QstMatch { get; set; }
    public bool DocumentNumberMatch { get; set; }
    public bool ValidationSuccess { get; set; }
    public bool NeedsReview { get; set; }
    public decimal Confidence { get; set; }
    public long LatencyMs { get; set; }
    public decimal EstimatedCost { get; set; }
    public string? Error { get; set; }
}

public sealed class EvaluationProviderSummary
{
    public string Provider { get; set; } = string.Empty;
    public int TotalDocuments { get; set; }
    public int ExecutedDocuments { get; set; }
    public decimal FieldLevelAccuracy { get; set; }
    public decimal AmountAccuracy { get; set; }
    public decimal DateAccuracy { get; set; }
    public decimal ValidationPassRate { get; set; }
    public decimal NeedsReviewRate { get; set; }
    public decimal AverageLatencyMs { get; set; }
    public decimal EstimatedCostPerSuccessfulDocument { get; set; }
}

public sealed class EvaluationRunOutput
{
    public DateTime GeneratedAtUtc { get; set; }
    public string EvaluationRootPath { get; set; } = string.Empty;
    public string ExpectedFilePath { get; set; } = string.Empty;
    public List<EvaluationResultRow> Results { get; set; } = new();
    public List<EvaluationProviderSummary> Summary { get; set; } = new();
}
