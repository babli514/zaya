using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExtractionJobProviderTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FallbackModelName",
                table: "ExtractionJobs",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FallbackProviderName",
                table: "ExtractionJobs",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryModelName",
                table: "ExtractionJobs",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryProviderName",
                table: "ExtractionJobs",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FallbackModelName",
                table: "ExtractionJobs");

            migrationBuilder.DropColumn(
                name: "FallbackProviderName",
                table: "ExtractionJobs");

            migrationBuilder.DropColumn(
                name: "PrimaryModelName",
                table: "ExtractionJobs");

            migrationBuilder.DropColumn(
                name: "PrimaryProviderName",
                table: "ExtractionJobs");
        }
    }
}
