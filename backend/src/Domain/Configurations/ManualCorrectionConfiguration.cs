using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinancialOCR.Domain.Entities;

public class ManualCorrectionConfiguration : IEntityTypeConfiguration<ManualCorrection>
{
    public void Configure(EntityTypeBuilder<ManualCorrection> builder)
    {
        builder.ToTable("ManualCorrections");
        builder.HasKey(m => m.Id);

        builder.Property(m => m.FieldName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(m => m.OriginalValue)
            .HasMaxLength(2000);

        builder.Property(m => m.CorrectedValue)
            .HasMaxLength(2000);

        builder.Property(m => m.CorrectedBy)
            .HasMaxLength(200);

        builder.HasOne(m => m.Document)
            .WithMany(d => d.ManualCorrections)
            .HasForeignKey(m => m.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
