using FinancialOCR.Application.DTOs;
using FinancialOCR.Domain.Entities;
using FinancialOCR.Domain.Interfaces;

namespace FinancialOCR.Application.Services;

public interface IDocumentService
{
    Task<DocumentDto> GetDocumentAsync(Guid id);
    Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync();
    Task<DocumentDto> UploadDocumentAsync(CreateDocumentDto createDto);
    Task<DocumentDto> UpdateDocumentAsync(Guid id, UpdateDocumentDto updateDto);
    Task<bool> DeleteDocumentAsync(Guid id);
    Task<IEnumerable<DocumentDto>> GetDocumentsByStatusAsync(string status);
}

public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _documentRepository;

    public DocumentService(IDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<DocumentDto> GetDocumentAsync(Guid id)
    {
        var document = await _documentRepository.GetByIdAsync(id);
        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        return MapToDto(document);
    }

    public async Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync()
    {
        var documents = await _documentRepository.GetAllAsync();
        return documents.Select(MapToDto);
    }

    public async Task<DocumentDto> UploadDocumentAsync(CreateDocumentDto createDto)
    {
        var documentType = Enum.Parse<DocumentType>(createDto.Type, ignoreCase: true);
        var document = new Document
        {
            Id = Guid.NewGuid(),
            FileName = createDto.FileName,
            ContentType = createDto.ContentType,
            FileSizeBytes = createDto.FileContent.Length,
            FileContent = createDto.FileContent,
            Type = documentType,
            Status = ProcessingStatus.Pending,
            UploadedAt = DateTime.UtcNow
        };

        var result = await _documentRepository.AddAsync(document);
        return MapToDto(result);
    }

    public async Task<DocumentDto> UpdateDocumentAsync(Guid id, UpdateDocumentDto updateDto)
    {
        var document = await _documentRepository.GetByIdAsync(id);
        if (document == null)
        {
            throw new KeyNotFoundException($"Document with ID {id} not found");
        }

        if (!string.IsNullOrEmpty(updateDto.FileName))
        {
            document.FileName = updateDto.FileName;
        }

        if (updateDto.ExtractedData != null)
        {
            document.ExtractedData = updateDto.ExtractedData;
            document.Status = ProcessingStatus.Completed;
            document.ProcessedAt = DateTime.UtcNow;
        }

        var result = await _documentRepository.UpdateAsync(document);
        return MapToDto(result);
    }

    public async Task<bool> DeleteDocumentAsync(Guid id)
    {
        return await _documentRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<DocumentDto>> GetDocumentsByStatusAsync(string status)
    {
        if (!Enum.TryParse<ProcessingStatus>(status, ignoreCase: true, out var statusEnum))
        {
            throw new ArgumentException($"Invalid status: {status}");
        }

        var documents = await _documentRepository.GetByStatusAsync(statusEnum);
        return documents.Select(MapToDto);
    }

    private static DocumentDto MapToDto(Document document)
    {
        return new DocumentDto
        {
            Id = document.Id,
            FileName = document.FileName,
            ContentType = document.ContentType,
            FileSizeBytes = document.FileSizeBytes,
            Type = document.Type.ToString(),
            Status = document.Status.ToString(),
            UploadedAt = document.UploadedAt,
            ProcessedAt = document.ProcessedAt,
            ErrorMessage = document.ErrorMessage,
            ExtractedData = document.ExtractedData
        };
    }
}
