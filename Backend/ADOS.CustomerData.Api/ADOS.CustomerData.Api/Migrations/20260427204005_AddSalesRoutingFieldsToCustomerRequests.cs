using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADOS.CustomerData.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSalesRoutingFieldsToCustomerRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_sent_to_sales",
                table: "CustomerRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "sales_status",
                table: "CustomerRequests",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "sent_to_sales_at",
                table: "CustomerRequests",
                type: "datetime2",
                nullable: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_sent_to_sales",
                table: "CustomerRequests");

            migrationBuilder.DropColumn(
                name: "sales_status",
                table: "CustomerRequests");

            migrationBuilder.DropColumn(
                name: "sent_to_sales_at",
                table: "CustomerRequests");
        }
    }
}
