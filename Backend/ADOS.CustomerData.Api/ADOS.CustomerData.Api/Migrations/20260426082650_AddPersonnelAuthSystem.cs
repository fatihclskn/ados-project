using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADOS.CustomerData.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPersonnelAuthSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Position = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ReportsTo = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    HasAdosAccess = table.Column<bool>(type: "bit", nullable: false),
                    AccessLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PanelAccess = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MfaEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AccessLevel", "BirthDate", "CreatedAt", "Department", "Email", "FullName", "HasAdosAccess", "IsActive", "LastLoginAt", "MfaEnabled", "PanelAccess", "PasswordHash", "Phone", "Position", "ReportsTo", "Role", "Salary", "StartDate", "UpdatedAt" },
                values: new object[] { 1, "Master", null, new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Yönetim", "admin@ados.local", "ADOS Master Admin", true, true, null, false, "All", "PBKDF2-SHA256:100000:QURPU01hc3RlckFkbWluMQ==:m1Pv/jJPa0WmtADLSZXjvTE4e4rRLtVKMzivVKR/qQA=", null, "Master Admin", null, "MasterAdmin", null, new DateTime(2026, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), null });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
