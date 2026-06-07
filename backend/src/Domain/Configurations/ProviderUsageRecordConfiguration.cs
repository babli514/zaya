using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinancialOCR.Domain.Entities;

public class ProviderUsageRecordConfiguration : IEntityTypeConfiguration<ProviderUsageRecord>
{
    public void Configure(EntityTypeBuilder<ProviderUsageRecord> builder)
    {
        builder.ToTable("ProviderUsageRecords");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.DocumentId).IsRequired();
        builder.HasOne(e => e.Document)
            .WithMany()
            .HasForeignKey(e => e.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(e => e.ExtractionJobId);
        builder.HasOne(e => e.ExtractionJob)
            .WithMany()
            .HasForeignKey(e => e.ExtractionJobId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(e => e.ProviderName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.ModelName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.OperationType)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.StartedAtUtc).IsRequired();
        builder.Property(e => e.CompletedAtUtc);
        builder.Property(e => e.LatencyMs);
        builder.Property(e => e.Success).IsRequired();

        builder.Property(e => e.ErrorCode)
            .HasMaxLength(100);

        builder.Property(e => e.ErrorMessage)
            .HasMaxLength(2000);

        builder.Property(e => e.InputTokenCount);
        builder.Property(e => e.OutputTokenCount);
        builder.Property(e => e.InputBytes);
        builder.Property(e => e.OutputBytes);

        builder.Property(e => e.EstimatedCostUsd)
            .HasColumnType("decimal(18,6)");

        builder.Property(e => e.CreatedAtUtc).IsRequired();

        builder.HasIndex(e => e.DocumentId);
        builder.HasIndex(e => e.ExtractionJobId);
        builder.HasIndex(e => e.ProviderName);
        builder.HasIndex(e => e.ModelName);
        builder.HasIndex(e => e.OperationType);
        builder.HasIndex(e => e.StartedAtUtc);
    }
}
