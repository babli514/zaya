using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Api.Services;

public class NullProviderUsageTracker : IProviderUsageTracker
{
    public Task<ProviderUsageRecord?> StartAsync(Guid documentId, Guid? extractionJobId, string providerName, string modelName, ProviderOperationType operationType, DateTime startedAtUtc, CancellationToken cancellationToken)
    {
        return Task.FromResult<ProviderUsageRecord?>(null);
    }

    public Task CompleteSuccessAsync(ProviderUsageRecord? record, DateTime completedAtUtc, long? latencyMs, int? inputTokenCount, int? outputTokenCount, long? inputBytes, long? outputBytes, decimal? estimatedCostUsd, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task CompleteFailureAsync(ProviderUsageRecord? record, DateTime completedAtUtc, long? latencyMs, string? errorCode, string? errorMessage, int? inputTokenCount, int? outputTokenCount, long? inputBytes, long? outputBytes, decimal? estimatedCostUsd, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public decimal? EstimateCostUsd(string modelName, int? inputTokenCount, int? outputTokenCount)
    {
        return null;
    }
}
