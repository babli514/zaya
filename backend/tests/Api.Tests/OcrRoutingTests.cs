using FinancialOCR.Api.Options;
using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace Api.Tests;

public class OcrRoutingTests
{
    [Fact]
    public async Task OcrRouter_Selects_NativePdf_For_Digital_Pdf_First()
    {
        var options = Options.Create(new OcrOptions
        {
            EnableNativePdfText = true,
            EnableTesseract = true
        });
        var router = new OcrRouter(options);
        var document = new Document
        {
            Id = Guid.NewGuid(),
            OriginalFileName = "doc.pdf",
            StoredFileName = "doc.pdf",
            StoragePath = "c:/tmp/doc.pdf",
            ContentType = "application/pdf",
            FileExtension = ".pdf",
            DocumentLanguage = DocumentLanguage.EnglishCanada
        };

        var decision = await router.SelectRouteAsync(document, CancellationToken.None);

        Assert.Equal(OcrEngineType.NativePdfText, decision.OcrEngineType);
        Assert.True(decision.IsPdf);
        Assert.False(decision.IsImage);
    }

    [Fact]
    public async Task OcrRouter_Selects_Tesseract_For_Image_First_When_Enabled()
    {
        var options = Options.Create(new OcrOptions
        {
            EnableNativePdfText = true,
            EnableTesseract = true
        });
        var router = new OcrRouter(options);
        var document = new Document
        {
            Id = Guid.NewGuid(),
            OriginalFileName = "img.png",
            StoredFileName = "img.png",
            StoragePath = "c:/tmp/img.png",
            ContentType = "image/png",
            FileExtension = ".png",
            DocumentLanguage = DocumentLanguage.EnglishCanada
        };

        var decision = await router.SelectRouteAsync(document, CancellationToken.None);

        Assert.Equal(OcrEngineType.Tesseract, decision.OcrEngineType);
        Assert.True(decision.IsImage);
        Assert.False(decision.IsPdf);
    }

    [Fact]
    public async Task Low_Confidence_Tesseract_Allows_Gemini_Fallback_When_Enabled()
    {
        var primaryProvider = new FakeOcrProvider(
            OcrEngineType.Tesseract,
            request => new OcrResult
            {
                RawText = "This is enough OCR text length for routing checks.",
                Confidence = 0.2m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.Tesseract,
                ProviderName = "Tesseract"
            });

        var fallbackProvider = new FakeOcrProvider(
            OcrEngineType.VisionFallback,
            request => new OcrResult
            {
                RawText = "Gemini fallback OCR text",
                Confidence = 0.95m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.GeminiFlashLite,
                ProviderName = "GoogleGemini",
                ModelName = "gemini-3.1-flash-lite"
            });

        var result = await RunProcessingAsync(
            new OcrOptions
            {
                EnableTesseract = true,
                EnableFallbackOnLowConfidence = true,
                EnableFallbackOnValidationFailure = false,
                MinimumOcrConfidence = 0.75m,
                MinimumRawTextLength = 5,
                VisionOcr = new VisionOcrOptions { FallbackEnabled = true }
            },
            DocumentLanguage.BilingualCanada,
            primaryProvider,
            fallbackProvider,
            new PassThroughFieldExtractor(),
            new PassValidator());

        Assert.True(result.ExtractionJob.FallbackUsed);
        Assert.Equal(1, fallbackProvider.CallCount);
        Assert.Equal("GoogleGemini", result.ExtractionJob.FallbackProviderName);
    }

