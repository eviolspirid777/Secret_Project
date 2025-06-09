using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_New_Connection_Added : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChannelMessages_ChannelFile_ChannelFileId",
                table: "ChannelMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChannelMessages_ChannelFileId",
                table: "ChannelMessages");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelFile_ChannelMessageId",
                table: "ChannelFile",
                column: "ChannelMessageId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChannelFile_ChannelMessages_ChannelMessageId",
                table: "ChannelFile",
                column: "ChannelMessageId",
                principalTable: "ChannelMessages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChannelFile_ChannelMessages_ChannelMessageId",
                table: "ChannelFile");

            migrationBuilder.DropIndex(
                name: "IX_ChannelFile_ChannelMessageId",
                table: "ChannelFile");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMessages_ChannelFileId",
                table: "ChannelMessages",
                column: "ChannelFileId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChannelMessages_ChannelFile_ChannelFileId",
                table: "ChannelMessages",
                column: "ChannelFileId",
                principalTable: "ChannelFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
