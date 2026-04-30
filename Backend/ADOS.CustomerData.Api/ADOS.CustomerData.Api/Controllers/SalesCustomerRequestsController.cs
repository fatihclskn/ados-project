using ADOS.CustomerData.Api.Data;
using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/sales-requests")]
[Authorize]
public class SalesCustomerRequestsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public SalesCustomerRequestsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalesCustomerRequestDto>>> GetAll()
    {
        var requests = await _dbContext.SalesCustomerRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted)
            .OrderByDescending(request => request.UpdatedAt ?? request.CreatedAt)
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

        return Ok(requests.Select(request =>
        {
            var customer = request.CustomerId.HasValue && customers.TryGetValue(request.CustomerId.Value, out var foundCustomer)
                ? foundCustomer
                : null;

            return ToResponse(request, customer);
        }).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SalesCustomerRequestDto>> GetById(int id)
    {
        var request = await _dbContext.SalesCustomerRequests
            .AsNoTracking()
            .SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);

        if (request is null)
        {
            return NotFound(new { success = false, message = "Satış talebi bulunamadı." });
        }

        var customer = await FindCustomer(request.CustomerId);
        return Ok(ToResponse(request, customer));
    }

    [HttpPost("from-marketing-request/{requestId:int}")]
    public async Task<IActionResult> CreateFromMarketingRequest(int requestId)
    {
        Console.WriteLine($"Sales customer request transfer requestId: {requestId}");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var marketingRequest = await _dbContext.CustomerRequests
                .SingleOrDefaultAsync(request => request.Id == requestId && !request.IsDeleted);

            if (marketingRequest is null)
            {
                await transaction.RollbackAsync();
                return NotFound(new { success = false, message = "Pazarlama talebi bulunamadı." });
            }

            var existing = await _dbContext.SalesCustomerRequests
                .AnyAsync(request => request.SourceMarketingRequestId == requestId && !request.IsDeleted);

            if (existing)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { success = false, message = "Bu talep zaten satış talep havuzuna aktarılmış." });
            }

            var now = DateTime.Now;
            var salesRequest = new SalesCustomerRequest
            {
                SourceMarketingRequestId = marketingRequest.Id,
                RequestCode = marketingRequest.RequestCode,
                CustomerId = marketingRequest.CustomerId,
                CustomerBrandName = marketingRequest.CustomerBrandName,
                RequestTitle = marketingRequest.RequestTitle,
                RequestSource = marketingRequest.RequestSource,
                Priority = marketingRequest.Priority,
                Status = "Yeni",
                Department = marketingRequest.Department,
                AssignedTo = marketingRequest.AssignedTo,
                Description = marketingRequest.Description,
                Services = marketingRequest.Services,
                ContactName = marketingRequest.ContactName,
                ContactPhone = marketingRequest.ContactPhone,
                ContactEmail = marketingRequest.ContactEmail,
                CreatedByUserId = marketingRequest.CreatedByUserId,
                CreatedByUserName = marketingRequest.CreatedByUserName,
                TransferredAt = now,
                TransferredByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("UserId"),
                TransferredByUserName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("FullName"),
                IsTransferredFromMarketing = true,
                CreatedAt = now,
                UpdatedAt = now,
                IsDeleted = false,
                IsSentToSalesRouting = true,
                SentToSalesRoutingAt = now,
                IsSentToSales = false,
                SalesStatus = "Bekliyor",
            };

            marketingRequest.Status = "Aktarıldı";
            marketingRequest.IsSentToSalesRouting = true;
            marketingRequest.SentToSalesRoutingAt = now;
            marketingRequest.SalesStatus = "Bekliyor";
            marketingRequest.UpdatedAt = now;

            _dbContext.SalesCustomerRequests.Add(salesRequest);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                success = true,
                message = "Talep satış talep havuzuna aktarıldı.",
                salesRequestId = salesRequest.Id,
            });
        }
        catch (Exception error)
        {
            await transaction.RollbackAsync();
            Console.Error.WriteLine(error);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "Talep satış talep havuzuna aktarılırken hata oluştu.",
                detail = error.Message,
            });
        }
    }

    [HttpPost("{id:int}/send-to-sales")]
    public async Task<ActionResult<SalesCustomerRequestDto>> SendToSales(int id)
    {
        var request = await _dbContext.SalesCustomerRequests
            .SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);

        if (request is null)
        {
            return NotFound(new { success = false, message = "Satış talebi bulunamadı." });
        }

        var now = DateTime.Now;
        request.IsSentToSales = true;
        request.SalesStatus = "Satışta";
        request.SentToSalesAt = now;
        request.UpdatedAt = now;

        var marketingRequest = await _dbContext.CustomerRequests
            .SingleOrDefaultAsync(currentRequest => currentRequest.Id == request.SourceMarketingRequestId && !currentRequest.IsDeleted);

        if (marketingRequest is not null)
        {
            marketingRequest.IsSentToSales = true;
            marketingRequest.SalesStatus = "Satışta";
            marketingRequest.SentToSalesAt = now;
            marketingRequest.UpdatedAt = now;
        }

        await _dbContext.SaveChangesAsync();

        var customer = await FindCustomer(request.CustomerId);
        return Ok(ToResponse(request, customer));
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

    private static SalesCustomerRequestDto ToResponse(SalesCustomerRequest request, Customer? customer = null)
    {
        return new SalesCustomerRequestDto
        {
            Id = request.Id,
            SourceMarketingRequestId = request.SourceMarketingRequestId,
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
            TransferredAt = request.TransferredAt,
            TransferredByUserId = request.TransferredByUserId,
            TransferredByUserName = request.TransferredByUserName,
            IsTransferredFromMarketing = request.IsTransferredFromMarketing,
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

    private static List<string> DeserializeServices(string? services)
    {
        return string.IsNullOrWhiteSpace(services)
            ? []
            : services.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
    }
}
