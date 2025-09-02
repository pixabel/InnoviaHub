using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedResources : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Resource",
                columns: new[] { "ResourceId", "Capacity", "ResourceName", "ResourceType" },
                values: new object[,]
                {
                    { 1, 4, "Mötesrum", 0 },
                    { 2, 15, "Skrivbord", 1 },
                    { 3, 4, "VR Headset", 2 },
                    { 4, 1, "AI Server", 3 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Resource",
                keyColumn: "ResourceId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Resource",
                keyColumn: "ResourceId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Resource",
                keyColumn: "ResourceId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Resource",
                keyColumn: "ResourceId",
                keyValue: 4);
        }
    }
}
