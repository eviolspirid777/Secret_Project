using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_File_Table_Created : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "FileType",
            //    table: "Messages");

            //migrationBuilder.DropColumn(
            //    name: "FileUrl",
            //    table: "Messages");

            //migrationBuilder.AddColumn<Guid>(
            //    name: "FileId",
            //    table: "Messages",
            //    type: "uuid",
            //    nullable: true);

            //migrationBuilder.CreateTable(
            //    name: "File",
            //    columns: table => new
            //    {
            //        Id = table.Column<Guid>(type: "uuid", nullable: false),
            //        FileUrl = table.Column<string>(type: "text", nullable: false),
            //        FileType = table.Column<string>(type: "text", nullable: false),
            //        FileName = table.Column<string>(type: "text", nullable: false),
            //        MessageId = table.Column<Guid>(type: "uuid", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_File", x => x.Id);
            //        table.ForeignKey(
            //            name: "FK_File_Messages_MessageId",
            //            column: x => x.MessageId,
            //            principalTable: "Messages",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateIndex(
            //    name: "IX_File_MessageId",
            //    table: "File",
            //    column: "MessageId",
            //    unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "File");

            migrationBuilder.DropColumn(
                name: "FileId",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "FileType",
                table: "Messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "Messages",
                type: "text",
                nullable: true);
        }
    }
}
