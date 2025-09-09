using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTimeslotsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timeslot_Resource_ResourceId",
                table: "Timeslot");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Timeslot",
                table: "Timeslot");

            migrationBuilder.RenameTable(
                name: "Timeslot",
                newName: "Timeslots");

            migrationBuilder.RenameIndex(
                name: "IX_Timeslot_ResourceId",
                table: "Timeslots",
                newName: "IX_Timeslots_ResourceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Timeslots",
                table: "Timeslots",
                column: "TimeslotId");

            migrationBuilder.AddForeignKey(
                name: "FK_Timeslots_Resource_ResourceId",
                table: "Timeslots",
                column: "ResourceId",
                principalTable: "Resource",
                principalColumn: "ResourceId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timeslots_Resource_ResourceId",
                table: "Timeslots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Timeslots",
                table: "Timeslots");

            migrationBuilder.RenameTable(
                name: "Timeslots",
                newName: "Timeslot");

            migrationBuilder.RenameIndex(
                name: "IX_Timeslots_ResourceId",
                table: "Timeslot",
                newName: "IX_Timeslot_ResourceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Timeslot",
                table: "Timeslot",
                column: "TimeslotId");

            migrationBuilder.AddForeignKey(
                name: "FK_Timeslot_Resource_ResourceId",
                table: "Timeslot",
                column: "ResourceId",
                principalTable: "Resource",
                principalColumn: "ResourceId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
