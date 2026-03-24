using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecretProject.Platform.Data.Migrations.ChannelDb
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "channel");

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
                name: "Users",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    AvatarUrl = table.Column<string>(type: "text", nullable: true),
                    IsMicrophoneMuted = table.Column<bool>(type: "boolean", nullable: false),
                    IsHeadphonesMuted = table.Column<bool>(type: "boolean", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
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
                    table.ForeignKey(
                        name: "FK_Channels_Users_AdminId",
                        column: x => x.AdminId,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Friendship",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    FriendId = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ApplicationUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ApplicationUserId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friendship", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Friendship_Users_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Friendship_Users_ApplicationUserId1",
                        column: x => x.ApplicationUserId1,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

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
                    RepliedMessageId = table.Column<Guid>(type: "uuid", nullable: true),
                    ApplicationUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ApplicationUserId1 = table.Column<Guid>(type: "uuid", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_Messages_Users_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Messages_Users_ApplicationUserId1",
                        column: x => x.ApplicationUserId1,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserRoom",
                schema: "channel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MutedAudioUserIds = table.Column<Guid[]>(type: "uuid[]", nullable: true),
                    MutedVideoUserIds = table.Column<Guid[]>(type: "uuid[]", nullable: true),
                    LeftUserId = table.Column<string>(type: "text", nullable: true),
                    RightUserId = table.Column<string>(type: "text", nullable: true),
                    ApplicationUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ApplicationUserId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoom", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRoom_Users_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserRoom_Users_ApplicationUserId1",
                        column: x => x.ApplicationUserId1,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
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
                    ChannelId = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicationUserId = table.Column<Guid>(type: "uuid", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_ChannelMessages_Users_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ChannelUsers",
                schema: "channel",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChannelId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false)
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
                    table.ForeignKey(
                        name: "FK_ChannelUsers_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                    MessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicationUserId = table.Column<Guid>(type: "uuid", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_Reaction_Users_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalSchema: "channel",
                        principalTable: "Users",
                        principalColumn: "Id");
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
                name: "IX_ChannelMessages_ApplicationUserId",
                schema: "channel",
                table: "ChannelMessages",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMessages_ChannelId",
                schema: "channel",
                table: "ChannelMessages",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_AdminId",
                schema: "channel",
                table: "Channels",
                column: "AdminId");

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
                name: "IX_Friendship_ApplicationUserId",
                schema: "channel",
                table: "Friendship",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Friendship_ApplicationUserId1",
                schema: "channel",
                table: "Friendship",
                column: "ApplicationUserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ApplicationUserId",
                schema: "channel",
                table: "Messages",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ApplicationUserId1",
                schema: "channel",
                table: "Messages",
                column: "ApplicationUserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_RepliedMessageId",
                schema: "channel",
                table: "Messages",
                column: "RepliedMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reaction_ApplicationUserId",
                schema: "channel",
                table: "Reaction",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Reaction_MessageId",
                schema: "channel",
                table: "Reaction",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoom_ApplicationUserId",
                schema: "channel",
                table: "UserRoom",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoom_ApplicationUserId1",
                schema: "channel",
                table: "UserRoom",
                column: "ApplicationUserId1");
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
                name: "Friendship",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "Reaction",
                schema: "channel");

            migrationBuilder.DropTable(
                name: "UserRoom",
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

            migrationBuilder.DropTable(
                name: "Users",
                schema: "channel");
        }
    }
}