    [Fact]
    public async Task Short_Raw_Text_Allows_Gemini_Fallback_When_Enabled()
    {
        var primaryProvider = new FakeOcrProvider(
            OcrEngineType.Tesseract,
            request => new OcrResult
            {
                RawText = "tiny",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.Tesseract,
                ProviderName = "Tesseract"
            });

        var fallbackProvider = new FakeOcrProvider(
            OcrEngineType.VisionFallback,
            request => new OcrResult
            {
                RawText = "Gemini fallback OCR text",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.GeminiFlashLite,
                ProviderName = "GoogleGemini"
            });

        var result = await RunProcessingAsync(
            new OcrOptions
            {
                EnableTesseract = true,
                EnableFallbackOnLowConfidence = true,
                EnableFallbackOnValidationFailure = false,
                MinimumRawTextLength = 20,
                VisionOcr = new VisionOcrOptions { FallbackEnabled = true }
            },
            DocumentLanguage.EnglishCanada,
            primaryProvider,
            fallbackProvider,
            new PassThroughFieldExtractor(),
            new PassValidator());

        Assert.True(result.ExtractionJob.FallbackUsed);
        Assert.Equal(1, fallbackProvider.CallCount);
    }

    [Fact]
    public async Task Validation_Failure_Allows_Gemini_Fallback_When_Configured()
    {
        var primaryProvider = new FakeOcrProvider(
            OcrEngineType.Tesseract,
            request => new OcrResult
            {
                RawText = "Primary OCR result with enough text",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.Tesseract,
                ProviderName = "Tesseract"
            });

        var fallbackProvider = new FakeOcrProvider(
            OcrEngineType.VisionFallback,
            request => new OcrResult
            {
                RawText = "Fallback OCR result with enough text",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.GeminiFlashLite,
                ProviderName = "GoogleGemini"
            });

        var validator = new ConditionalProviderValidator("Tesseract");

        var result = await RunProcessingAsync(
            new OcrOptions
            {
                EnableTesseract = true,
                EnableFallbackOnLowConfidence = false,
                EnableFallbackOnValidationFailure = true,
                MinimumRawTextLength = 5,
                VisionOcr = new VisionOcrOptions { FallbackEnabled = true }
            },
            DocumentLanguage.EnglishCanada,
            primaryProvider,
            fallbackProvider,
            new PassThroughFieldExtractor(),
            validator);

        Assert.True(result.ExtractionJob.FallbackUsed);
        Assert.Equal(1, fallbackProvider.CallCount);
    }

    [Fact]
    public async Task Gemini_Is_Not_Selected_When_Fallback_Is_Disabled()
    {
        var primaryProvider = new FakeOcrProvider(
            OcrEngineType.Tesseract,
            request => new OcrResult
            {
                RawText = "Primary OCR text",
                Confidence = 0.1m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.Tesseract,
                ProviderName = "Tesseract"
            });

        var fallbackProvider = new FakeOcrProvider(
            OcrEngineType.VisionFallback,
            request => new OcrResult
            {
                RawText = "Gemini fallback OCR text",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.GeminiFlashLite,
                ProviderName = "GoogleGemini"
            });

        var result = await RunProcessingAsync(
            new OcrOptions
            {
                EnableTesseract = true,
                EnableFallbackOnLowConfidence = true,
                VisionOcr = new VisionOcrOptions { FallbackEnabled = false }
            },
            DocumentLanguage.EnglishCanada,
            primaryProvider,
            fallbackProvider,
            new PassThroughFieldExtractor(),
            new PassValidator());

        Assert.False(result.ExtractionJob.FallbackUsed);
        Assert.Equal(0, fallbackProvider.CallCount);
    }

    [Fact]
    public async Task Gemini_Provider_Returns_Configuration_Error_When_Missing_ApiKey_Or_Model()
    {
        var provider = new GeminiFlashLiteOcrProvider(Options.Create(new OcrOptions
        {
            VisionOcr = new VisionOcrOptions
            {
                FallbackEnabled = true,
                GeminiFlashLite = new GeminiFlashLiteOptions
                {
                    Enabled = true,
                    ApiKey = string.Empty,
                    Model = "CONFIGURE_ACTUAL_MODEL_ID_HERE"
                }
            }
        }));

        var request = new OcrRequest
        {
            DocumentId = Guid.NewGuid(),
            FilePath = "c:/tmp/img.png",
            ContentType = "image/png",
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada
        };

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => provider.ExtractAsync(request, CancellationToken.None));

