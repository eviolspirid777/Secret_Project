using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_Reactions_And_Replies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RepliedId",
                table: "Messages",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Reaction",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Emotion = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    MessageId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reaction_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Reaction_Messages_MessageId",
                        column: x => x.MessageId,
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_RepliedId",
                table: "Messages",
                column: "RepliedId");

            migrationBuilder.CreateIndex(
                name: "IX_Reaction_MessageId",
                table: "Reaction",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reaction_UserId",
                table: "Reaction",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Messages_RepliedId",
                table: "Messages",
                column: "RepliedId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Messages_RepliedId",
                table: "Messages");

            migrationBuilder.DropTable(
                name: "Reaction");

            migrationBuilder.DropIndex(
                name: "IX_Messages_RepliedId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "RepliedId",
                table: "Messages");
        }
    }
}
