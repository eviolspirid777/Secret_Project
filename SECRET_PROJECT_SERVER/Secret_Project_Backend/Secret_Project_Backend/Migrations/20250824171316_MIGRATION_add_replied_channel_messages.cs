using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_add_replied_channel_messages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reactions_ChannelMessages_ChannelMessageId",
                table: "Reactions");

            migrationBuilder.AddColumn<Guid>(
                name: "RepliedId",
                table: "ChannelMessages",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMessages_RepliedId",
                table: "ChannelMessages",
                column: "RepliedId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChannelMessages_ChannelMessages_RepliedId",
                table: "ChannelMessages",
                column: "RepliedId",
                principalTable: "ChannelMessages",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Reactions_ChannelMessages_ChannelMessageId",
                table: "Reactions",
                column: "ChannelMessageId",
                principalTable: "ChannelMessages",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChannelMessages_ChannelMessages_RepliedId",
                table: "ChannelMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_Reactions_ChannelMessages_ChannelMessageId",
                table: "Reactions");

            migrationBuilder.DropIndex(
                name: "IX_ChannelMessages_RepliedId",
                table: "ChannelMessages");

            migrationBuilder.DropColumn(
                name: "RepliedId",
                table: "ChannelMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_Reactions_ChannelMessages_ChannelMessageId",
                table: "Reactions",
                column: "ChannelMessageId",
                principalTable: "ChannelMessages",
                principalColumn: "Id");
        }
    }
}
