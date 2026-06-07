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

        builder.Property(e => e.WarningsJson)
            .HasColumnType("nvarchar(max)");

        builder.Property(e => e.ErrorMessage)
            .HasMaxLength(2000);

        builder.Property(e => e.OverallConfidence)
            .HasColumnType("decimal(5,4)");

        builder.Property(e => e.DetectedLanguage)
            .HasConversion<string>()
            .IsRequired();

        builder.HasIndex(e => e.DocumentId);
        builder.HasIndex(e => e.DetectedLanguage);
    }
}
