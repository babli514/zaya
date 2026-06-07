using FinancialOCR.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinancialOCR.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Document> Documents { get; set; }
    public DbSet<ExtractionJob> ExtractionJobs { get; set; }
    public DbSet<ExtractedFinancialDocument> ExtractedFinancialDocuments { get; set; }
    public DbSet<ExtractedLineItem> ExtractedLineItems { get; set; }
    public DbSet<ManualCorrection> ManualCorrections { get; set; }
    public DbSet<ProviderUsageRecord> ProviderUsageRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(Document).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyTimestamps();
        return base.SaveChanges();
    }

    private void ApplyTimestamps()
    {
        var utcNow = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<Document>())
        {
            if (entry.State == EntityState.Added && entry.Entity.UploadedAtUtc == default)
            {
                entry.Entity.UploadedAtUtc = utcNow;
            }
        }

        foreach (var entry in ChangeTracker.Entries<ExtractedFinancialDocument>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.CreatedAtUtc == default)
                {
                    entry.Entity.CreatedAtUtc = utcNow;
                }

                entry.Entity.UpdatedAtUtc = utcNow;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Property(e => e.CreatedAtUtc).IsModified = false;
                entry.Entity.UpdatedAtUtc = utcNow;
            }
        }
    }
}
