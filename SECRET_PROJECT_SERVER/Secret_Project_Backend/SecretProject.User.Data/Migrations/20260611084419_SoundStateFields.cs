using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecretProject.User.Data.Migrations
{
    /// <inheritdoc />
    public partial class SoundStateFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsHeadphonesMuted",
                schema: "user",
                table: "UserProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsMicrophoneMuted",
                schema: "user",
                table: "UserProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsHeadphonesMuted",
                schema: "user",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "IsMicrophoneMuted",
                schema: "user",
                table: "UserProfiles");
        }
    }
}
