using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_Admin_Relaity_Added : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<string>(
            //    name: "AdminId",
            //    table: "Channels",
            //    type: "text",
            //    nullable: false,
            //    defaultValue: "");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Channels_AdminId",
            //    table: "Channels",
            //    column: "AdminId");

            //migrationBuilder.AddForeignKey(
            //    name: "FK_Channels_AspNetUsers_AdminId",
            //    table: "Channels",
            //    column: "AdminId",
            //    principalTable: "AspNetUsers",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Channels_AspNetUsers_AdminId",
                table: "Channels");

            migrationBuilder.DropIndex(
                name: "IX_Channels_AdminId",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Channels");
        }
    }
}
