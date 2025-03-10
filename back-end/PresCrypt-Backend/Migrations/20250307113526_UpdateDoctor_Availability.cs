using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PresCrypt_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDoctor_Availability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doctor_Availability_Doctors_DoctorId",
                table: "Doctor_Availability");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Doctor_Availability",
                table: "Doctor_Availability");

            migrationBuilder.RenameTable(
                name: "Doctor_Availability",
                newName: "DoctorsAvailability");

            migrationBuilder.RenameColumn(
                name: "AvailableDateTime",
                table: "DoctorsAvailability",
                newName: "AvailableTime");

            migrationBuilder.RenameIndex(
                name: "IX_Doctor_Availability_DoctorId",
                table: "DoctorsAvailability",
                newName: "IX_DoctorsAvailability_DoctorId");

            migrationBuilder.AddColumn<DateTime>(
                name: "AvailableDate",
                table: "DoctorsAvailability",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorsAvailability",
                table: "DoctorsAvailability",
                column: "AvailabilityId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorsAvailability_Doctors_DoctorId",
                table: "DoctorsAvailability",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "DoctorId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorsAvailability_Doctors_DoctorId",
                table: "DoctorsAvailability");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorsAvailability",
                table: "DoctorsAvailability");

            migrationBuilder.DropColumn(
                name: "AvailableDate",
                table: "DoctorsAvailability");

            migrationBuilder.RenameTable(
                name: "DoctorsAvailability",
                newName: "Doctor_Availability");

            migrationBuilder.RenameColumn(
                name: "AvailableTime",
                table: "Doctor_Availability",
                newName: "AvailableDateTime");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorsAvailability_DoctorId",
                table: "Doctor_Availability",
                newName: "IX_Doctor_Availability_DoctorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Doctor_Availability",
                table: "Doctor_Availability",
                column: "AvailabilityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Doctor_Availability_Doctors_DoctorId",
                table: "Doctor_Availability",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "DoctorId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
