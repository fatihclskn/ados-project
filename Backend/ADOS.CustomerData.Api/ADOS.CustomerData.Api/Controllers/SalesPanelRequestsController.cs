using ADOS.CustomerData.Api.Data;
using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/sales-panel-requests")]
[Authorize]
public class SalesPanelRequestsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public SalesPanelRequestsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _dbContext.SalesPanelRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted)
            .OrderByDescending(request => request.TransferredAt)
            .ThenByDescending(request => request.Id)
            .ToListAsync();

        var customerIds = requests
            .Where(request => request.CustomerId.HasValue)
            .Select(request => request.CustomerId!.Value)
            .Distinct()
            .ToList();

        var customers = customerIds.Count == 0
            ? new Dictionary<Guid, Customer>()
            : await _dbContext.Customers
                .AsNoTracking()
                .Where(customer => customerIds.Contains(customer.Id) && customer.IsDeleted != true)
                .ToDictionaryAsync(customer => customer.Id);

        var items = requests.Select(request =>
        {
            var customer = request.CustomerId.HasValue && customers.TryGetValue(request.CustomerId.Value, out var foundCustomer)
                ? foundCustomer
                : null;

            return ToResponse(request, customer);
        }).ToList();

        return Ok(new
        {
            items,
            totalCount = items.Count,
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SalesPanelRequestDto>> GetById(int id)
    {
        var request = await _dbContext.SalesPanelRequests
            .AsNoTracking()
            .SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);

        if (request is null)
        {
            return NotFound(new { success = false, message = "Satış paneli talebi bulunamadı." });
        }

        var customer = await FindCustomer(request.CustomerId);
        return Ok(ToResponse(request, customer));
    }

    [HttpGet("by-customer/{customerId}")]
    public async Task<IActionResult> GetByCustomer(Guid customerId)
    {
        Console.WriteLine($"Selected CustomerId: {customerId}");
        Console.WriteLine($"SalesPanelRequests count: {await _dbContext.SalesPanelRequests.CountAsync()}");

        var requests = await _dbContext.SalesPanelRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted && request.CustomerId == customerId)
            .OrderByDescending(request => request.TransferredAt)
            .ThenByDescending(request => request.Id)
            .ToListAsync();

        var customer = await FindCustomer(customerId);
        var items = requests.Select(request => ToResponse(request, customer)).ToList();
        Console.WriteLine($"Matched customer requests: {items.Count}");

        return Ok(new
        {
            items,
            totalCount = items.Count,
        });
    }

    [HttpPost("from-routing/{salesRoutingRequestId:int}")]
    public async Task<IActionResult> CreateFromRouting(int salesRoutingRequestId)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var routingRequest = await _dbContext.SalesRoutingRequests
                .SingleOrDefaultAsync(request => request.Id == salesRoutingRequestId && !request.IsDeleted);

            if (routingRequest is null)
            {
                await transaction.RollbackAsync();
                return NotFound(new { success = false, message = "Satışa yönlendirme kaydı bulunamadı." });
            }

            var existing = await _dbContext.SalesPanelRequests
                .AnyAsync(request => request.SalesRoutingRequestId == salesRoutingRequestId && !request.IsDeleted);

            if (existing)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { success = false, message = "Bu talep zaten satış paneline aktarılmış." });
            }

            var sourceMarketingRequest = await _dbContext.CustomerRequests
                .AsNoTracking()
                .SingleOrDefaultAsync(request => request.Id == routingRequest.RequestId && !request.IsDeleted);

            var now = DateTime.Now;
            var salesPanelRequest = new SalesPanelRequest
            {
                SalesRoutingRequestId = routingRequest.Id,
                SourceMarketingRequestId = routingRequest.RequestId,
                RequestCode = sourceMarketingRequest?.RequestCode,
                CustomerId = routingRequest.CustomerId,
                CustomerBrandName = routingRequest.CustomerBrandName,
                RequestTitle = routingRequest.RequestTitle,
                RequestSource = routingRequest.RequestSource,
                Priority = routingRequest.Priority,
                RequestStatus = routingRequest.RequestStatus,
                SalesStatus = "Yeni",
                Department = sourceMarketingRequest?.Department,
                AssignedTo = routingRequest.AssignedTo,
                Description = sourceMarketingRequest?.Description,
                Services = sourceMarketingRequest?.Services,
                ContactName = sourceMarketingRequest?.ContactName,
                ContactPhone = sourceMarketingRequest?.ContactPhone,
                ContactEmail = sourceMarketingRequest?.ContactEmail,
                Notes = routingRequest.Notes,
                ExpectedOfferDate = ExtractExpectedOfferDate(routingRequest.Notes),
                TransferredAt = now,
                TransferredByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("UserId"),
                TransferredByUserName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("FullName"),
                CreatedAt = now,
                UpdatedAt = now,
                IsDeleted = false,
            };

            routingRequest.SalesStatus = "Satışa Aktarıldı";
            routingRequest.SentToSalesAt = now;
            routingRequest.UpdatedAt = now;

            _dbContext.SalesPanelRequests.Add(salesPanelRequest);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new TransferSalesRoutingToSalesPanelResponse
            {
                Success = true,
                Message = "Talep satış paneli talep havuzuna aktarıldı.",
                SalesPanelRequestId = salesPanelRequest.Id,
            });
        }
        catch (Exception error)
        {
            await transaction.RollbackAsync();
            Console.Error.WriteLine(error);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "Talep satış paneli talep havuzuna aktarılırken hata oluştu.",
                detail = error.Message,
            });
        }
    }

    private async Task<Customer?> FindCustomer(Guid? customerId)
    {
        if (!customerId.HasValue)
        {
            return null;
        }

        return await _dbContext.Customers
            .AsNoTracking()
            .SingleOrDefaultAsync(customer => customer.Id == customerId.Value && customer.IsDeleted != true);
    }

    private static SalesPanelRequestDto ToResponse(SalesPanelRequest request, Customer? customer = null)
    {
        return new SalesPanelRequestDto
        {
            Id = request.Id,
            SalesRoutingRequestId = request.SalesRoutingRequestId,
            SourceMarketingRequestId = request.SourceMarketingRequestId,
            RequestCode = request.RequestCode,
            CustomerId = request.CustomerId,
            CustomerBrandName = request.CustomerBrandName ?? string.Empty,
            RequestTitle = request.RequestTitle ?? string.Empty,
            RequestSource = request.RequestSource ?? string.Empty,
            Priority = request.Priority ?? string.Empty,
            RequestStatus = request.RequestStatus ?? string.Empty,
            SalesStatus = request.SalesStatus ?? string.Empty,
            Department = request.Department,
            AssignedTo = request.AssignedTo,
            Description = request.Description ?? string.Empty,
            Services = DeserializeServices(request.Services),
            ContactName = request.ContactName,
            ContactPhone = request.ContactPhone,
            ContactEmail = request.ContactEmail,
            CustomerContactName = customer?.Contact1FullName,
            CustomerContactPhone = customer?.Contact1Phone,
            CustomerContactEmail = customer?.Contact1Email,
            CustomerContactTitle = customer?.Contact1Title,
            Notes = request.Notes ?? string.Empty,
            ExpectedOfferDate = request.ExpectedOfferDate,
            TransferredAt = request.TransferredAt,
            TransferredByUserId = request.TransferredByUserId,
            TransferredByUserName = request.TransferredByUserName,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt,
            IsDeleted = request.IsDeleted,
        };
    }

    private static DateTime? ExtractExpectedOfferDate(string? notes)
    {
        if (string.IsNullOrWhiteSpace(notes))
        {
            return null;
        }

        const string marker = "Beklenen Teklif Tarihi=";
        var index = notes.LastIndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (index < 0)
        {
            return null;
        }

        var valueStart = index + marker.Length;
        var value = notes[valueStart..].Split('/', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();

        return DateTime.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            ? date
            : null;
    }

    private static List<string> DeserializeServices(string? services)
    {
        return string.IsNullOrWhiteSpace(services)
            ? []
            : services.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
    }
}
