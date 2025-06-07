using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_Add_File_Type : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<string>(
            //    name: "FileType",
            //    table: "Messages",
            //    type: "text",
            //    nullable: false,
            //    defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileType",
                table: "Messages");
        }
    }
}
