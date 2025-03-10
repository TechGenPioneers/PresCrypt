using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PresCrypt_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorAvailability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Doctor_Availability",
                columns: table => new
                {
                    AvailabilityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AvailableDateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctor_Availability", x => x.AvailabilityId);
                    table.ForeignKey(
                        name: "FK_Doctor_Availability_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "DoctorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Doctor_Availability_DoctorId",
                table: "Doctor_Availability",
                column: "DoctorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Doctor_Availability");
        }
    }
}
