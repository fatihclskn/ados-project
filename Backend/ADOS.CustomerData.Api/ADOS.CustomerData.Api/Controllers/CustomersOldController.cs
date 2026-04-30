using ADOS.CustomerData.Api.Data;
using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/customers-old")]
[Authorize]
public class CustomersOldController : ControllerBase
{
    private const int MaxContacts = 30;
    private readonly AppDbContext _dbContext;
    private readonly EmailAddressAttribute _emailValidator = new();
    private readonly ILogger<CustomersOldController> _logger;

    public CustomersOldController(AppDbContext dbContext, ILogger<CustomersOldController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerOldDto>>> GetAll()
    {
        var customers = await _dbContext.CustomersOld
            .AsNoTracking()
            .Where(customer => customer.IsDeleted != true)
            .OrderByDescending(customer => customer.UpdatedAt ?? customer.CreatedAt)
            .ToListAsync();

        return Ok(customers.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerOldDto>> GetById(int id)
    {
        var customer = await _dbContext.CustomersOld
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == id && item.IsDeleted != true);

        if (customer is null)
        {
            return NotFound(new { message = "Eski müşteri kaydı bulunamadı." });
        }

        return Ok(ToDto(customer));
    }

    [HttpPost("{id:int}/transfer-to-customers")]
    public async Task<IActionResult> TransferToCustomers(int id, CreateCustomerRequest request)
    {
        try
        {
            var validationError = ValidateRequest(request);
            if (validationError is not null)
            {
                return BadRequest(new { message = validationError });
            }

            var oldCustomer = await _dbContext.CustomersOld
                .SingleOrDefaultAsync(customer => customer.Id == id && customer.IsDeleted != true);

            if (oldCustomer is null)
            {
                return NotFound(new { message = "Eski müşteri kaydı bulunamadı." });
            }

            var now = DateTime.UtcNow;
            var customer = await FindExistingCustomer(request);

            if (customer is null)
            {
                customer = new Customer
                {
                    Id = Guid.NewGuid(),
                    CustomerCode = await ResolveCustomerCode(request.CustomerCode),
                    CreatedAt = now,
                    IsDeleted = false,
                };
                _dbContext.Customers.Add(customer);
            }

            ApplyCustomerFields(request, customer, now);

            _dbContext.CustomersOld.Remove(oldCustomer);

            await _dbContext.SaveChangesAsync();

            return Ok(ToCustomerResponse(customer));
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "CustomersOld transfer failed for {CustomerOldId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Eski müşteri ana listeye aktarılırken hata oluştu.", detail = exception.Message });
        }
    }

    private static CustomerOldDto ToDto(CustomerOld customer)
    {
        return new CustomerOldDto
        {
            Id = customer.Id,
            CustomerCode = customer.CustomerCode,
            BrandName = customer.BrandName,
            OfficialTitle = customer.OfficialTitle,
            CustomerStatus = customer.CustomerStatus,
            DataQualityStatus = customer.DataQualityStatus,
            Source = customer.Source,
            Segment = customer.Segment,
            CompanyPhone = customer.CompanyPhone,
            CompanyEmail = customer.CompanyEmail,
            City = customer.City,
            Country = customer.Country,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt,
            IsDeleted = customer.IsDeleted == true,
        };
    }

    private async Task<Customer?> FindExistingCustomer(CustomerFieldsDto request)
    {
        var email = Clean(request.CompanyEmail);
        if (email is not null)
        {
            var customerByEmail = await _dbContext.Customers
                .FirstOrDefaultAsync(customer => customer.IsDeleted != true && customer.CompanyEmail != null && customer.CompanyEmail == email);

            if (customerByEmail is not null)
            {
                return customerByEmail;
            }
        }

        var taxNumber = Clean(request.TaxNumber);
        if (taxNumber is not null)
        {
            var customerByTaxNumber = await _dbContext.Customers
                .FirstOrDefaultAsync(customer => customer.IsDeleted != true && customer.TaxNumber != null && customer.TaxNumber == taxNumber);

            if (customerByTaxNumber is not null)
            {
                return customerByTaxNumber;
            }
        }

        var brandName = Clean(request.BrandName);
        var companyPhone = Clean(request.CompanyPhone);
        if (brandName is not null && companyPhone is not null)
        {
            return await _dbContext.Customers
                .FirstOrDefaultAsync(customer => customer.IsDeleted != true && customer.BrandName == brandName && customer.CompanyPhone == companyPhone);
        }

        return null;
    }

    private async Task<string> ResolveCustomerCode(string? requestedCode)
    {
        var cleanCode = Clean(requestedCode);
        if (cleanCode is not null)
        {
            var exists = await _dbContext.Customers.AnyAsync(customer => customer.CustomerCode == cleanCode);
            if (!exists)
            {
                return cleanCode;
            }
        }

        return await GenerateCustomerCode();
    }

