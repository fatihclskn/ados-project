using ADOS.CustomerData.Api.Data;
using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/requests")]
[Authorize]
public class CustomerRequestsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CustomerRequestsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerRequestDto>>> GetAll()
    {
        var requests = await _dbContext.CustomerRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted)
            .OrderByDescending(request => request.Id)
            .ToListAsync();

        return Ok(requests.Select(request => ToResponse(request)).ToList());
    }

    [HttpGet("sales")]
    public async Task<ActionResult<IEnumerable<CustomerRequestDto>>> GetSalesRequests()
    {
        var requests = await _dbContext.CustomerRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted && request.IsSentToSales)
            .OrderByDescending(request => request.SentToSalesAt ?? request.UpdatedAt ?? request.CreatedAt)
            .ToListAsync();

        return Ok(requests.Select(request => ToResponse(request)).ToList());
    }

    [HttpGet("ready-for-sales")]
    public async Task<ActionResult<IEnumerable<CustomerRequestDto>>> GetReadyForSalesRequests()
    {
        var requests = await _dbContext.CustomerRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted && request.Status == "Satışa Hazır")
            .OrderByDescending(request => request.UpdatedAt ?? request.CreatedAt)
            .ToListAsync();

        return Ok(requests.Select(request => ToResponse(request)).ToList());
    }

    [HttpGet("sales-routing")]
    public async Task<ActionResult<IEnumerable<CustomerRequestDto>>> GetSalesRoutingRequests()
    {
        var requests = await _dbContext.CustomerRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted && request.IsSentToSalesRouting)
            .OrderByDescending(request => request.SentToSalesRoutingAt ?? request.UpdatedAt ?? request.CreatedAt)
            .ToListAsync();

        return Ok(requests.Select(request => ToResponse(request)).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerRequestDto>> GetById(int id)
    {
        var request = await _dbContext.CustomerRequests
            .AsNoTracking()
            .SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);

        if (request is null)
        {
            return NotFound();
        }

        Customer? customer = null;
        if (request.CustomerId.HasValue)
        {
            customer = await _dbContext.Customers
                .AsNoTracking()
                .SingleOrDefaultAsync(currentCustomer => currentCustomer.Id == request.CustomerId.Value && currentCustomer.IsDeleted != true);
        }

        return Ok(ToResponse(request, customer));
    }

    [HttpPost]
    public async Task<ActionResult<CustomerRequestDto>> Create(CreateCustomerRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.RequestTitle))
        {
            return BadRequest(new { message = "Talep başlığı zorunludur." });
        }

        if (string.IsNullOrWhiteSpace(request.RequestSource))
        {
            return BadRequest(new { message = "Talep kaynağı zorunludur." });
        }

        var status = Clean(request.Status) ?? "Yeni";
        if (IsRemovedStatus(status))
        {
            return BadRequest(new { message = "Veri Eksik durumu artık kullanılamaz." });
        }
        if (IsManualTransferStatus(status))
        {
            return BadRequest(new { message = "Aktarıldı durumu sadece satışa aktarım işlemiyle verilebilir." });
        }

        var entity = new CustomerRequest
        {
            RequestCode = await GenerateRequestCode(),
            CustomerId = request.CustomerId,
            CustomerBrandName = Clean(request.CustomerBrandName),
            RequestTitle = request.RequestTitle.Trim(),
            RequestSource = request.RequestSource.Trim(),
            Priority = Clean(request.Priority) ?? "Orta",
            Status = status,
            Department = Clean(request.Department),
            AssignedTo = Clean(request.AssignedTo),
            Description = Clean(request.Description),
            Services = SerializeServices(request.Services),
            ContactName = Clean(request.ContactName),
            ContactPhone = Clean(request.ContactPhone),
            ContactEmail = Clean(request.ContactEmail),
            CreatedByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("UserId"),
            CreatedByUserName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("FullName"),
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
        };

        _dbContext.CustomerRequests.Add(entity);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, ToResponse(entity));
    }

    [HttpPost("{id:int}/send-to-sales-routing")]
    public async Task<ActionResult<CustomerRequestDto>> SendToSalesRouting(int id)
    {
        var entity = await _dbContext.CustomerRequests.SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);
        if (entity is null)
        {
            return NotFound();
        }

        if (!entity.IsSentToSalesRouting && !IsReadyForSalesStatus(entity.Status))
        {
            return BadRequest(new { message = "Talep satışa yönlendirilmeden önce Satışa Hazır yapılmalıdır." });
        }

        entity.IsSentToSalesRouting = true;
        entity.SentToSalesRoutingAt = DateTime.Now;
        entity.SalesStatus = "Bekliyor";
        entity.Status = "Aktarıldı";
        entity.UpdatedAt = DateTime.Now;

        await _dbContext.SaveChangesAsync();

        Customer? customer = null;
        if (entity.CustomerId.HasValue)
        {
            customer = await _dbContext.Customers
                .AsNoTracking()
                .SingleOrDefaultAsync(currentCustomer => currentCustomer.Id == entity.CustomerId.Value && currentCustomer.IsDeleted != true);
        }

        return Ok(ToResponse(entity, customer));
    }

    [HttpPost("{id:int}/send-to-sales")]
    public async Task<ActionResult<CustomerRequestDto>> SendToSales(int id)
    {
        var entity = await _dbContext.CustomerRequests.SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);
        if (entity is null)
        {
            return NotFound();
        }

        if (!entity.IsSentToSales && !entity.IsSentToSalesRouting && !IsReadyForSalesStatus(entity.Status))
        {
            return BadRequest(new { message = "Talep satışa yönlendirilmeden önce Satışa Hazır yapılmalıdır." });
        }

        entity.IsSentToSalesRouting = true;
        entity.SentToSalesRoutingAt ??= DateTime.Now;
        entity.IsSentToSales = true;
        entity.SentToSalesAt = DateTime.Now;
        entity.SalesStatus = "Satışta";
        entity.Status = "Aktarıldı";
        entity.UpdatedAt = DateTime.Now;

        await _dbContext.SaveChangesAsync();

        Customer? customer = null;
        if (entity.CustomerId.HasValue)
        {
            customer = await _dbContext.Customers
                .AsNoTracking()
                .SingleOrDefaultAsync(currentCustomer => currentCustomer.Id == entity.CustomerId.Value && currentCustomer.IsDeleted != true);
        }

        return Ok(ToResponse(entity, customer));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CustomerRequestDto>> Update(int id, UpdateCustomerRequestDto request)
    {
        var entity = await _dbContext.CustomerRequests.SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);
        if (entity is null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(request.RequestTitle))
        {
            return BadRequest(new { message = "Talep başlığı zorunludur." });
        }

        if (string.IsNullOrWhiteSpace(request.RequestSource))
        {
            return BadRequest(new { message = "Talep kaynağı zorunludur." });
        }

        var status = Clean(request.Status) ?? "Yeni";
        if (IsRemovedStatus(status))
        {
            return BadRequest(new { message = "Veri Eksik durumu artık kullanılamaz." });
        }
        if (IsManualTransferStatus(status) && !IsManualTransferStatus(entity.Status))
        {
            return BadRequest(new { message = "Aktarıldı durumu sadece satışa aktarım işlemiyle verilebilir." });
        }
        if ((entity.IsSentToSales || IsManualTransferStatus(entity.Status)) && !string.Equals(entity.Status, status, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Bu talep satışa aktarıldığı için durum değiştirilemez." });
        }

        entity.CustomerId = request.CustomerId;
        entity.CustomerBrandName = Clean(request.CustomerBrandName);
        entity.RequestTitle = request.RequestTitle.Trim();
        entity.RequestSource = request.RequestSource.Trim();
        entity.Priority = Clean(request.Priority) ?? "Orta";
        entity.Status = status;
        entity.Department = Clean(request.Department);
        entity.AssignedTo = Clean(request.AssignedTo);
        entity.Description = Clean(request.Description);
        entity.Services = SerializeServices(request.Services);
        entity.ContactName = Clean(request.ContactName);
        entity.ContactPhone = Clean(request.ContactPhone);
        entity.ContactEmail = Clean(request.ContactEmail);
        entity.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(ToResponse(entity));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _dbContext.CustomerRequests.SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);
        if (entity is null)
        {
            return NotFound();
        }

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    private async Task<string> GenerateRequestCode()
    {
        var codes = await _dbContext.CustomerRequests
            .AsNoTracking()
            .Select(request => request.RequestCode)
            .ToListAsync();

        var lastNumber = codes.Select(ParseRequestCodeNumber).DefaultIfEmpty(0).Max();
        return $"TLP-{lastNumber + 1:000000}";
    }

    private static int ParseRequestCodeNumber(string? requestCode)
    {
        if (string.IsNullOrWhiteSpace(requestCode))
        {
            return 0;
        }

        var normalizedCode = requestCode.Trim();
        if (normalizedCode.StartsWith("TLP-", StringComparison.OrdinalIgnoreCase))
        {
            normalizedCode = normalizedCode[4..];
        }

        return int.TryParse(normalizedCode, out var number) ? number : 0;
    }

    private static CustomerRequestDto ToResponse(CustomerRequest request, Customer? customer = null)
    {
        return new CustomerRequestDto
        {
            Id = request.Id,
            RequestCode = request.RequestCode,
            CustomerId = request.CustomerId,
            CustomerBrandName = request.CustomerBrandName,
            RequestTitle = request.RequestTitle,
            RequestSource = request.RequestSource,
            Priority = request.Priority,
            Status = request.Status,
            Department = request.Department,
            AssignedTo = request.AssignedTo,
            Description = request.Description,
            Services = DeserializeServices(request.Services),
            ContactName = request.ContactName,
            ContactPhone = request.ContactPhone,
            ContactEmail = request.ContactEmail,
            CustomerContactName = customer?.Contact1FullName,
            CustomerContactPhone = customer?.Contact1Phone,
            CustomerContactEmail = customer?.Contact1Email,
            CustomerContactTitle = customer?.Contact1Title,
            CreatedByUserId = request.CreatedByUserId,
            CreatedByUserName = request.CreatedByUserName,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt,
            IsDeleted = request.IsDeleted,
            IsSentToSalesRouting = request.IsSentToSalesRouting,
            SentToSalesRoutingAt = request.SentToSalesRoutingAt,
            IsSentToSales = request.IsSentToSales,
            SentToSalesAt = request.SentToSalesAt,
            SalesStatus = request.SalesStatus,
        };
    }

    private static string? Clean(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static bool IsRemovedStatus(string status)
    {
        return string.Equals(status, "Veri Eksik", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsManualTransferStatus(string status)
    {
        return string.Equals(status, "Aktarıldı", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsReadyForSalesStatus(string status)
    {
        return string.Equals(status, "Satışa Hazır", StringComparison.OrdinalIgnoreCase);
    }

    private static string? SerializeServices(List<string>? services)
    {
        var cleanServices = services?
            .Where(service => !string.IsNullOrWhiteSpace(service))
            .Select(service => service.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        return cleanServices is { Count: > 0 } ? string.Join(", ", cleanServices) : null;
    }

    private static List<string> DeserializeServices(string? services)
    {
        return string.IsNullOrWhiteSpace(services)
            ? []
            : services.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
    }
}
