using FinancialOCR.Application.DTOs;
using FinancialOCR.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinancialOCR.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;
    private readonly ILogger<DocumentsController> _logger;

    public DocumentsController(IDocumentService documentService, ILogger<DocumentsController> logger)
    {
        _documentService = documentService;
        _logger = logger;
    }

    /// <summary>
    /// Get all documents
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DocumentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetAllDocuments()
    {
        _logger.LogInformation("Fetching all documents");
        var documents = await _documentService.GetAllDocumentsAsync();
        return Ok(documents);
    }

    /// <summary>
    /// Get a specific document by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDto>> GetDocument(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching document with ID: {DocumentId}", id);
            var document = await _documentService.GetDocumentAsync(id);
            return Ok(document);
        }
        catch (KeyNotFoundException)
        {
            _logger.LogWarning("Document not found with ID: {DocumentId}", id);
            return NotFound();
        }
    }

    /// <summary>
    /// Upload a new document
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DocumentDto>> UploadDocument([FromForm] IFormFile file, [FromForm] string documentType = "Receipt")
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("Upload attempt with no file");
            return BadRequest("No file provided");
        }

        try
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var createDto = new CreateDocumentDto
            {
                FileName = file.FileName,
                ContentType = file.ContentType ?? "application/octet-stream",
                FileContent = memoryStream.ToArray(),
                Type = documentType
            };

            _logger.LogInformation("Uploading document: {FileName}", file.FileName);
            var result = await _documentService.UploadDocumentAsync(createDto);
            return CreatedAtAction(nameof(GetDocument), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document");
            return BadRequest("Failed to upload document");
        }
    }

    /// <summary>
    /// Update document (e.g., add extracted data)
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDto>> UpdateDocument(Guid id, [FromBody] UpdateDocumentDto updateDto)
    {
        try
        {
            _logger.LogInformation("Updating document with ID: {DocumentId}", id);
            var result = await _documentService.UpdateDocumentAsync(id, updateDto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            _logger.LogWarning("Document not found for update with ID: {DocumentId}", id);
            return NotFound();
        }
    }

    /// <summary>
    /// Delete a document
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteDocument(Guid id)
    {
        var result = await _documentService.DeleteDocumentAsync(id);
        if (!result)
        {
            _logger.LogWarning("Document not found for deletion with ID: {DocumentId}", id);
            return NotFound();
        }

        _logger.LogInformation("Document deleted with ID: {DocumentId}", id);
        return NoContent();
    }

    /// <summary>
    /// Get documents by status
    /// </summary>
    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(IEnumerable<DocumentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetDocumentsByStatus(string status)
    {
        try
        {
            _logger.LogInformation("Fetching documents with status: {Status}", status);
            var documents = await _documentService.GetDocumentsByStatusAsync(status);
            return Ok(documents);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid status filter: {Status}", status);
            return BadRequest(ex.Message);
        }
    }
}
