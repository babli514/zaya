using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinancialOCR.Domain.Entities;

public class ExtractionJobConfiguration : IEntityTypeConfiguration<ExtractionJob>
{
    public void Configure(EntityTypeBuilder<ExtractionJob> builder)
    {
        builder.ToTable("ExtractionJobs");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.DocumentId).IsRequired();
        builder.HasOne(e => e.Document)
            .WithMany(d => d.ExtractionJobs)
            .HasForeignKey(e => e.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(e => e.Status)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.PrimaryOcrEngine)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.FallbackOcrEngine)
            .HasConversion<string?>();

        builder.Property(e => e.RawText)
            .HasColumnType("nvarchar(max)");

        builder.Property(e => e.PrimaryProviderName)
            .HasMaxLength(200);

        builder.Property(e => e.PrimaryModelName)
            .HasMaxLength(200);

        builder.Property(e => e.PrimaryLatencyMs)
            .IsRequired();

        builder.Property(e => e.FallbackProviderName)
            .HasMaxLength(200);

        builder.Property(e => e.FallbackModelName)
            .HasMaxLength(200);

        builder.Property(e => e.FallbackLatencyMs);

        builder.Property(e => e.EstimatedProviderCost)
            .HasColumnType("decimal(18,6)");

        builder.Property(e => e.PageCount);

        builder.Property(e => e.WarningsJson)
            .HasColumnType("nvarchar(max)");

        builder.Property(e => e.ErrorMessage)
            .HasMaxLength(2000);

        builder.Property(e => e.OverallConfidence)
            .HasColumnType("decimal(5,4)");

        builder.Property(e => e.DetectedLanguage)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.RequestedDocumentLanguage)
            .HasConversion<string>()
            .IsRequired();

        builder.HasIndex(e => e.DocumentId);
        builder.HasIndex(e => e.DetectedLanguage);
    }
}
