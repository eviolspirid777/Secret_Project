using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_Reaction_Rename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reaction_AspNetUsers_UserId",
                table: "Reaction");

            migrationBuilder.DropForeignKey(
                name: "FK_Reaction_Messages_MessageId",
                table: "Reaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reaction",
                table: "Reaction");

            migrationBuilder.RenameTable(
                name: "Reaction",
                newName: "Reactions");

            migrationBuilder.RenameIndex(
                name: "IX_Reaction_UserId",
                table: "Reactions",
                newName: "IX_Reactions_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reaction_MessageId",
                table: "Reactions",
                newName: "IX_Reactions_MessageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reactions",
                table: "Reactions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reactions_AspNetUsers_UserId",
                table: "Reactions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Reactions_Messages_MessageId",
                table: "Reactions",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reactions_AspNetUsers_UserId",
                table: "Reactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Reactions_Messages_MessageId",
                table: "Reactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reactions",
                table: "Reactions");

            migrationBuilder.RenameTable(
                name: "Reactions",
                newName: "Reaction");

            migrationBuilder.RenameIndex(
                name: "IX_Reactions_UserId",
                table: "Reaction",
                newName: "IX_Reaction_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reactions_MessageId",
                table: "Reaction",
                newName: "IX_Reaction_MessageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reaction",
                table: "Reaction",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reaction_AspNetUsers_UserId",
                table: "Reaction",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Reaction_Messages_MessageId",
                table: "Reaction",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