        Assert.Contains("Missing ApiKey or Model", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Gemini_Provider_Is_Not_Selected_When_Disabled()
    {
        var provider = new GeminiFlashLiteOcrProvider(Options.Create(new OcrOptions
        {
            VisionOcr = new VisionOcrOptions
            {
                FallbackEnabled = true,
                GeminiFlashLite = new GeminiFlashLiteOptions
                {
                    Enabled = false,
                    ApiKey = "key",
                    Model = "gemini-3.1-flash-lite"
                }
            }
        }));

        var request = new OcrRequest
        {
            DocumentId = Guid.NewGuid(),
            FilePath = "c:/tmp/img.png",
            ContentType = "image/png",
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada
        };

        await Assert.ThrowsAsync<NotSupportedException>(() => provider.ExtractAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task Gemini_Provider_Returns_Controlled_Error_For_Unsupported_File_Type()
    {
        var provider = new GeminiFlashLiteOcrProvider(Options.Create(new OcrOptions
        {
            VisionOcr = new VisionOcrOptions
            {
                GeminiFlashLite = new GeminiFlashLiteOptions
                {
                    Enabled = true,
                    ApiKey = "key",
                    Model = "gemini-3.1-flash-lite"
                }
            }
        }));

        var request = new OcrRequest
        {
            DocumentId = Guid.NewGuid(),
            FilePath = "c:/tmp/file.txt",
            ContentType = "text/plain",
            RequestedDocumentLanguage = DocumentLanguage.BilingualCanada,
            DetectedLanguage = DocumentLanguage.Unknown
        };

        var exception = await Assert.ThrowsAsync<NotSupportedException>(() => provider.ExtractAsync(request, CancellationToken.None));

        Assert.Contains("supports only PDF, PNG, JPG, JPEG, and WEBP", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Gemini_Provider_Returns_Controlled_Error_When_File_Is_Missing()
    {
        var provider = new GeminiFlashLiteOcrProvider(Options.Create(new OcrOptions
        {
            VisionOcr = new VisionOcrOptions
            {
                GeminiFlashLite = new GeminiFlashLiteOptions
                {
                    Enabled = true,
                    ApiKey = "key",
                    Model = "gemini-3.1-flash-lite"
                }
            }
        }));

        var request = new OcrRequest
        {
            DocumentId = Guid.NewGuid(),
            FilePath = "c:/tmp/does-not-exist.png",
            ContentType = "image/png",
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.Unknown
        };

        await Assert.ThrowsAsync<FileNotFoundException>(() => provider.ExtractAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task Vision_Fallback_Throws_When_Gemini_Preferred_But_Disabled()
    {
        var services = new ServiceCollection();
        services.AddSingleton(Options.Create(new OcrOptions
        {
            VisionOcr = new VisionOcrOptions
            {
                FallbackEnabled = true,
                PreferredProvider = "GeminiFlashLite",
                GeminiFlashLite = new GeminiFlashLiteOptions
                {
                    Enabled = false,
                    ApiKey = "unused",
                    Model = "gemini-3.1-flash-lite"
                }
            }
        }));
        services.AddSingleton<IOcrProvider>(new FakeOcrProvider(
            OcrEngineType.GeminiFlashLite,
            request => new OcrResult
            {
                RawText = "should not be called",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.GeminiFlashLite,
                ProviderName = "GoogleGemini"
            }));

        var serviceProvider = services.BuildServiceProvider();
        var visionFallbackProvider = new VisionFallbackOcrProvider(serviceProvider, serviceProvider.GetRequiredService<IOptions<OcrOptions>>());

        var request = new OcrRequest
        {
            DocumentId = Guid.NewGuid(),
            FilePath = "c:/tmp/img.png",
            ContentType = "image/png",
            RequestedDocumentLanguage = DocumentLanguage.EnglishCanada,
            DetectedLanguage = DocumentLanguage.EnglishCanada,
            PreferredVisionProvider = "GeminiFlashLite"
        };

        var exception = await Assert.ThrowsAsync<NotSupportedException>(() => visionFallbackProvider.ExtractAsync(request, CancellationToken.None));

        Assert.Contains("disabled", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Theory]
    [InlineData(DocumentLanguage.EnglishCanada)]
    [InlineData(DocumentLanguage.FrenchCanada)]
    [InlineData(DocumentLanguage.BilingualCanada)]
    public async Task Requested_Language_Maps_Through_To_Ocr_Request(DocumentLanguage requestedLanguage)
    {
        var primaryProvider = new FakeOcrProvider(
            OcrEngineType.Tesseract,
            request => new OcrResult
            {
                RawText = "Primary OCR text",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.Tesseract,
                ProviderName = "Tesseract"
            });

        var fallbackProvider = new FakeOcrProvider(
            OcrEngineType.VisionFallback,
            request => new OcrResult
            {
                RawText = "unused",
                Confidence = 0.99m,
                RequestedDocumentLanguage = request.RequestedDocumentLanguage,
                DetectedLanguage = request.DetectedLanguage,
                PreferredVisionProvider = request.PreferredVisionProvider,
                OcrEngineType = OcrEngineType.GeminiFlashLite,
                ProviderName = "GoogleGemini"
            });

        var result = await RunProcessingAsync(
            new OcrOptions
            {
                EnableTesseract = true,
                VisionOcr = new VisionOcrOptions { FallbackEnabled = true }
            },
            requestedLanguage,
            primaryProvider,
            fallbackProvider,
            new PassThroughFieldExtractor(),
            new PassValidator());

        Assert.NotNull(primaryProvider.LastRequest);
        Assert.Equal(requestedLanguage, primaryProvider.LastRequest!.RequestedDocumentLanguage);
        Assert.Equal(requestedLanguage, result.Document.DocumentLanguage);
    }

    private static async Task<ProcessingTestResult> RunProcessingAsync(
        OcrOptions options,
        DocumentLanguage language,
        FakeOcrProvider primaryProvider,
        FakeOcrProvider fallbackProvider,
        IFinancialFieldExtractor fieldExtractor,
        IFinancialDocumentValidator validator)
    {
        var dbOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        await using var db = new AppDbContext(dbOptions);

        var document = new Document
        {
            Id = Guid.NewGuid(),
            OriginalFileName = "file.png",
            StoredFileName = "file.png",
            ContentType = "image/png",
            FileExtension = ".png",
            StoragePath = "c:/tmp/file.png",
            FileSizeBytes = 120,
            DocumentType = DocumentType.Receipt,
            DocumentLanguage = language,
            ProcessingStatus = ProcessingStatus.Uploaded,
            UploadedAtUtc = DateTime.UtcNow
        };

        db.Documents.Add(document);
        await db.SaveChangesAsync();

        var service = new DocumentProcessingService(
            db,
            new OcrRouter(Options.Create(options)),
            new IOcrProvider[] { primaryProvider, fallbackProvider },
            new LanguageDetectionService(),
            fieldExtractor,
            validator,
            new PassThroughConfidenceScoringService(),
            new StubDocumentService(),
            NullLogger<DocumentProcessingService>.Instance);

        await service.ProcessDocumentAsync(document.Id, CancellationToken.None);

        var extractionJob = await db.ExtractionJobs
            .AsNoTracking()
            .OrderByDescending(j => j.StartedAtUtc)
            .FirstAsync();

        var reloadedDocument = await db.Documents.AsNoTracking().FirstAsync(d => d.Id == document.Id);
        return new ProcessingTestResult(reloadedDocument, extractionJob);
    }

    private sealed record ProcessingTestResult(Document Document, ExtractionJob ExtractionJob);

    private sealed class FakeOcrProvider : IOcrProvider
    {
        private readonly Func<OcrRequest, OcrResult> _resultFactory;

        public FakeOcrProvider(OcrEngineType engineType, Func<OcrRequest, OcrResult> resultFactory)
        {
            EngineType = engineType;
            _resultFactory = resultFactory;
        }

        public OcrEngineType EngineType { get; }

        public int CallCount { get; private set; }

        public OcrRequest? LastRequest { get; private set; }

        public Task<OcrResult> ExtractAsync(OcrRequest request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            CallCount++;
            LastRequest = request;
            return Task.FromResult(_resultFactory(request));
        }
    }

    private sealed class PassThroughFieldExtractor : IFinancialFieldExtractor
    {
        public Task<FinancialExtractionResult> ExtractAsync(FinancialExtractionInput input, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return Task.FromResult(new FinancialExtractionResult
            {
                VendorName = "Vendor",
                DocumentDate = new DateTime(2026, 5, 31),
                Subtotal = 100m,
                Gst = 5m,
                Qst = 9.98m,
                Total = 114.98m,
                RequestedDocumentLanguage = input.RequestedDocumentLanguage,
                DetectedLanguage = input.DetectedLanguage,
                PreferredVisionProvider = input.PreferredVisionProvider,
                OcrEngineType = input.OcrEngineType,
                ProviderName = input.ProviderName,
                ModelName = input.ModelName,
                Confidence = 0.9m
            });
        }
    }

    private sealed class PassValidator : IFinancialDocumentValidator
    {
        public FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType)
        {
            return new FinancialValidationResult
            {
                IsValid = true,
                Warnings = new List<ValidationWarning>()
            };
        }
    }

    private sealed class ConditionalProviderValidator : IFinancialDocumentValidator
    {
        private readonly string _invalidProvider;

        public ConditionalProviderValidator(string invalidProvider)
        {
            _invalidProvider = invalidProvider;
        }

        public FinancialValidationResult Validate(FinancialExtractionResult result, DocumentType documentType)
        {
            if (!string.Equals(result.ProviderName, _invalidProvider, StringComparison.OrdinalIgnoreCase))
            {
                return new FinancialValidationResult
                {
                    IsValid = true,
                    Warnings = new List<ValidationWarning>()
                };
            }

            return new FinancialValidationResult
            {
                IsValid = false,
                Warnings =
                [
                    new ValidationWarning
                    {
                        Code = "ValidationFailed",
                        Severity = ValidationSeverity.Error,
                        MessageEn = "Validation failed",
                        MessageFr = "Échec de validation"
                    }
                ]
            };
        }
    }

    private sealed class PassThroughConfidenceScoringService : IConfidenceScoringService
    {
        public decimal CalculateOverallConfidence(ConfidenceScoringInput input)
        {
            if (input.StructuredExtractionConfidence.HasValue)
            {
                return input.StructuredExtractionConfidence.Value;
            }

            if (input.OcrConfidence.HasValue)
            {
                return input.OcrConfidence.Value;
            }

            return 0.75m;
        }
    }

    private sealed class StubDocumentService : IDocumentService
    {
        public Task<UploadDocumentResponseDto> UploadDocumentAsync(UploadDocumentRequestDto requestDto, CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<IReadOnlyList<DocumentListItemDto>> GetRecentDocumentsAsync(CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<DocumentDetailDto> GetDocumentAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new DocumentDetailDto
            {
                Id = id,
                OriginalFileName = "file.png",
                StoredFileName = "file.png",
                ContentType = "image/png"
            });
        }

        public Task<DocumentDetailDto> MarkDocumentAsProcessingAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new DocumentDetailDto
            {
                Id = id,
                OriginalFileName = "file.png",
                StoredFileName = "file.png",
                ContentType = "image/png",
                Status = "Processing"
            });
        }

        public Task<DocumentResultDto> GetDocumentResultAsync(Guid id, CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<DocumentFileDto> GetDocumentFileAsync(Guid id, CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<DocumentRawTextDto> GetDocumentRawTextAsync(Guid id, CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<DocumentResultDto> UpdateExtractedFieldsAsync(Guid id, UpdateExtractedFieldsRequestDto requestDto, CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<IReadOnlyList<ManualCorrectionDto>> GetCorrectionsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }
    }
}

