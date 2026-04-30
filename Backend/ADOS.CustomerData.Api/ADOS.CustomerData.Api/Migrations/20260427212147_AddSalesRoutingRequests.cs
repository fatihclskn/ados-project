using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADOS.CustomerData.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSalesRoutingRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SalesRoutingRequests",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    request_id = table.Column<int>(type: "int", nullable: false),
                    customer_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    customer_brand_name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    request_title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    request_source = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    priority = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    request_status = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    routing_status = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    sales_status = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    assigned_to = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    notes = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    routed_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    routed_by_user_id = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    routed_by_user_name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    sent_to_sales_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesRoutingRequests", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SalesRoutingRequests_request_id",
                table: "SalesRoutingRequests",
                column: "request_id",
                unique: true,
                filter: "[is_deleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SalesRoutingRequests");
        }
    }
}
