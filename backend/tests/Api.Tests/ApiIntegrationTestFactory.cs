using FinancialOCR.Api.Options;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using System.IO;

namespace Api.Tests;

public class ApiIntegrationTestFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"ApiIntegrationTests-{Guid.NewGuid():N}";
    private readonly string _uploadRootFolder = Path.Combine(Path.GetTempPath(), $"financial-ocr-test-uploads-{Guid.NewGuid():N}");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
            services.RemoveAll<AppDbContext>();
            services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase(_databaseName));

            services.PostConfigure<DocumentUploadOptions>(options =>
            {
                options.RootFolder = _uploadRootFolder;
                options.MaxFileSizeMb = 10;
            });

            services.PostConfigure<ApiSecurityOptions>(options =>
            {
                options.ApiKey = string.Empty;
            });

            services.RemoveAll<IOcrProvider>();
            services.AddScoped<IOcrProvider, FakeNativePdfOcrProvider>();
            services.AddScoped<IOcrProvider, FakeTesseractOcrProvider>();
            services.AddScoped<IOcrProvider, FakeVisionFallbackOcrProvider>();

            services.PostConfigure<OcrOptions>(options =>
            {
                options.EnableNativePdfText = true;
                options.EnableTesseract = true;
                options.EnableFallbackOnLowConfidence = false;
                options.EnableFallbackOnValidationFailure = false;
                options.MinimumRawTextLength = 1;
                options.VisionOcr.FallbackEnabled = true;
            });

            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IDocumentProcessingService));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            services.AddScoped<IDocumentProcessingService, DocumentProcessingService>();
        });
    }

    private sealed class FakeNativePdfOcrProvider : IOcrProvider
    {
        public OcrEngineType EngineType => OcrEngineType.NativePdfText;

        public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return Task.FromResult(new OcrResult
            {
                RawText = "Vendor: PDF Store\nInvoice Number: PDF-001\nDate: 2026-05-31\nDue Date: 2026-06-30\nSubtotal: 100.00\nGST: 5.00\nQST: 9.98\nTotal: 114.98",
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.RequestedDocumentLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = EngineType,
                ProviderName = "FakeNativePdf",
                ModelName = "fake-native-pdf",
                ProviderLatencyMs = 10,
                ProviderCostEstimate = 0m,
                PageCount = 1,
                Confidence = 0.95m
            });
        }
    }

    private sealed class FakeTesseractOcrProvider : IOcrProvider
    {
        public OcrEngineType EngineType => OcrEngineType.Tesseract;

        public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return Task.FromResult(new OcrResult
            {
                RawText = "Vendor: Image Store\nDate: 2026-05-31\nSubtotal: 100.00\nGST: 5.00\nQST: 9.98\nTotal: 114.98",
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.RequestedDocumentLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = EngineType,
                ProviderName = "FakeTesseract",
                ModelName = "fake-tesseract",
                ProviderLatencyMs = 12,
                ProviderCostEstimate = 0m,
                PageCount = 1,
                Confidence = 0.95m
            });
        }
    }

    private sealed class FakeVisionFallbackOcrProvider : IOcrProvider
    {
        public OcrEngineType EngineType => OcrEngineType.VisionFallback;

        public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return Task.FromResult(new OcrResult
            {
                RawText = "Vendor: Fallback Store\nDate: 2026-05-31\nSubtotal: 100.00\nGST: 5.00\nQST: 9.98\nTotal: 114.98",
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.RequestedDocumentLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.GeminiFlashLite,
                ProviderName = "FakeGemini",
                ModelName = "fake-gemini",
                ProviderLatencyMs = 40,
                ProviderCostEstimate = 0.0025m,
                PageCount = 1,
                Confidence = 0.99m
            });
        }
    }
}
