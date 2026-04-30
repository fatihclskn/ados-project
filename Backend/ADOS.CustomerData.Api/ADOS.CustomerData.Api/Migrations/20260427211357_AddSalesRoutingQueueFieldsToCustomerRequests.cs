using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADOS.CustomerData.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSalesRoutingQueueFieldsToCustomerRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_sent_to_sales_routing",
                table: "CustomerRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "sent_to_sales_routing_at",
                table: "CustomerRequests",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_sent_to_sales_routing",
                table: "CustomerRequests");

            migrationBuilder.DropColumn(
                name: "sent_to_sales_routing_at",
                table: "CustomerRequests");
        }
    }
}
