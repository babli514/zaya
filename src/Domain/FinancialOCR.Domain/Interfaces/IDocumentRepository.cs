using FinancialOCR.Domain.Entities;

namespace FinancialOCR.Domain.Interfaces;

public interface IDocumentRepository
{
    Task<Document?> GetByIdAsync(Guid id);
    Task<IEnumerable<Document>> GetAllAsync();
    Task<Document> AddAsync(Document document);
    Task<Document> UpdateAsync(Document document);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<Document>> GetByStatusAsync(ProcessingStatus status);
}
