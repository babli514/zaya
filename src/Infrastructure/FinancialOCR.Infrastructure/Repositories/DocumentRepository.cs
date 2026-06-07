using FinancialOCR.Domain.Entities;
using FinancialOCR.Domain.Interfaces;
using FinancialOCR.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialOCR.Infrastructure.Repositories;

public class DocumentRepository : IDocumentRepository
{
    private readonly ApplicationDbContext _context;

    public DocumentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Document?> GetByIdAsync(Guid id)
    {
        return await _context.Documents.FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<IEnumerable<Document>> GetAllAsync()
    {
        return await _context.Documents.OrderByDescending(d => d.UploadedAt).ToListAsync();
    }

    public async Task<Document> AddAsync(Document document)
    {
        _context.Documents.Add(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<Document> UpdateAsync(Document document)
    {
        _context.Documents.Update(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var document = await GetByIdAsync(id);
        if (document == null)
            return false;

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Document>> GetByStatusAsync(ProcessingStatus status)
    {
        return await _context.Documents
            .Where(d => d.Status == status)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync();
    }
}
