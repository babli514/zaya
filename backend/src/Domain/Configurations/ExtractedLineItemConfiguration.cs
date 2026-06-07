using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinancialOCR.Domain.Entities;

public class ExtractedLineItemConfiguration : IEntityTypeConfiguration<ExtractedLineItem>
{
    public void Configure(EntityTypeBuilder<ExtractedLineItem> builder)
    {
        builder.ToTable("ExtractedLineItems");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(e => e.Quantity)
            .HasColumnType("decimal(18,4)");

        builder.Property(e => e.UnitPrice)
            .HasColumnType("decimal(18,4)");

        builder.Property(e => e.Amount)
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Confidence)
            .HasColumnType("decimal(5,4)");
    }
}
