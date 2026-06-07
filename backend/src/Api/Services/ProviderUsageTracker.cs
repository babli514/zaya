using FinancialOCR.Api.Options;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.Extensions.Options;

namespace FinancialOCR.Api.Services;

public interface IProviderUsageTracker
{
    Task<ProviderUsageRecord?> StartAsync(Guid documentId, Guid? extractionJobId, string providerName, string modelName, ProviderOperationType operationType, DateTime startedAtUtc, CancellationToken cancellationToken);
    Task CompleteSuccessAsync(ProviderUsageRecord? record, DateTime completedAtUtc, long? latencyMs, int? inputTokenCount, int? outputTokenCount, long? inputBytes, long? outputBytes, decimal? estimatedCostUsd, CancellationToken cancellationToken);
    Task CompleteFailureAsync(ProviderUsageRecord? record, DateTime completedAtUtc, long? latencyMs, string? errorCode, string? errorMessage, int? inputTokenCount, int? outputTokenCount, long? inputBytes, long? outputBytes, decimal? estimatedCostUsd, CancellationToken cancellationToken);
    decimal? EstimateCostUsd(string modelName, int? inputTokenCount, int? outputTokenCount);
}

public class ProviderUsageTracker : IProviderUsageTracker
{

    private readonly AppDbContext _dbContext;
    private readonly ProviderUsageOptions _options;
    private readonly ILogger<ProviderUsageTracker> _logger;

    public ProviderUsageTracker(AppDbContext dbContext, IOptions<ProviderUsageOptions> options, ILogger<ProviderUsageTracker> logger)
    {
        _dbContext = dbContext;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<ProviderUsageRecord?> StartAsync(Guid documentId, Guid? extractionJobId, string providerName, string modelName, ProviderOperationType operationType, DateTime startedAtUtc, CancellationToken cancellationToken)
    {
        if (!_options.TrackUsage)
        {
            return null;
        }

        try
        {
            var record = new ProviderUsageRecord
            {
                Id = Guid.NewGuid(),
                DocumentId = documentId,
                ExtractionJobId = extractionJobId,
                ProviderName = providerName,
                ModelName = modelName,
                OperationType = operationType,
                StartedAtUtc = startedAtUtc,
                Success = false,
                CreatedAtUtc = DateTime.UtcNow
            };

            _dbContext.ProviderUsageRecords.Add(record);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return record;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Provider usage tracking start failed for DocumentId={DocumentId}", documentId);
            return null;
        }
    }

    public async Task CompleteSuccessAsync(ProviderUsageRecord? record, DateTime completedAtUtc, long? latencyMs, int? inputTokenCount, int? outputTokenCount, long? inputBytes, long? outputBytes, decimal? estimatedCostUsd, CancellationToken cancellationToken)
    {
        if (!_options.TrackUsage || record == null)
        {
            return;
        }

        try
        {
            record.CompletedAtUtc = completedAtUtc;
            record.LatencyMs = latencyMs;
            record.Success = true;
            record.ErrorCode = null;
            record.ErrorMessage = null;
            record.InputTokenCount = inputTokenCount;
            record.OutputTokenCount = outputTokenCount;
            record.InputBytes = inputBytes;
            record.OutputBytes = outputBytes;
            record.EstimatedCostUsd = estimatedCostUsd;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Provider usage tracking completion failed for UsageRecordId={UsageRecordId}", record.Id);
        }
    }

    public async Task CompleteFailureAsync(ProviderUsageRecord? record, DateTime completedAtUtc, long? latencyMs, string? errorCode, string? errorMessage, int? inputTokenCount, int? outputTokenCount, long? inputBytes, long? outputBytes, decimal? estimatedCostUsd, CancellationToken cancellationToken)
    {
        if (!_options.TrackUsage || record == null)
        {
            return;
        }

        try
        {
            record.CompletedAtUtc = completedAtUtc;
            record.LatencyMs = latencyMs;
            record.Success = false;
            record.ErrorCode = string.IsNullOrWhiteSpace(errorCode) ? null : errorCode;
            record.ErrorMessage = Truncate(errorMessage, 2000);
            record.InputTokenCount = inputTokenCount;
            record.OutputTokenCount = outputTokenCount;
            record.InputBytes = inputBytes;
            record.OutputBytes = outputBytes;
            record.EstimatedCostUsd = estimatedCostUsd;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Provider usage tracking failure update failed for UsageRecordId={UsageRecordId}", record.Id);
        }
    }

    public decimal? EstimateCostUsd(string modelName, int? inputTokenCount, int? outputTokenCount)
    {
        var pricing = ResolvePricing(modelName);
        if (pricing == null)
        {
            return null;
        }

        decimal total = 0m;
        var hasAny = false;

        if (pricing.InputCostPerMillionTokens.HasValue && inputTokenCount.HasValue)
        {
            total += (inputTokenCount.Value / 1_000_000m) * pricing.InputCostPerMillionTokens.Value;
            hasAny = true;
        }

        if (pricing.OutputCostPerMillionTokens.HasValue && outputTokenCount.HasValue)
        {
            total += (outputTokenCount.Value / 1_000_000m) * pricing.OutputCostPerMillionTokens.Value;
            hasAny = true;
        }

        return hasAny ? decimal.Round(total, 6, MidpointRounding.AwayFromZero) : null;
    }

    private ProviderModelPricingOptions? ResolvePricing(string modelName)
    {
        if (modelName.Contains("gemini", StringComparison.OrdinalIgnoreCase))
        {
            return _options.Pricing.GeminiFlashLite;
        }

        if (modelName.StartsWith("gpt-", StringComparison.OrdinalIgnoreCase)
            || modelName.Contains("openai", StringComparison.OrdinalIgnoreCase)
            || modelName.Contains("o4", StringComparison.OrdinalIgnoreCase))
        {
            return _options.Pricing.OpenAI;
        }

        return null;
    }

    private static string? Truncate(string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var normalized = value.Trim();
        return normalized.Length <= maxLength ? normalized : normalized[..maxLength];
    }
}
