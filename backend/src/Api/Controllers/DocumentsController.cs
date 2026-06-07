using FinancialOCR.Api.Options;
using FinancialOCR.Api.Services;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using FinancialOCR.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Text;
using System.Text.Json;

namespace FinancialOCR.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/webp"
    };

    private readonly IDocumentService _documentService;
    private readonly IDocumentProcessingQueue _documentProcessingQueue;
    private readonly ILogger<DocumentsController> _logger;
    private readonly DocumentUploadOptions _uploadOptions;
    private readonly IWebHostEnvironment _environment;

    public DocumentsController(
        IDocumentService documentService,
        IDocumentProcessingQueue documentProcessingQueue,
        ILogger<DocumentsController> logger,
        IOptions<DocumentUploadOptions> uploadOptions,
        IWebHostEnvironment environment)
    {
        _documentService = documentService;
        _documentProcessingQueue = documentProcessingQueue;
        _logger = logger;
        _uploadOptions = uploadOptions.Value;
        _environment = environment;
    }

    /// <summary>
    /// List recently uploaded financial documents.
    /// </summary>
    /// <remarks>
    /// Processing status values: Pending, Uploaded, Processing, Completed, Failed, NeedsReview.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DocumentListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DocumentListItemDto>>> GetAllDocuments(CancellationToken cancellationToken)
    {
        var documents = await _documentService.GetRecentDocumentsAsync(cancellationToken);
        return Ok(documents);
    }

    /// <summary>
    /// Get document metadata by document ID.
    /// </summary>
    /// <remarks>
    /// Processing status values: Pending, Uploaded, Processing, Completed, Failed, NeedsReview.
    /// </remarks>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(DocumentDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDetailDto>> GetDocument(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var document = await _documentService.GetDocumentAsync(id, cancellationToken);
            return Ok(document);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Get structured OCR extraction and validation result for a document.
    /// </summary>
    /// <remarks>
    /// Includes OCR metadata fields: primaryOcrEngineUsed, fallbackOcrEngineUsed, fallbackUsed, providerName, modelName, providerLatencyMs.
    /// Validation warnings include bilingual messages in messageEn and messageFr.
    /// Validation warning severity values: Info, Warning, Error.
    /// Supported Canadian tax labels: GST/TPS, QST/TVQ, HST/TVH, PST/TVP, Tip/Pourboire.
    /// </remarks>
    [HttpGet("{id:guid}/result")]
    [ProducesResponseType(typeof(DocumentResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentResultDto>> GetDocumentResult(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _documentService.GetDocumentResultAsync(id, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Get latest OCR raw text for a document.
    /// </summary>
    [HttpGet("{id:guid}/raw-text")]
    [ProducesResponseType(typeof(DocumentRawTextDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentRawTextDto>> GetDocumentRawText(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _documentService.GetDocumentRawTextAsync(id, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Download the original uploaded file.
    /// </summary>
    [HttpGet("{id:guid}/file")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDocumentFile(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var fileDto = await _documentService.GetDocumentFileAsync(id, cancellationToken);
            var safeDownloadName = string.IsNullOrWhiteSpace(fileDto.OriginalFileName)
                ? $"document-{id:N}"
                : Path.GetFileName(fileDto.OriginalFileName);

            if (fileDto.FileContent is { Length: > 0 })
            {
                return File(fileDto.FileContent, fileDto.ContentType, safeDownloadName, enableRangeProcessing: true);
            }

            if (string.IsNullOrWhiteSpace(fileDto.StoragePath))
            {
                return NotFound();
            }

            var configuredRoot = string.IsNullOrWhiteSpace(_uploadOptions.RootFolder) ? Path.Combine("App_Data", "uploads") : _uploadOptions.RootFolder;
            var storageRoot = Path.IsPathRooted(configuredRoot)
                ? Path.GetFullPath(configuredRoot)
                : Path.GetFullPath(Path.Combine(_environment.ContentRootPath, configuredRoot));

            var relativeStoragePath = fileDto.StoragePath.Replace('/', Path.DirectorySeparatorChar).Replace('\\', Path.DirectorySeparatorChar);
            var relativePathFromRoot = Path.GetFileName(relativeStoragePath);
            if (string.IsNullOrWhiteSpace(relativePathFromRoot) || !string.Equals(relativePathFromRoot, fileDto.StoredFileName, StringComparison.Ordinal))
            {
                return NotFound();
            }

            var physicalPath = Path.GetFullPath(Path.Combine(storageRoot, relativePathFromRoot));
            if (!physicalPath.StartsWith(storageRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(physicalPath, storageRoot, StringComparison.OrdinalIgnoreCase))
            {
                return NotFound();
            }

            if (!System.IO.File.Exists(physicalPath))
            {
                return NotFound();
            }

            return PhysicalFile(physicalPath, fileDto.ContentType, safeDownloadName, enableRangeProcessing: true);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Upload a receipt or invoice for OCR processing.
    /// </summary>
    /// <remarks>
    /// Supported file types: application/pdf, image/png, image/jpeg, image/webp.
    /// documentType values: receipt, invoice.
    /// documentLanguage values: auto, en-CA, fr-CA, bilingual-CA.
    /// </remarks>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(UploadDocumentResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UploadDocumentResponseDto>> UploadDocument(
        [FromForm] IFormFile? file,
        [FromForm] string? documentType,
        [FromForm] string? documentLanguage,
        [FromForm] bool enqueueProcessing,
        CancellationToken cancellationToken)
    {
        if (file == null)
        {
            return BadRequest("File is required.");
        }

        if (file.Length == 0)
        {
            return BadRequest("File cannot be empty.");
        }

        if (string.IsNullOrWhiteSpace(documentType))
        {
            return BadRequest("documentType is required.");
        }

        if (!TryMapDocumentType(documentType, out var mappedDocumentType))
        {
            return BadRequest("documentType must be 'receipt' or 'invoice'.");
        }

        var languageValue = string.IsNullOrWhiteSpace(documentLanguage) ? "auto" : documentLanguage;
        if (!TryMapDocumentLanguage(languageValue, out var mappedDocumentLanguage))
        {
            return BadRequest("documentLanguage must be one of: auto, en-CA, fr-CA, bilingual-CA.");
        }

        if (!AllowedContentTypes.Contains(file.ContentType))
        {
            return BadRequest("Unsupported content type. Allowed: PDF, PNG, JPG, JPEG, WEBP.");
        }

        var maxBytes = (_uploadOptions.MaxFileSizeMb <= 0 ? 10 : _uploadOptions.MaxFileSizeMb) * 1024L * 1024L;
        if (file.Length > maxBytes)
        {
            return BadRequest($"File size exceeds the maximum allowed size of {(_uploadOptions.MaxFileSizeMb <= 0 ? 10 : _uploadOptions.MaxFileSizeMb)} MB.");
        }

        UploadDocumentRequestDto requestDto;
        try
        {
            requestDto = await SaveSingleFileAndBuildUploadRequestAsync(file, mappedDocumentType, mappedDocumentLanguage, cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }

        var response = await _documentService.UploadDocumentAsync(requestDto, cancellationToken);
        _logger.LogInformation("Document uploaded {DocumentId}", response.DocumentId);

        if (!enqueueProcessing)
        {
            return CreatedAtAction(nameof(GetDocument), new { id = response.DocumentId }, response);
        }

        try
        {
            var enqueued = await _documentProcessingQueue.QueueAsync(response.DocumentId, cancellationToken);
            if (!enqueued)
            {
                _logger.LogError("Failed to enqueue uploaded document for processing. DocumentId={DocumentId}", response.DocumentId);
                return CreatedAtAction(nameof(GetDocument), new { id = response.DocumentId }, response);
            }

            await _documentService.MarkDocumentAsProcessingAsync(response.DocumentId, cancellationToken);
            response.Status = ProcessingStatus.Processing.ToString();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to enqueue uploaded document for processing. DocumentId={DocumentId}", response.DocumentId);
        }

        return CreatedAtAction(nameof(GetDocument), new { id = response.DocumentId }, response);
    }

    /// <summary>
    /// Placeholder route for future multi-file batch upload.
    /// </summary>
    /// <remarks>
    /// Planned contract (not implemented in MVP):
    /// POST /api/documents/batch-upload
    /// Request: multipart/form-data with repeated files + shared/default metadata.
    /// Response: per-file document IDs and per-file validation errors.
    /// </remarks>
    [HttpPost("batch-upload")]
    [ProducesResponseType(StatusCodes.Status501NotImplemented)]
    public IActionResult BatchUploadNotImplemented()
    {
        return StatusCode(StatusCodes.Status501NotImplemented, new { message = "Batch upload is planned but not implemented yet." });
    }

    /// <summary>
    /// Process a document using OCR routing and financial extraction.
    /// </summary>
    /// <remarks>
    /// Processing status values: Pending, Uploaded, Processing, Completed, Failed, NeedsReview.
    /// </remarks>
    [HttpPost("{id:guid}/process")]
    [ProducesResponseType(typeof(DocumentDetailDto), StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<DocumentDetailDto>> ProcessDocument(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var enqueued = await _documentProcessingQueue.QueueAsync(id, cancellationToken);
            if (!enqueued)
            {
                var current = await _documentService.GetDocumentAsync(id, cancellationToken);
                return StatusCode(StatusCodes.Status503ServiceUnavailable, current);
            }

            var processingDocument = await _documentService.MarkDocumentAsProcessingAsync(id, cancellationToken);
            return AcceptedAtAction(nameof(GetDocument), new { id }, processingDocument);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Apply manual corrections to extracted fields.
    /// </summary>
    [HttpPut("{id:guid}/extracted-fields")]
    [ProducesResponseType(typeof(DocumentResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentResultDto>> UpdateExtractedFields(Guid id, [FromBody] UpdateExtractedFieldsRequestDto requestDto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _documentService.UpdateExtractedFieldsAsync(id, requestDto, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Get manual correction history for a document.
    /// </summary>
    [HttpGet("{id:guid}/corrections")]
    [ProducesResponseType(typeof(IEnumerable<ManualCorrectionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<ManualCorrectionDto>>> GetCorrections(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var corrections = await _documentService.GetCorrectionsAsync(id, cancellationToken);
            return Ok(corrections);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Export document result as JSON.
    /// </summary>
    [HttpGet("{id:guid}/export/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportJson(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _documentService.GetDocumentResultAsync(id, cancellationToken);
            var content = JsonSerializer.Serialize(result, new JsonSerializerOptions { WriteIndented = true });
            var bytes = new UTF8Encoding(false).GetBytes(content);
            var fileName = BuildExportFileName(result.Document.OriginalFileName, id, "export", "json");
            return File(bytes, "application/json; charset=utf-8", fileName);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Export document result as CSV.
    /// </summary>
    [HttpGet("{id:guid}/export/csv")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportCsv(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _documentService.GetDocumentResultAsync(id, cancellationToken);
            var csv = BuildDocumentCsv(result);
            var bytes = BuildUtf8BomBytes(csv);
            var fileName = BuildExportFileName(result.Document.OriginalFileName, id, "export", "csv");
            return File(bytes, "text/csv; charset=utf-8", fileName);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Export extracted line items as CSV.
    /// </summary>
    [HttpGet("{id:guid}/export/line-items.csv")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportLineItemsCsv(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _documentService.GetDocumentResultAsync(id, cancellationToken);
            var csv = BuildLineItemsCsv(result);
            var bytes = BuildUtf8BomBytes(csv);
            var fileName = BuildExportFileName(result.Document.OriginalFileName, id, "line-items", "csv");
            return File(bytes, "text/csv; charset=utf-8", fileName);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    private static bool TryMapDocumentType(string value, out DocumentType documentType)
    {
        if (string.Equals(value, "receipt", StringComparison.OrdinalIgnoreCase))
        {
            documentType = DocumentType.Receipt;
            return true;
        }

        if (string.Equals(value, "invoice", StringComparison.OrdinalIgnoreCase))
        {
            documentType = DocumentType.Invoice;
            return true;
        }

        documentType = DocumentType.Unknown;
        return false;
    }

    private static bool TryMapDocumentLanguage(string value, out DocumentLanguage documentLanguage)
    {
        if (string.Equals(value, "auto", StringComparison.OrdinalIgnoreCase))
        {
            documentLanguage = DocumentLanguage.Unknown;
            return true;
        }

        if (string.Equals(value, "en-CA", StringComparison.OrdinalIgnoreCase))
        {
            documentLanguage = DocumentLanguage.EnglishCanada;
            return true;
        }

        if (string.Equals(value, "fr-CA", StringComparison.OrdinalIgnoreCase))
        {
            documentLanguage = DocumentLanguage.FrenchCanada;
            return true;
        }

        if (string.Equals(value, "bilingual-CA", StringComparison.OrdinalIgnoreCase))
        {
            documentLanguage = DocumentLanguage.BilingualCanada;
            return true;
        }

        documentLanguage = DocumentLanguage.Unknown;
        return false;
    }

    private static string BuildDocumentCsv(DocumentResultDto result)
    {
        var fields = result.StructuredExtractedFields;
        var validation = result.ValidationResult;

        var headers = new[]
        {
            "DocumentId", "DocumentType", "RequestedLanguage", "DetectedLanguage", "OriginalFileName",
            "VendorName", "CustomerName", "DocumentNumber", "DocumentDate", "DueDate", "Currency",
            "Subtotal", "GST/TPS", "QST/TVQ", "HST/TVH", "PST/TVP", "Tip/Pourboire", "Total",
            "Confidence", "IsValidated", "ValidationSummary"
        };

        var values = new[]
        {
            result.Document.Id.ToString(),
            result.Document.DocumentType,
            result.RequestedDocumentLanguage,
            result.DetectedDocumentLanguage,
            result.Document.OriginalFileName,
            fields?.VendorName ?? string.Empty,
            fields?.CustomerName ?? string.Empty,
            fields?.DocumentNumber ?? string.Empty,
            FormatDate(fields?.DocumentDate),
            FormatDate(fields?.DueDate),
            fields?.Currency ?? string.Empty,
            FormatDecimal(fields?.Subtotal),
            FormatDecimal(fields?.Gst),
            FormatDecimal(fields?.Qst),
            FormatDecimal(fields?.Hst),
            FormatDecimal(fields?.Pst),
            FormatDecimal(fields?.Tip),
            FormatDecimal(fields?.Total),
            FormatDecimal(result.Confidence),
            (validation?.IsValidated ?? false).ToString(),
            validation?.Summary ?? string.Empty
        };

        var builder = new StringBuilder();
        builder.AppendLine(BuildCsvRow(headers));
        builder.AppendLine(BuildCsvRow(values));
        return builder.ToString();
    }

    private static string BuildLineItemsCsv(DocumentResultDto result)
    {
        var headers = new[]
        {
            "DocumentId", "DocumentType", "RequestedLanguage", "DetectedLanguage", "OriginalFileName",
            "LineItemIndex", "Description", "Quantity", "UnitPrice", "Amount", "LineItemConfidence"
        };

        var builder = new StringBuilder();
        builder.AppendLine(BuildCsvRow(headers));

        for (var i = 0; i < result.LineItems.Count; i++)
        {
            var lineItem = result.LineItems[i];
            var values = new[]
            {
                result.Document.Id.ToString(),
                result.Document.DocumentType,
                result.RequestedDocumentLanguage,
                result.DetectedDocumentLanguage,
                result.Document.OriginalFileName,
                (i + 1).ToString(CultureInfo.InvariantCulture),
                lineItem.Description,
                FormatDecimal(lineItem.Quantity),
                FormatDecimal(lineItem.UnitPrice),
                FormatDecimal(lineItem.Amount),
                FormatDecimal(lineItem.Confidence)
            };

            builder.AppendLine(BuildCsvRow(values));
        }

        return builder.ToString();
    }

    private async Task<UploadDocumentRequestDto> SaveSingleFileAndBuildUploadRequestAsync(
        IFormFile file,
        DocumentType documentType,
        DocumentLanguage documentLanguage,
        CancellationToken cancellationToken)
    {
        var extension = ResolveExtension(file.FileName, file.ContentType);
        if (string.IsNullOrEmpty(extension))
        {
            throw new InvalidOperationException("Unable to resolve a valid file extension for the uploaded file.");
        }

        var safeStoredFileName = $"{Guid.NewGuid():N}{extension}";
        var configuredRoot = string.IsNullOrWhiteSpace(_uploadOptions.RootFolder) ? Path.Combine("App_Data", "uploads") : _uploadOptions.RootFolder;
        var storageRoot = Path.IsPathRooted(configuredRoot) ? configuredRoot : Path.Combine(_environment.ContentRootPath, configuredRoot);
        Directory.CreateDirectory(storageRoot);

        var physicalFilePath = Path.Combine(storageRoot, safeStoredFileName);
        await using (var stream = new FileStream(physicalFilePath, FileMode.CreateNew, FileAccess.Write, FileShare.None))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var relativeStoragePath = Path.Combine(configuredRoot, safeStoredFileName);

        return new UploadDocumentRequestDto
        {
            OriginalFileName = Path.GetFileName(file.FileName),
            StoredFileName = safeStoredFileName,
            StoragePath = relativeStoragePath,
            ContentType = file.ContentType,
            FileExtension = extension,
            FileSizeBytes = file.Length,
            DocumentType = documentType,
            DocumentLanguage = documentLanguage
        };
    }

    private static string ResolveExtension(string originalFileName, string contentType)
    {
        var extension = Path.GetExtension(originalFileName);
        if (!string.IsNullOrWhiteSpace(extension))
        {
            var normalized = extension.ToLowerInvariant();
            if (normalized is ".pdf" or ".png" or ".jpg" or ".jpeg" or ".webp")
            {
                return normalized;
            }
        }

        return contentType.ToLowerInvariant() switch
        {
            "application/pdf" => ".pdf",
            "image/png" => ".png",
            "image/jpeg" => ".jpg",
            "image/webp" => ".webp",
            _ => string.Empty
        };
    }

    private static string BuildCsvRow(IEnumerable<string> values)
    {
        return string.Join(",", values.Select(EscapeCsvValue));
    }

    private static string EscapeCsvValue(string? value)
    {
        var safeValue = value ?? string.Empty;
        var escaped = safeValue.Replace("\"", "\"\"");
        return $"\"{escaped}\"";
    }

    private static string FormatDecimal(decimal? value)
    {
        return value?.ToString("0.##", CultureInfo.InvariantCulture) ?? string.Empty;
    }

    private static string FormatDate(DateTime? value)
    {
        return value?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty;
    }

    private static byte[] BuildUtf8BomBytes(string content)
    {
        var utf8 = Encoding.UTF8;
        var bom = utf8.GetPreamble();
        var contentBytes = utf8.GetBytes(content);
        var output = new byte[bom.Length + contentBytes.Length];
        Buffer.BlockCopy(bom, 0, output, 0, bom.Length);
        Buffer.BlockCopy(contentBytes, 0, output, bom.Length, contentBytes.Length);
        return output;
    }

    private static string BuildExportFileName(string? originalFileName, Guid documentId, string suffixBase, string extension)
    {
        var baseName = Path.GetFileNameWithoutExtension(originalFileName);
        if (string.IsNullOrWhiteSpace(baseName))
        {
            baseName = $"document-{documentId:N}";
        }

        var invalidChars = Path.GetInvalidFileNameChars();
        var sanitized = new string(baseName.Select(ch => invalidChars.Contains(ch) ? '_' : ch).ToArray()).Trim();
        if (string.IsNullOrWhiteSpace(sanitized))
        {
            sanitized = $"document-{documentId:N}";
        }

        return $"{sanitized}-{suffixBase}.{extension}";
    }
}
