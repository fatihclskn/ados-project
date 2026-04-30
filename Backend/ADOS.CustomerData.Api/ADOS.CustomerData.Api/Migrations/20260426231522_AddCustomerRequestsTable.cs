using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADOS.CustomerData.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerRequestsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerRequests",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    request_code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    customer_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    customer_brand_name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    request_title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    request_source = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    priority = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    status = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    department = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    assigned_to = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    description = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    services = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    contact_name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    contact_phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    contact_email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    created_by_user_id = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    created_by_user_name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerRequests", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerRequests_request_code",
                table: "CustomerRequests",
                column: "request_code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerRequests");
        }
    }
}
