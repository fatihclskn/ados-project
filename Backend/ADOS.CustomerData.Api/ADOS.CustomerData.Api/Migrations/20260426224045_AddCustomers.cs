using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADOS.CustomerData.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF OBJECT_ID(N'[Customers]', N'U') IS NULL
                BEGIN
                    CREATE TABLE [Customers] (
                        [id] uniqueidentifier NOT NULL,
                        [customer_code] nvarchar(20) NOT NULL,
                        [brand_name] nvarchar(250) NOT NULL,
                        [official_title] nvarchar(300) NULL,
                        [customer_status] nvarchar(80) NOT NULL,
                        [data_quality_status] nvarchar(80) NULL,
                        [source] nvarchar(120) NOT NULL,
                        [segment] nvarchar(120) NULL,
                        [company_phone] nvarchar(50) NULL,
                        [company_whatsapp] nvarchar(50) NULL,
                        [company_email] nvarchar(200) NULL,
                        [website] nvarchar(300) NULL,
                        [city] nvarchar(120) NULL,
                        [country] nvarchar(120) NULL,
                        [address] nvarchar(1000) NULL,
                        [services] nvarchar(1000) NULL,
                        [marketing_segment_note] nvarchar(2000) NULL,
                        [summary_note] nvarchar(2000) NULL,
                        [newsletter_permission] bit NULL,
                        [notes] nvarchar(4000) NULL,
                        [tax_number] nvarchar(50) NULL,
                        [tax_office] nvarchar(150) NULL,
                        [iban] nvarchar(50) NULL,
                        [invoice_email] nvarchar(200) NULL,
                        [invoice_address] nvarchar(1000) NULL,
                        [finance_contact_person] nvarchar(150) NULL,
                        [last_payment_info] nvarchar(1000) NULL,
                        [collection_note] nvarchar(2000) NULL,
                        [finance_note] nvarchar(2000) NULL,
                        [instagram_url] nvarchar(300) NULL,
                        [linkedin_url] nvarchar(300) NULL,
                        [facebook_url] nvarchar(300) NULL,
                        [marketing_segment_detail_note] nvarchar(2000) NULL,
                        [sales_handover_note] nvarchar(2000) NULL,
                        [created_at] datetime2 NULL,
                        [updated_at] datetime2 NULL,
                        [last_updated_at] datetime2 NULL,
                        [is_deleted] bit NULL,
                        CONSTRAINT [PK_Customers] PRIMARY KEY ([id])
                    );
                END

                IF COL_LENGTH('Customers', 'services') IS NULL
                    ALTER TABLE [Customers] ADD [services] nvarchar(1000) NULL;

                IF COL_LENGTH('Customers', 'invoice_address') IS NULL
                    ALTER TABLE [Customers] ADD [invoice_address] nvarchar(1000) NULL;

                IF COL_LENGTH('Customers', 'finance_note') IS NULL
                    ALTER TABLE [Customers] ADD [finance_note] nvarchar(2000) NULL;

                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = N'IX_Customers_customer_code'
                      AND object_id = OBJECT_ID(N'[Customers]')
                )
                BEGIN
                    CREATE UNIQUE INDEX [IX_Customers_customer_code] ON [Customers] ([customer_code]);
                END
                """);

            for (var index = 1; index <= 30; index += 1)
            {
                migrationBuilder.Sql($"""
                    IF COL_LENGTH('Customers', 'contact{index}_full_name') IS NULL
                        ALTER TABLE [Customers] ADD [contact{index}_full_name] nvarchar(150) NULL;

                    IF COL_LENGTH('Customers', 'contact{index}_phone') IS NULL
                        ALTER TABLE [Customers] ADD [contact{index}_phone] nvarchar(50) NULL;

                    IF COL_LENGTH('Customers', 'contact{index}_email') IS NULL
                        ALTER TABLE [Customers] ADD [contact{index}_email] nvarchar(200) NULL;

                    IF COL_LENGTH('Customers', 'contact{index}_title') IS NULL
                        ALTER TABLE [Customers] ADD [contact{index}_title] nvarchar(120) NULL;
                    """);
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = N'IX_Customers_customer_code'
                      AND object_id = OBJECT_ID(N'[Customers]')
                )
                BEGIN
                    DROP INDEX [IX_Customers_customer_code] ON [Customers];
                END

                IF COL_LENGTH('Customers', 'finance_note') IS NOT NULL
                    ALTER TABLE [Customers] DROP COLUMN [finance_note];

                IF COL_LENGTH('Customers', 'invoice_address') IS NOT NULL
                    ALTER TABLE [Customers] DROP COLUMN [invoice_address];

                IF COL_LENGTH('Customers', 'services') IS NOT NULL
                    ALTER TABLE [Customers] DROP COLUMN [services];
                """);
        }
    }
}
