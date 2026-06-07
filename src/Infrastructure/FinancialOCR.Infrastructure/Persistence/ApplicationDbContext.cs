using FinancialOCR.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace FinancialOCR.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Document> Documents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.FileName)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.ContentType)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Type)
                .HasConversion<string>();

            entity.Property(e => e.Status)
                .HasConversion<string>();

            entity.Property(e => e.ErrorMessage)
                .HasMaxLength(1000);

            entity.Property(e => e.ExtractedData)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<Dictionary<string, object>>(v, JsonOptions) ?? new()
                );

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.UploadedAt);
        });
    }
}
