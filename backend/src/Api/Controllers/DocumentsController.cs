using FinancialOCR.Api.Options;
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
    private readonly IDocumentProcessingService _documentProcessingService;
    private readonly ILogger<DocumentsController> _logger;
    private readonly DocumentUploadOptions _uploadOptions;
    private readonly IWebHostEnvironment _environment;

    public DocumentsController(
        IDocumentService documentService,
        IDocumentProcessingService documentProcessingService,
        ILogger<DocumentsController> logger,
        IOptions<DocumentUploadOptions> uploadOptions,
        IWebHostEnvironment environment)
    {
        _documentService = documentService;
        _documentProcessingService = documentProcessingService;
        _logger = logger;
        _uploadOptions = uploadOptions.Value;
        _environment = environment;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DocumentListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DocumentListItemDto>>> GetAllDocuments(CancellationToken cancellationToken)
    {
        var documents = await _documentService.GetRecentDocumentsAsync(cancellationToken);
        return Ok(documents);
    }

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

    [HttpPost("upload")]
    [ProducesResponseType(typeof(UploadDocumentResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UploadDocumentResponseDto>> UploadDocument(
        [FromForm] IFormFile? file,
        [FromForm] string? documentType,
        [FromForm] string? documentLanguage,
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

        var extension = ResolveExtension(file.FileName, file.ContentType);
        if (string.IsNullOrEmpty(extension))
        {
            return BadRequest("Unable to resolve a valid file extension for the uploaded file.");
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

        var requestDto = new UploadDocumentRequestDto
        {
            OriginalFileName = Path.GetFileName(file.FileName),
            StoredFileName = safeStoredFileName,
            StoragePath = relativeStoragePath,
            ContentType = file.ContentType,
            FileExtension = extension,
            FileSizeBytes = file.Length,
            DocumentType = mappedDocumentType,
            DocumentLanguage = mappedDocumentLanguage
        };

        var response = await _documentService.UploadDocumentAsync(requestDto, cancellationToken);
        _logger.LogInformation("Document uploaded {DocumentId}", response.DocumentId);
        return CreatedAtAction(nameof(GetDocument), new { id = response.DocumentId }, response);
    }

    [HttpPost("{id:guid}/process")]
    [ProducesResponseType(typeof(DocumentDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDetailDto>> ProcessDocument(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var processed = await _documentProcessingService.ProcessDocumentAsync(id, cancellationToken);
            return Ok(processed);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

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
