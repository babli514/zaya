using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OriginalFileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    StoredFileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FileExtension = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    StoragePath = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DocumentLanguage = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProcessingStatus = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UploadedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProcessedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FailureReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FileContent = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ExtractedData = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ExtractionJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestedDocumentLanguage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DetectedLanguage = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PrimaryOcrEngine = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FallbackOcrEngine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FallbackUsed = table.Column<bool>(type: "bit", nullable: false),
                    PrimaryProviderName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PrimaryModelName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PrimaryLatencyMs = table.Column<long>(type: "bigint", nullable: false),
                    FallbackProviderName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FallbackModelName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FallbackLatencyMs = table.Column<long>(type: "bigint", nullable: true),
                    EstimatedProviderCost = table.Column<decimal>(type: "decimal(18,6)", nullable: true),
                    PageCount = table.Column<int>(type: "int", nullable: true),
                    RawText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OverallConfidence = table.Column<decimal>(type: "decimal(5,4)", nullable: true),
                    WarningsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ErrorMessage = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExtractionJobs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExtractionJobs_Documents_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Documents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ManualCorrections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    OriginalValue = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CorrectedValue = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CorrectedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CorrectedBy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManualCorrections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManualCorrections_Documents_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Documents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExtractedFinancialDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExtractionJobId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VendorName = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DocumentNumber = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DocumentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Currency = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Gst = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Qst = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Hst = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Pst = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Tip = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Confidence = table.Column<decimal>(type: "decimal(5,4)", nullable: true),
                    DetectedLanguage = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsValidated = table.Column<bool>(type: "bit", nullable: false),
                    ValidationSummary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExtractedFinancialDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExtractedFinancialDocuments_Documents_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Documents",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ExtractedFinancialDocuments_ExtractionJobs_ExtractionJobId",
                        column: x => x.ExtractionJobId,
                        principalTable: "ExtractionJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProviderUsageRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExtractionJobId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProviderName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ModelName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    OperationType = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StartedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LatencyMs = table.Column<long>(type: "bigint", nullable: true),
                    Success = table.Column<bool>(type: "bit", nullable: false),
                    ErrorCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ErrorMessage = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    InputTokenCount = table.Column<int>(type: "int", nullable: true),
                    OutputTokenCount = table.Column<int>(type: "int", nullable: true),
                    InputBytes = table.Column<long>(type: "bigint", nullable: true),
                    OutputBytes = table.Column<long>(type: "bigint", nullable: true),
                    EstimatedCostUsd = table.Column<decimal>(type: "decimal(18,6)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderUsageRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProviderUsageRecords_Documents_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Documents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProviderUsageRecords_ExtractionJobs_ExtractionJobId",
                        column: x => x.ExtractionJobId,
                        principalTable: "ExtractionJobs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ExtractedLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExtractedFinancialDocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,4)", nullable: true),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,4)", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Confidence = table.Column<decimal>(type: "decimal(5,4)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExtractedLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExtractedLineItems_ExtractedFinancialDocuments_ExtractedFinancialDocumentId",
                        column: x => x.ExtractedFinancialDocumentId,
                        principalTable: "ExtractedFinancialDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Documents_DocumentLanguage",
                table: "Documents",
                column: "DocumentLanguage");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_DocumentType",
                table: "Documents",
                column: "DocumentType");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_ProcessingStatus",
                table: "Documents",
                column: "ProcessingStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_UploadedAtUtc",
                table: "Documents",
                column: "UploadedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedFinancialDocuments_DetectedLanguage",
                table: "ExtractedFinancialDocuments",
                column: "DetectedLanguage");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedFinancialDocuments_DocumentId",
                table: "ExtractedFinancialDocuments",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedFinancialDocuments_ExtractionJobId",
                table: "ExtractedFinancialDocuments",
                column: "ExtractionJobId");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractedLineItems_ExtractedFinancialDocumentId",
                table: "ExtractedLineItems",
                column: "ExtractedFinancialDocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractionJobs_DetectedLanguage",
                table: "ExtractionJobs",
                column: "DetectedLanguage");

            migrationBuilder.CreateIndex(
                name: "IX_ExtractionJobs_DocumentId",
                table: "ExtractionJobs",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ManualCorrections_DocumentId",
                table: "ManualCorrections",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ProviderUsageRecords_DocumentId",
                table: "ProviderUsageRecords",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ProviderUsageRecords_ExtractionJobId",
                table: "ProviderUsageRecords",
                column: "ExtractionJobId");

            migrationBuilder.CreateIndex(
                name: "IX_ProviderUsageRecords_ModelName",
                table: "ProviderUsageRecords",
                column: "ModelName");

            migrationBuilder.CreateIndex(
                name: "IX_ProviderUsageRecords_OperationType",
                table: "ProviderUsageRecords",
                column: "OperationType");

            migrationBuilder.CreateIndex(
                name: "IX_ProviderUsageRecords_ProviderName",
                table: "ProviderUsageRecords",
                column: "ProviderName");

            migrationBuilder.CreateIndex(
                name: "IX_ProviderUsageRecords_StartedAtUtc",
                table: "ProviderUsageRecords",
                column: "StartedAtUtc");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExtractedLineItems");

            migrationBuilder.DropTable(
                name: "ManualCorrections");

            migrationBuilder.DropTable(
                name: "ProviderUsageRecords");

            migrationBuilder.DropTable(
                name: "ExtractedFinancialDocuments");

            migrationBuilder.DropTable(
                name: "ExtractionJobs");

            migrationBuilder.DropTable(
                name: "Documents");
        }
    }
}
