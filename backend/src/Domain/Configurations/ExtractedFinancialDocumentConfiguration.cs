using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinancialOCR.Domain.Entities;

public class ExtractedFinancialDocumentConfiguration : IEntityTypeConfiguration<ExtractedFinancialDocument>
{
    public void Configure(EntityTypeBuilder<ExtractedFinancialDocument> builder)
    {
        builder.ToTable("ExtractedFinancialDocuments");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.VendorName)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(e => e.CustomerName)
            .HasMaxLength(500);

        builder.Property(e => e.DocumentNumber)
            .HasMaxLength(200);

        builder.Property(e => e.Currency)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(e => e.Subtotal).HasColumnType("decimal(18,2)");
        builder.Property(e => e.Gst).HasColumnType("decimal(18,2)");
        builder.Property(e => e.Qst).HasColumnType("decimal(18,2)");
        builder.Property(e => e.Hst).HasColumnType("decimal(18,2)");
        builder.Property(e => e.Pst).HasColumnType("decimal(18,2)");
        builder.Property(e => e.Tip).HasColumnType("decimal(18,2)");
        builder.Property(e => e.Total).HasColumnType("decimal(18,2)");

        builder.Property(e => e.Confidence).HasColumnType("decimal(5,4)");

        builder.Property(e => e.ValidationSummary)
            .HasColumnType("nvarchar(max)");

        builder.Property(e => e.DetectedLanguage)
            .HasConversion<string>()
            .IsRequired();

        builder.HasOne(e => e.Document)
            .WithMany()
            .HasForeignKey(e => e.DocumentId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(e => e.ExtractionJob)
            .WithMany(j => j.ExtractedFinancialDocuments)
            .HasForeignKey(e => e.ExtractionJobId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.LineItems)
            .WithOne(li => li.ExtractedFinancialDocument)
            .HasForeignKey(li => li.ExtractedFinancialDocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.DocumentId);
        builder.HasIndex(e => e.DetectedLanguage);
    }
}