    private async Task<string> GenerateCustomerCode()
    {
        var customerCodes = await _dbContext.Customers
            .AsNoTracking()
            .Select(customer => customer.CustomerCode)
            .ToListAsync();

        var lastNumber = customerCodes
            .Select(ParseCustomerCodeNumber)
            .DefaultIfEmpty(0)
            .Max();

        return $"MUS-{lastNumber + 1:000000}";
    }

    private static int ParseCustomerCodeNumber(string? customerCode)
    {
        if (string.IsNullOrWhiteSpace(customerCode))
        {
            return 0;
        }

        var normalizedCode = customerCode.Trim();
        if (normalizedCode.StartsWith("MUS-", StringComparison.OrdinalIgnoreCase))
        {
            normalizedCode = normalizedCode[4..];
        }

        return int.TryParse(normalizedCode, out var number) ? number : 0;
    }

    private void ApplyCustomerFields(CustomerFieldsDto request, Customer customer, DateTime now)
    {
        customer.BrandName = request.BrandName!.Trim();
        customer.OfficialTitle = Clean(request.OfficialTitle);
        customer.CustomerStatus = request.CustomerStatus!.Trim();
        customer.DataQualityStatus = Clean(request.DataQualityStatus) ?? "Kontrol Gerekli";
        customer.Source = request.Source!.Trim();
        customer.Segment = Clean(request.Segment);
        customer.CompanyPhone = Clean(request.CompanyPhone);
        customer.CompanyWhatsapp = Clean(request.CompanyWhatsapp);
        customer.CompanyEmail = Clean(request.CompanyEmail);
        customer.Website = Clean(request.Website);
        customer.City = Clean(request.City);
        customer.Country = Clean(request.Country);
        customer.Address = Clean(request.Address);
        customer.Services = request.Services is { Count: > 0 } ? string.Join(", ", request.Services.Where(service => !string.IsNullOrWhiteSpace(service)).Select(service => service.Trim())) : null;
        customer.MarketingSegmentNote = Clean(request.MarketingSegmentNote);
        customer.SummaryNote = Clean(request.SummaryNote);
        customer.NewsletterPermission = ParseNewsletterPermission(request.NewsletterPermission);
        customer.Notes = Clean(request.Notes);
        customer.TaxNumber = Clean(request.TaxNumber);
        customer.TaxOffice = Clean(request.TaxOffice);
        customer.Iban = Clean(request.Iban);
        customer.InvoiceEmail = Clean(request.InvoiceEmail);
        customer.InvoiceAddress = Clean(request.InvoiceAddress);
        customer.FinanceContactPerson = Clean(request.FinanceContactPerson);
        customer.LastPaymentInfo = Clean(request.LastPaymentInfo);
        customer.CollectionNote = Clean(request.CollectionNote);
        customer.FinanceNote = Clean(request.FinanceNote);
        customer.InstagramUrl = Clean(request.InstagramUrl);
        customer.LinkedinUrl = Clean(request.LinkedinUrl);
        customer.FacebookUrl = Clean(request.FacebookUrl);
        customer.MarketingSegmentDetailNote = Clean(request.MarketingSegmentDetailNote);
        customer.SalesHandoverNote = Clean(request.SalesHandoverNote);
        customer.UpdatedAt = now;
        customer.LastUpdatedAt = now;
        customer.IsDeleted = false;

        CopyContactFields(request, customer);
    }

    private string? ValidateRequest(CustomerFieldsDto request)
    {
        if (string.IsNullOrWhiteSpace(request.BrandName))
        {
            return "Marka / firma adı zorunludur.";
        }

        if (string.IsNullOrWhiteSpace(request.CustomerStatus))
        {
            return "Müşteri durumu zorunludur.";
        }

        if (string.IsNullOrWhiteSpace(request.Source))
        {
            return "Kaynak zorunludur.";
        }

        if (!IsValidEmail(request.CompanyEmail))
        {
            return "Şirket e-posta adresi geçerli değil.";
        }

        if (!IsValidEmail(request.InvoiceEmail))
        {
            return "Fatura e-posta adresi geçerli değil.";
        }

        var hasContactFullName = false;
        for (var index = 1; index <= MaxContacts; index += 1)
        {
            if (!string.IsNullOrWhiteSpace(GetStringProperty(request, $"Contact{index}FullName")))
            {
                hasContactFullName = true;
                break;
            }
        }

        if (!hasContactFullName)
        {
            return "En az bir yetkili eklemelisiniz.";
        }

        for (var index = 1; index <= MaxContacts; index += 1)
        {
            var email = GetStringProperty(request, $"Contact{index}Email");
            if (!IsValidEmail(email))
            {
                return $"{index}. yetkili e-posta adresi geçerli değil.";
            }
        }

        return null;
    }

