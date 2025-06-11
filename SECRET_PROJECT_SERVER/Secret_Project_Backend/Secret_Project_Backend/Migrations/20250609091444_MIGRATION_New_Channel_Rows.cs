using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Secret_Project_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MIGRATION_New_Channel_Rows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "Type",
            //    table: "Channels");

            //migrationBuilder.AddColumn<string>(
            //    name: "ChannelAvatarUrl",
            //    table: "Channels",
            //    type: "text",
            //    nullable: false,
            //    defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChannelAvatarUrl",
                table: "Channels");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Channels",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
