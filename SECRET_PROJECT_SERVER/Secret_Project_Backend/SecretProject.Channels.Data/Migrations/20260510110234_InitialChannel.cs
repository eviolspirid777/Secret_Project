using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecretProject.Channels.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialChannel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "channel");

            migrationBuilder.CreateTable(
                name: "Messages",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<string>(type: "text", nullable: false),
                    ReciverId = table.Column<string>(type: "text", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Content = table.Column<string>(type: "text", nullable: true),
                    FileId = table.Column<Guid>(type: "uuid", nullable: true),
                    RepliedId = table.Column<Guid>(type: "uuid", nullable: true),
                    RepliedMessageId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Messages_RepliedMessageId",
                        column: x => x.RepliedMessageId,
                        principalSchema: "channel",
                        principalTable: "Messages",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Room",
                schema: "channel",
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

            migrationBuilder.CreateTable(
                name: "Files",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: false),
                    FileType = table.Column<string>(type: "text", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    MessageId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Files_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "channel",
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reaction",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Emotion = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    MessageId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reaction_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "channel",
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Channels",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ChannelAvatarUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    AdminId = table.Column<Guid>(type: "uuid", nullable: true),
                    RoomId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Channels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Channels_Room_RoomId",
                        column: x => x.RoomId,
                        principalSchema: "channel",
                        principalTable: "Room",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ChannelMessages",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ChannelFileId = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<string>(type: "text", nullable: false),
                    ChannelId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChannelMessages_Channels_ChannelId",
                        column: x => x.ChannelId,
                        principalSchema: "channel",
                        principalTable: "Channels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChannelUsers",
                schema: "channel",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChannelId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelUsers", x => new { x.UserId, x.ChannelId });
                    table.ForeignKey(
                        name: "FK_ChannelUsers_Channels_ChannelId",
                        column: x => x.ChannelId,
                        principalSchema: "channel",
                        principalTable: "Channels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChannelFiles",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: false),
                    FileType = table.Column<string>(type: "text", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    ChannelMessageId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChannelFiles_ChannelMessages_ChannelMessageId",
                        column: x => x.ChannelMessageId,
                        principalSchema: "channel",
                        principalTable: "ChannelMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChannelFiles_ChannelMessageId",
                schema: "channel",
                table: "ChannelFiles",
                column: "ChannelMessageId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMessages_ChannelId",
                schema: "channel",
                table: "ChannelMessages",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_RoomId",
                schema: "channel",
                table: "Channels",
                column: "RoomId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChannelUsers_ChannelId",
                schema: "channel",
                table: "ChannelUsers",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_MessageId",
                schema: "channel",
                table: "Files",
                column: "MessageId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_RepliedMessageId",
                schema: "channel",
                table: "Messages",
                column: "RepliedMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reaction_MessageId",
                schema: "channel",
                table: "Reaction",
                column: "MessageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChannelFiles",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "ChannelUsers",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "Files",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "Reaction",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "ChannelMessages",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "Messages",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "Channels",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "Room",
                schema: "channel");
        }
    }
}
