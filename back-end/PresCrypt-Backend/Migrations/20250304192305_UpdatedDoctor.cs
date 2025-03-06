using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PresCrypt_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "LastLogin",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Doctor");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Doctor",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLogin",
                table: "Doctor",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Doctor",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Doctor",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Doctor",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Doctor",
                type: "datetime2",
                nullable: true);
        }
    }
}
