using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADOS.CustomerData.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreateAiSettingsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AiSettings",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    provider_name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    api_base_url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    api_endpoint = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    api_key = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    model_name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AiSettings", x => x.id);
                });

            migrationBuilder.Sql("""
                IF NOT EXISTS (SELECT 1 FROM [AiSettings] WHERE [provider_name] = N'ArmaCMS AI' AND [is_deleted] = 0)
                BEGIN
                    INSERT INTO [AiSettings]
                        ([provider_name], [api_base_url], [api_endpoint], [api_key], [model_name], [is_active], [description], [created_at], [updated_at], [is_deleted])
                    VALUES
                        (N'ArmaCMS AI', N'https://arma' + N'cms4api.arma' + N'cms2.com', N'/api/Prompt/' + N'Generate' + N'Only', NULL, NULL, 1, N'Varsayılan ADOS AI sağlayıcısı', GETDATE(), NULL, 0);
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AiSettings");
        }
    }
}
