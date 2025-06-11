using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_Add_Room : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RoomId",
                table: "Channels",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Room",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MutedAudioUserIds = table.Column<Guid[]>(type: "uuid[]", nullable: false),
                    MutedVideoUserIds = table.Column<Guid[]>(type: "uuid[]", nullable: false),
                    BlockedUsers = table.Column<Guid[]>(type: "uuid[]", nullable: false),
                    ChannelId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Room", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Channels_RoomId",
                table: "Channels",
                column: "RoomId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Channels_Room_RoomId",
                table: "Channels",
                column: "RoomId",
                principalTable: "Room",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Channels_Room_RoomId",
                table: "Channels");

            migrationBuilder.DropTable(
                name: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Channels_RoomId",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Channels");
        }
    }
}
