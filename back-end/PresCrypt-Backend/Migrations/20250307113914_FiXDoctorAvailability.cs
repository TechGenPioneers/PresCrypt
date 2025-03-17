using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PresCrypt_Backend.Migrations
{
    /// <inheritdoc />
    public partial class FiXDoctorAvailability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorsAvailability_Doctors_DoctorId",
                table: "DoctorsAvailability");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorsAvailability",
                table: "DoctorsAvailability");

            migrationBuilder.RenameTable(
                name: "DoctorsAvailability",
                newName: "Doctor_Availability");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.RenameIndex(
                name: "IX_Doctor_Availability_DoctorId",
                table: "DoctorsAvailability",
                newName: "IX_DoctorsAvailability_DoctorId");

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
    }
}