    private bool IsValidEmail(string? email)
    {
        return string.IsNullOrWhiteSpace(email) || _emailValidator.IsValid(email.Trim());
    }

    private static string? Clean(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static bool? ParseNewsletterPermission(string? value)
    {
        var normalizedValue = Clean(value);
        if (normalizedValue is null)
        {
            return null;
        }

        if (normalizedValue.Equals("Var", StringComparison.OrdinalIgnoreCase) ||
            normalizedValue.Equals("true", StringComparison.OrdinalIgnoreCase) ||
            normalizedValue.Equals("1", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (normalizedValue.Equals("Yok", StringComparison.OrdinalIgnoreCase) ||
            normalizedValue.Equals("false", StringComparison.OrdinalIgnoreCase) ||
            normalizedValue.Equals("0", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        return null;
    }

    private static string? FormatNewsletterPermission(bool? value)
    {
        return value switch
        {
            true => "Var",
            false => "Yok",
            _ => null,
        };
    }

    private static void CopyContactFields(CustomerFieldsDto request, Customer customer)
    {
        for (var index = 1; index <= MaxContacts; index += 1)
        {
            SetStringProperty(customer, $"Contact{index}FullName", Clean(GetStringProperty(request, $"Contact{index}FullName")));
            SetStringProperty(customer, $"Contact{index}Phone", Clean(GetStringProperty(request, $"Contact{index}Phone")));
            SetStringProperty(customer, $"Contact{index}Email", Clean(GetStringProperty(request, $"Contact{index}Email")));
            SetStringProperty(customer, $"Contact{index}Title", Clean(GetStringProperty(request, $"Contact{index}Title")));
        }
    }

    private static CustomerDetailDto ToCustomerResponse(Customer customer)
    {
        var response = new CustomerDetailDto
        {
            Id = customer.Id,
            CustomerCode = customer.CustomerCode,
            BrandName = customer.BrandName,
            OfficialTitle = customer.OfficialTitle,
            CustomerStatus = customer.CustomerStatus,
            DataQualityStatus = customer.DataQualityStatus,
            Source = customer.Source,
            Segment = customer.Segment,
            CompanyPhone = customer.CompanyPhone,
            CompanyWhatsapp = customer.CompanyWhatsapp,
            CompanyEmail = customer.CompanyEmail,
            Website = customer.Website,
            City = customer.City,
            Country = customer.Country,
            Address = customer.Address,
            Services = string.IsNullOrWhiteSpace(customer.Services)
                ? []
                : customer.Services.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),
            MarketingSegmentNote = customer.MarketingSegmentNote,
            SummaryNote = customer.SummaryNote,
            NewsletterPermission = FormatNewsletterPermission(customer.NewsletterPermission),
            Notes = customer.Notes,
            TaxNumber = customer.TaxNumber,
            TaxOffice = customer.TaxOffice,
            Iban = customer.Iban,
            InvoiceEmail = customer.InvoiceEmail,
            InvoiceAddress = customer.InvoiceAddress,
            FinanceContactPerson = customer.FinanceContactPerson,
            LastPaymentInfo = customer.LastPaymentInfo,
            CollectionNote = customer.CollectionNote,
            FinanceNote = customer.FinanceNote,
            InstagramUrl = customer.InstagramUrl,
            LinkedinUrl = customer.LinkedinUrl,
            FacebookUrl = customer.FacebookUrl,
            MarketingSegmentDetailNote = customer.MarketingSegmentDetailNote,
            SalesHandoverNote = customer.SalesHandoverNote,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt,
            LastUpdatedAt = customer.LastUpdatedAt,
            LastPriceUpdateAt = customer.LastPriceUpdateAt,
            IsDeleted = customer.IsDeleted == true,
        };

        for (var index = 1; index <= MaxContacts; index += 1)
        {
            SetStringProperty(response, $"Contact{index}FullName", GetStringProperty(customer, $"Contact{index}FullName"));
            SetStringProperty(response, $"Contact{index}Phone", GetStringProperty(customer, $"Contact{index}Phone"));
            SetStringProperty(response, $"Contact{index}Email", GetStringProperty(customer, $"Contact{index}Email"));
            SetStringProperty(response, $"Contact{index}Title", GetStringProperty(customer, $"Contact{index}Title"));
        }

        return response;
    }

    private static string? GetStringProperty(object source, string propertyName)
    {
        return source.GetType().GetProperty(propertyName)?.GetValue(source) as string;
    }

    private static void SetStringProperty(object target, string propertyName, string? value)
    {
        target.GetType().GetProperty(propertyName)?.SetValue(target, value);
    }
}
