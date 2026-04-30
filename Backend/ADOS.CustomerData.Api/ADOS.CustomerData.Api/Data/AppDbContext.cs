using ADOS.CustomerData.Api.Entities;
using ADOS.CustomerData.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace ADOS.CustomerData.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<CustomerOld> CustomersOld => Set<CustomerOld>();
    public DbSet<CustomerRequest> CustomerRequests => Set<CustomerRequest>();
    public DbSet<SalesCustomerRequest> SalesCustomerRequests => Set<SalesCustomerRequest>();
    public DbSet<SalesRoutingRequest> SalesRoutingRequests => Set<SalesRoutingRequest>();
    public DbSet<SalesPanelRequest> SalesPanelRequests => Set<SalesPanelRequest>();
    public DbSet<AiSetting> AiSettings => Set<AiSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(user => user.Id);
            entity.HasIndex(user => user.Email).IsUnique();

            entity.Property(user => user.FullName).HasMaxLength(150).IsRequired();
            entity.Property(user => user.Email).HasMaxLength(200).IsRequired();
            entity.Property(user => user.Phone).HasMaxLength(50);
            entity.Property(user => user.Position).HasMaxLength(120).IsRequired();
            entity.Property(user => user.Department).HasMaxLength(120).IsRequired();
            entity.Property(user => user.Salary).HasPrecision(18, 2);
            entity.Property(user => user.ReportsTo).HasMaxLength(150);
            entity.Property(user => user.Role).HasMaxLength(50).IsRequired();
            entity.Property(user => user.PasswordHash).HasMaxLength(500).IsRequired();
            entity.Property(user => user.AccessLevel).HasMaxLength(50);
            entity.Property(user => user.PanelAccess).HasMaxLength(100);
            entity.Property(user => user.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasData(new User
            {
                Id = 1,
                FullName = "ADOS Master Admin",
                Email = "admin@ados.local",
                Phone = null,
                Position = "Master Admin",
                Department = "Yönetim",
                StartDate = new DateTime(2026, 4, 26),
                BirthDate = null,
                Salary = null,
                ReportsTo = null,
                Role = UserRoles.MasterAdmin,
                PasswordHash = "PBKDF2-SHA256:100000:QURPU01hc3RlckFkbWluMQ==:m1Pv/jJPa0WmtADLSZXjvTE4e4rRLtVKMzivVKR/qQA=",
                IsActive = true,
                HasAdosAccess = true,
                AccessLevel = "Master",
                PanelAccess = "All",
                MfaEnabled = false,
                LastLoginAt = null,
                CreatedAt = new DateTime(2026, 4, 26),
                UpdatedAt = null,
            });
        });

        modelBuilder.Entity<AiSetting>(entity =>
        {
            entity.ToTable("AiSettings");
            entity.HasKey(setting => setting.Id);

            entity.Property(setting => setting.Id).HasColumnName("id");
            entity.Property(setting => setting.ProviderName).HasColumnName("provider_name").HasMaxLength(150).IsRequired();
            entity.Property(setting => setting.ApiBaseUrl).HasColumnName("api_base_url").HasMaxLength(500).IsRequired();
            entity.Property(setting => setting.ApiEndpoint).HasColumnName("api_endpoint").HasMaxLength(500).IsRequired();
            entity.Property(setting => setting.ApiKey).HasColumnName("api_key").HasMaxLength(1000);
            entity.Property(setting => setting.ModelName).HasColumnName("model_name").HasMaxLength(150);
            entity.Property(setting => setting.IsActive).HasColumnName("is_active").HasDefaultValue(false);
            entity.Property(setting => setting.Description).HasColumnName("description").HasMaxLength(1000);
            entity.Property(setting => setting.CreatedAt).HasColumnName("created_at");
            entity.Property(setting => setting.UpdatedAt).HasColumnName("updated_at");
            entity.Property(setting => setting.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customers");
            entity.HasKey(customer => customer.Id);
            entity.HasIndex(customer => customer.CustomerCode).IsUnique();

            entity.Property(customer => customer.Id).HasColumnName("id");
            entity.Property(customer => customer.CustomerCode).HasColumnName("customer_code").HasMaxLength(20).IsRequired();
            entity.Property(customer => customer.BrandName).HasColumnName("brand_name").HasMaxLength(250).IsRequired();
            entity.Property(customer => customer.OfficialTitle).HasColumnName("official_title").HasMaxLength(300);
            entity.Property(customer => customer.CustomerStatus).HasColumnName("customer_status").HasMaxLength(80).IsRequired();
            entity.Property(customer => customer.DataQualityStatus).HasColumnName("data_quality_status").HasMaxLength(80);
            entity.Property(customer => customer.Source).HasColumnName("source").HasMaxLength(120).IsRequired();
            entity.Property(customer => customer.Segment).HasColumnName("segment").HasMaxLength(120);
            entity.Property(customer => customer.CompanyPhone).HasColumnName("company_phone").HasMaxLength(50);
            entity.Property(customer => customer.CompanyWhatsapp).HasColumnName("company_whatsapp").HasMaxLength(50);
            entity.Property(customer => customer.CompanyEmail).HasColumnName("company_email").HasMaxLength(200);
            entity.Property(customer => customer.Website).HasColumnName("website").HasMaxLength(300);
            entity.Property(customer => customer.City).HasColumnName("city").HasMaxLength(120);
            entity.Property(customer => customer.Country).HasColumnName("country").HasMaxLength(120);
            entity.Property(customer => customer.Address).HasColumnName("address").HasMaxLength(1000);
            entity.Property(customer => customer.Services).HasColumnName("services").HasMaxLength(1000);
            entity.Property(customer => customer.MarketingSegmentNote).HasColumnName("marketing_segment_note").HasMaxLength(2000);
            entity.Property(customer => customer.SummaryNote).HasColumnName("summary_note").HasMaxLength(2000);
            entity.Property(customer => customer.NewsletterPermission).HasColumnName("newsletter_permission");
            entity.Property(customer => customer.Notes).HasColumnName("notes").HasMaxLength(4000);
            entity.Property(customer => customer.TaxNumber).HasColumnName("tax_number").HasMaxLength(50);
            entity.Property(customer => customer.TaxOffice).HasColumnName("tax_office").HasMaxLength(150);
            entity.Property(customer => customer.Iban).HasColumnName("iban").HasMaxLength(50);
            entity.Property(customer => customer.InvoiceEmail).HasColumnName("invoice_email").HasMaxLength(200);
            entity.Property(customer => customer.InvoiceAddress).HasColumnName("invoice_address").HasMaxLength(1000);
            entity.Property(customer => customer.FinanceContactPerson).HasColumnName("finance_contact_person").HasMaxLength(150);
            entity.Property(customer => customer.LastPaymentInfo).HasColumnName("last_payment_info").HasMaxLength(1000);
            entity.Property(customer => customer.CollectionNote).HasColumnName("collection_note").HasMaxLength(2000);
            entity.Property(customer => customer.FinanceNote).HasColumnName("finance_note").HasMaxLength(2000);
            entity.Property(customer => customer.InstagramUrl).HasColumnName("instagram_url").HasMaxLength(300);
            entity.Property(customer => customer.LinkedinUrl).HasColumnName("linkedin_url").HasMaxLength(300);
            entity.Property(customer => customer.FacebookUrl).HasColumnName("facebook_url").HasMaxLength(300);
            entity.Property(customer => customer.MarketingSegmentDetailNote).HasColumnName("marketing_segment_detail_note").HasMaxLength(2000);
            entity.Property(customer => customer.SalesHandoverNote).HasColumnName("sales_handover_note").HasMaxLength(2000);

            for (var index = 1; index <= 30; index += 1)
            {
                entity.Property<string?>($"Contact{index}FullName").HasColumnName($"contact{index}_full_name").HasMaxLength(150);
                entity.Property<string?>($"Contact{index}Phone").HasColumnName($"contact{index}_phone").HasMaxLength(50);
                entity.Property<string?>($"Contact{index}Email").HasColumnName($"contact{index}_email").HasMaxLength(200);
                entity.Property<string?>($"Contact{index}Title").HasColumnName($"contact{index}_title").HasMaxLength(120);
            }

            entity.Property(customer => customer.CreatedAt).HasColumnName("created_at");
            entity.Property(customer => customer.UpdatedAt).HasColumnName("updated_at");
            entity.Property(customer => customer.LastUpdatedAt).HasColumnName("last_updated_at");
            entity.Property(customer => customer.LastPriceUpdateAt).HasColumnName("last_price_update_at");
            entity.Property(customer => customer.IsDeleted).HasColumnName("is_deleted");
        });

        modelBuilder.Entity<CustomerOld>(entity =>
        {
            entity.ToTable("CustomersOld");
            entity.HasKey(customer => customer.Id);

            entity.Property(customer => customer.Id).HasColumnName("id");
            entity.Property(customer => customer.CustomerCode).HasColumnName("customer_code").HasMaxLength(20);
            entity.Property(customer => customer.BrandName).HasColumnName("brand_name").HasMaxLength(250);
            entity.Property(customer => customer.OfficialTitle).HasColumnName("official_title").HasMaxLength(300);
            entity.Property(customer => customer.CustomerStatus).HasColumnName("customer_status").HasMaxLength(80);
            entity.Property(customer => customer.DataQualityStatus).HasColumnName("data_quality_status").HasMaxLength(80);
            entity.Property(customer => customer.Source).HasColumnName("source").HasMaxLength(120);
            entity.Property(customer => customer.Segment).HasColumnName("segment").HasMaxLength(120);
            entity.Property(customer => customer.CompanyPhone).HasColumnName("company_phone").HasMaxLength(50);
            entity.Property(customer => customer.CompanyEmail).HasColumnName("company_email").HasMaxLength(200);
            entity.Property(customer => customer.City).HasColumnName("city").HasMaxLength(120);
            entity.Property(customer => customer.Country).HasColumnName("country").HasMaxLength(120);
            entity.Property(customer => customer.CreatedAt).HasColumnName("created_at");
            entity.Property(customer => customer.UpdatedAt).HasColumnName("updated_at");
            entity.Property(customer => customer.IsDeleted).HasColumnName("is_deleted");
        });

        modelBuilder.Entity<CustomerRequest>(entity =>
        {
            entity.ToTable("CustomerRequests");
            entity.HasKey(request => request.Id);
            entity.HasIndex(request => request.RequestCode).IsUnique();

            entity.Property(request => request.Id).HasColumnName("id");
            entity.Property(request => request.RequestCode).HasColumnName("request_code").HasMaxLength(20).IsRequired();
            entity.Property(request => request.CustomerId).HasColumnName("customer_id");
            entity.Property(request => request.CustomerBrandName).HasColumnName("customer_brand_name").HasMaxLength(250);
            entity.Property(request => request.RequestTitle).HasColumnName("request_title").HasMaxLength(250).IsRequired();
            entity.Property(request => request.RequestSource).HasColumnName("request_source").HasMaxLength(120).IsRequired();
            entity.Property(request => request.Priority).HasColumnName("priority").HasMaxLength(50).IsRequired();
            entity.Property(request => request.Status).HasColumnName("status").HasMaxLength(80).IsRequired();
            entity.Property(request => request.Department).HasColumnName("department").HasMaxLength(120);
            entity.Property(request => request.AssignedTo).HasColumnName("assigned_to").HasMaxLength(150);
            entity.Property(request => request.Description).HasColumnName("description").HasMaxLength(4000);
            entity.Property(request => request.Services).HasColumnName("services").HasMaxLength(1000);
            entity.Property(request => request.ContactName).HasColumnName("contact_name").HasMaxLength(150);
            entity.Property(request => request.ContactPhone).HasColumnName("contact_phone").HasMaxLength(50);
            entity.Property(request => request.ContactEmail).HasColumnName("contact_email").HasMaxLength(200);
            entity.Property(request => request.CreatedByUserId).HasColumnName("created_by_user_id").HasMaxLength(80);
            entity.Property(request => request.CreatedByUserName).HasColumnName("created_by_user_name").HasMaxLength(150);
            entity.Property(request => request.CreatedAt).HasColumnName("created_at");
            entity.Property(request => request.UpdatedAt).HasColumnName("updated_at");
            entity.Property(request => request.IsDeleted).HasColumnName("is_deleted");
            entity.Property(request => request.IsSentToSalesRouting).HasColumnName("is_sent_to_sales_routing").HasDefaultValue(false);
            entity.Property(request => request.SentToSalesRoutingAt).HasColumnName("sent_to_sales_routing_at");
            entity.Property(request => request.IsSentToSales).HasColumnName("is_sent_to_sales").HasDefaultValue(false);
            entity.Property(request => request.SentToSalesAt).HasColumnName("sent_to_sales_at");
            entity.Property(request => request.SalesStatus).HasColumnName("sales_status").HasMaxLength(80);
        });

        modelBuilder.Entity<SalesRoutingRequest>(entity =>
        {
            entity.ToTable("SalesRoutingRequests");
            entity.HasKey(request => request.Id);
            entity.HasIndex(request => request.RequestId).HasFilter("[is_deleted] = 0").IsUnique();

            entity.Property(request => request.Id).HasColumnName("id");
            entity.Property(request => request.RequestId).HasColumnName("request_id").IsRequired();
            entity.Property(request => request.CustomerId).HasColumnName("customer_id");
            entity.Property(request => request.CustomerBrandName).HasColumnName("customer_brand_name").HasMaxLength(250);
            entity.Property(request => request.RequestTitle).HasColumnName("request_title").HasMaxLength(250).IsRequired();
            entity.Property(request => request.RequestSource).HasColumnName("request_source").HasMaxLength(120);
            entity.Property(request => request.Priority).HasColumnName("priority").HasMaxLength(50).IsRequired();
            entity.Property(request => request.RequestStatus).HasColumnName("request_status").HasMaxLength(80);
            entity.Property(request => request.RoutingStatus).HasColumnName("routing_status").HasMaxLength(80).IsRequired();
            entity.Property(request => request.SalesStatus).HasColumnName("sales_status").HasMaxLength(80);
            entity.Property(request => request.AssignedTo).HasColumnName("assigned_to").HasMaxLength(150);
            entity.Property(request => request.Notes).HasColumnName("notes").HasMaxLength(4000);
            entity.Property(request => request.RoutedAt).HasColumnName("routed_at");
            entity.Property(request => request.RoutedByUserId).HasColumnName("routed_by_user_id").HasMaxLength(80);
            entity.Property(request => request.RoutedByUserName).HasColumnName("routed_by_user_name").HasMaxLength(150);
            entity.Property(request => request.SentToSalesAt).HasColumnName("sent_to_sales_at");
            entity.Property(request => request.CreatedAt).HasColumnName("created_at");
            entity.Property(request => request.UpdatedAt).HasColumnName("updated_at");
            entity.Property(request => request.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        });

        modelBuilder.Entity<SalesPanelRequest>(entity =>
        {
            entity.ToTable("SalesPanelRequests");
            entity.HasKey(request => request.Id);
            entity.HasIndex(request => request.SalesRoutingRequestId).HasFilter("[is_deleted] = 0").IsUnique();

            entity.Property(request => request.Id).HasColumnName("id");
            entity.Property(request => request.SalesRoutingRequestId).HasColumnName("sales_routing_request_id").IsRequired();
            entity.Property(request => request.SourceMarketingRequestId).HasColumnName("source_marketing_request_id").IsRequired();
            entity.Property(request => request.RequestCode).HasColumnName("request_code").HasMaxLength(20);
            entity.Property(request => request.CustomerId).HasColumnName("customer_id");
            entity.Property(request => request.CustomerBrandName).HasColumnName("customer_brand_name").HasMaxLength(250);
            entity.Property(request => request.RequestTitle).HasColumnName("request_title").HasMaxLength(250).IsRequired();
            entity.Property(request => request.RequestSource).HasColumnName("request_source").HasMaxLength(120);
            entity.Property(request => request.Priority).HasColumnName("priority").HasMaxLength(50).IsRequired();
            entity.Property(request => request.RequestStatus).HasColumnName("request_status").HasMaxLength(80);
            entity.Property(request => request.SalesStatus).HasColumnName("sales_status").HasMaxLength(80).IsRequired();
            entity.Property(request => request.Department).HasColumnName("department").HasMaxLength(120);
            entity.Property(request => request.AssignedTo).HasColumnName("assigned_to").HasMaxLength(150);
            entity.Property(request => request.Description).HasColumnName("description").HasMaxLength(4000);
            entity.Property(request => request.Services).HasColumnName("services").HasMaxLength(1000);
            entity.Property(request => request.ContactName).HasColumnName("contact_name").HasMaxLength(150);
            entity.Property(request => request.ContactPhone).HasColumnName("contact_phone").HasMaxLength(50);
            entity.Property(request => request.ContactEmail).HasColumnName("contact_email").HasMaxLength(200);
            entity.Property(request => request.Notes).HasColumnName("notes").HasMaxLength(4000);
            entity.Property(request => request.ExpectedOfferDate).HasColumnName("expected_offer_date");
            entity.Property(request => request.TransferredAt).HasColumnName("transferred_at");
            entity.Property(request => request.TransferredByUserId).HasColumnName("transferred_by_user_id").HasMaxLength(80);
            entity.Property(request => request.TransferredByUserName).HasColumnName("transferred_by_user_name").HasMaxLength(150);
            entity.Property(request => request.CreatedAt).HasColumnName("created_at");
            entity.Property(request => request.UpdatedAt).HasColumnName("updated_at");
            entity.Property(request => request.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        });

        modelBuilder.Entity<SalesCustomerRequest>(entity =>
        {
            entity.ToTable("SalesCustomerRequests");
            entity.HasKey(request => request.Id);
            entity.HasIndex(request => request.SourceMarketingRequestId).HasFilter("[is_deleted] = 0").IsUnique();

            entity.Property(request => request.Id).HasColumnName("id");
            entity.Property(request => request.SourceMarketingRequestId).HasColumnName("source_marketing_request_id").IsRequired();
            entity.Property(request => request.RequestCode).HasColumnName("request_code").HasMaxLength(20).IsRequired();
            entity.Property(request => request.CustomerId).HasColumnName("customer_id");
            entity.Property(request => request.CustomerBrandName).HasColumnName("customer_brand_name").HasMaxLength(250);
            entity.Property(request => request.RequestTitle).HasColumnName("request_title").HasMaxLength(250).IsRequired();
            entity.Property(request => request.RequestSource).HasColumnName("request_source").HasMaxLength(120).IsRequired();
            entity.Property(request => request.Priority).HasColumnName("priority").HasMaxLength(50).IsRequired();
            entity.Property(request => request.Status).HasColumnName("status").HasMaxLength(80).IsRequired();
            entity.Property(request => request.Department).HasColumnName("department").HasMaxLength(120);
            entity.Property(request => request.AssignedTo).HasColumnName("assigned_to").HasMaxLength(150);
            entity.Property(request => request.Description).HasColumnName("description").HasMaxLength(4000);
            entity.Property(request => request.Services).HasColumnName("services").HasMaxLength(1000);
            entity.Property(request => request.ContactName).HasColumnName("contact_name").HasMaxLength(150);
            entity.Property(request => request.ContactPhone).HasColumnName("contact_phone").HasMaxLength(50);
            entity.Property(request => request.ContactEmail).HasColumnName("contact_email").HasMaxLength(200);
            entity.Property(request => request.CreatedByUserId).HasColumnName("created_by_user_id").HasMaxLength(80);
            entity.Property(request => request.CreatedByUserName).HasColumnName("created_by_user_name").HasMaxLength(150);
            entity.Property(request => request.TransferredAt).HasColumnName("transferred_at");
            entity.Property(request => request.TransferredByUserId).HasColumnName("transferred_by_user_id").HasMaxLength(80);
            entity.Property(request => request.TransferredByUserName).HasColumnName("transferred_by_user_name").HasMaxLength(150);
            entity.Property(request => request.IsTransferredFromMarketing).HasColumnName("is_transferred_from_marketing").HasDefaultValue(true);
            entity.Property(request => request.CreatedAt).HasColumnName("created_at");
            entity.Property(request => request.UpdatedAt).HasColumnName("updated_at");
            entity.Property(request => request.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
            entity.Property(request => request.IsSentToSalesRouting).HasColumnName("is_sent_to_sales_routing").HasDefaultValue(false);
            entity.Property(request => request.SentToSalesRoutingAt).HasColumnName("sent_to_sales_routing_at");
            entity.Property(request => request.IsSentToSales).HasColumnName("is_sent_to_sales").HasDefaultValue(false);
            entity.Property(request => request.SentToSalesAt).HasColumnName("sent_to_sales_at");
            entity.Property(request => request.SalesStatus).HasColumnName("sales_status").HasMaxLength(80);
        });
    }
}
