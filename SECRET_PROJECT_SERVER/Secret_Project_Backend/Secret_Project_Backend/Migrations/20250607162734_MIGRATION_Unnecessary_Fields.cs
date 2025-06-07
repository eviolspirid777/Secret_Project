using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_Unnecessary_Fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AlterColumn<string>(
            //    name: "FileUrl",
            //    table: "Messages",
            //    type: "text",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "text");

            //migrationBuilder.AlterColumn<string>(
            //    name: "FileType",
            //    table: "Messages",
            //    type: "text",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "text");

            //migrationBuilder.AlterColumn<string>(
            //    name: "Content",
            //    table: "Messages",
            //    type: "text",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FileUrl",
                table: "Messages",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileType",
                table: "Messages",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
