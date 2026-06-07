using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace FinancialOCR.Domain.Entities;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("Documents");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.OriginalFileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(d => d.StoredFileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(d => d.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.FileExtension)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(d => d.StoragePath)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(d => d.DocumentType)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(d => d.DocumentLanguage)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(d => d.ProcessingStatus)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(d => d.FailureReason)
            .HasMaxLength(1000);

        builder.Property(d => d.FileContent)
            .HasColumnType("varbinary(max)");

        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        builder.Property(d => d.ExtractedData)
            .HasConversion(
                v => JsonSerializer.Serialize(v, jsonOptions),
                v => JsonSerializer.Deserialize<Dictionary<string, object>>(v, jsonOptions) ?? new()
            )
            .HasColumnType("nvarchar(max)");

        builder.HasIndex(d => d.UploadedAtUtc);
        builder.HasIndex(d => d.DocumentType);
        builder.HasIndex(d => d.DocumentLanguage);
        builder.HasIndex(d => d.ProcessingStatus);
    }
}
