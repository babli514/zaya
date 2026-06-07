using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProviderUsageRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

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
                name: "ProviderUsageRecords");
        }
    }
}
