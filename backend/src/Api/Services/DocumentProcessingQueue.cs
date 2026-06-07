using System.Threading.Channels;
using FinancialOCR.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinancialOCR.Api.Services;

public interface IDocumentProcessingQueue
{
    ValueTask<bool> QueueAsync(Guid documentId, CancellationToken cancellationToken);
    ValueTask<Guid> DequeueAsync(CancellationToken cancellationToken);
}

public sealed class DocumentProcessingQueue : IDocumentProcessingQueue
{
    private readonly Channel<Guid> _channel;

    public DocumentProcessingQueue()
    {
        _channel = Channel.CreateUnbounded<Guid>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        });
    }

    public async ValueTask<bool> QueueAsync(Guid documentId, CancellationToken cancellationToken)
    {
        if (!await _channel.Writer.WaitToWriteAsync(cancellationToken))
        {
            return false;
        }

        return _channel.Writer.TryWrite(documentId);
    }

    public async ValueTask<Guid> DequeueAsync(CancellationToken cancellationToken)
    {
        return await _channel.Reader.ReadAsync(cancellationToken);
    }
}

public sealed class DocumentProcessingWorker : BackgroundService
{
    private readonly IDocumentProcessingQueue _queue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DocumentProcessingWorker> _logger;

    public DocumentProcessingWorker(
        IDocumentProcessingQueue queue,
        IServiceScopeFactory scopeFactory,
        ILogger<DocumentProcessingWorker> logger)
    {
        _queue = queue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            Guid documentId;
            try
            {
                documentId = await _queue.DequeueAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }

            try
            {
                using var scope = _scopeFactory.CreateScope();
                var processingService = scope.ServiceProvider.GetRequiredService<IDocumentProcessingService>();
                await processingService.ProcessDocumentAsync(documentId, stoppingToken);
                _logger.LogInformation("Background processing completed for document {DocumentId}", documentId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Background processing failed for document {DocumentId}", documentId);
            }
        }
    }
}
