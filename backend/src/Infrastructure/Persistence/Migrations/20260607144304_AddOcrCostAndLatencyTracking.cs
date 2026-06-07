using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOcrCostAndLatencyTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedProviderCost",
                table: "ExtractionJobs",
                type: "decimal(18,6)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "FallbackLatencyMs",
                table: "ExtractionJobs",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PageCount",
                table: "ExtractionJobs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "PrimaryLatencyMs",
                table: "ExtractionJobs",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedProviderCost",
                table: "ExtractionJobs");

            migrationBuilder.DropColumn(
                name: "FallbackLatencyMs",
                table: "ExtractionJobs");

            migrationBuilder.DropColumn(
                name: "PageCount",
                table: "ExtractionJobs");

            migrationBuilder.DropColumn(
                name: "PrimaryLatencyMs",
                table: "ExtractionJobs");

        }
    }
}
