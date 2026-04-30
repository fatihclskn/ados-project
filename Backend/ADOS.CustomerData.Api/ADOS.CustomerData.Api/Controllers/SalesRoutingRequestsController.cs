using ADOS.CustomerData.Api.Data;
using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/sales-routing")]
[Authorize]
public class SalesRoutingRequestsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public SalesRoutingRequestsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalesRoutingRequestDto>>> GetAll()
    {
        var requests = await _dbContext.SalesRoutingRequests
            .AsNoTracking()
            .Where(request => !request.IsDeleted)
            .OrderByDescending(request => request.RoutedAt)
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
    public async Task<ActionResult<SalesRoutingRequestDto>> GetById(int id)
    {
        var request = await _dbContext.SalesRoutingRequests
            .AsNoTracking()
            .SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);

        if (request is null)
        {
            return NotFound();
        }

        var customer = await FindCustomer(request.CustomerId);
        return Ok(ToResponse(request, customer));
    }

    [HttpPost("from-request/{requestId:int}")]
    public async Task<ActionResult<SalesRoutingRequestDto>> CreateFromRequest(int requestId)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            Console.WriteLine($"Sales routing requestId: {requestId}");

            var source = await _dbContext.CustomerRequests
                .SingleOrDefaultAsync(request => request.Id == requestId && !request.IsDeleted);

            if (source is null)
            {
                return NotFound(new { success = false, message = "Talep bulunamadı." });
            }

            var existing = await _dbContext.SalesRoutingRequests
                .SingleOrDefaultAsync(request => request.RequestId == requestId && !request.IsDeleted);

            if (existing is not null)
            {
                return BadRequest(new { success = false, message = "Bu talep zaten satışa yönlendirilmiş." });
            }

            if (string.Equals(source.Status, "Aktarıldı", StringComparison.OrdinalIgnoreCase) || source.IsSentToSalesRouting)
            {
                return BadRequest(new { success = false, message = "Bu talep zaten satışa yönlendirilmiş." });
            }

            if (!string.Equals(source.Status, "Satışa Hazır", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { success = false, message = "Talep satışa yönlendirilmeden önce Satışa Hazır olmalıdır." });
            }

            var now = DateTime.Now;
            var entity = new SalesRoutingRequest
            {
                RequestId = source.Id,
                CustomerId = source.CustomerId,
                CustomerBrandName = source.CustomerBrandName,
                RequestTitle = source.RequestTitle,
                RequestSource = source.RequestSource,
                Priority = source.Priority,
                RequestStatus = source.Status,
                RoutingStatus = "Aktarıldı",
                SalesStatus = "Bekliyor",
                AssignedTo = source.AssignedTo,
                Notes = source.Description,
                RoutedAt = now,
                RoutedByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("UserId"),
                RoutedByUserName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("FullName"),
                CreatedAt = now,
                UpdatedAt = now,
                IsDeleted = false,
            };

            source.Status = "Aktarıldı";
            source.IsSentToSalesRouting = true;
            source.SentToSalesRoutingAt = now;
            source.SalesStatus = "Bekliyor";
            source.UpdatedAt = now;

            _dbContext.SalesRoutingRequests.Add(entity);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                success = true,
                message = "Talep satışa yönlendirme havuzuna aktarıldı."
            });
        }
        catch (DbUpdateException ex)
        {
            await transaction.RollbackAsync();
            Console.Error.WriteLine(ex);
            return StatusCode(StatusCodes.Status500InternalServerError, new { success = false, message = "Talep satışa yönlendirme havuzuna aktarılırken veritabanı hatası oluştu." });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.Error.WriteLine(ex);
            return StatusCode(StatusCodes.Status500InternalServerError, new { success = false, message = "Talep satışa yönlendirme havuzuna aktarılamadı." });
        }
    }

    [HttpPost("{id:int}/send-to-sales")]
    public async Task<ActionResult<SalesRoutingRequestDto>> SendToSales(int id)
    {
        var entity = await _dbContext.SalesRoutingRequests
            .SingleOrDefaultAsync(request => request.Id == id && !request.IsDeleted);

        if (entity is null)
        {
            return NotFound();
        }

        var now = DateTime.Now;
        entity.SalesStatus = "Satışta";
        entity.SentToSalesAt = now;
        entity.UpdatedAt = now;

        var source = await _dbContext.CustomerRequests
            .SingleOrDefaultAsync(request => request.Id == entity.RequestId && !request.IsDeleted);

        if (source is not null)
        {
            source.IsSentToSalesRouting = true;
            source.SentToSalesRoutingAt ??= entity.RoutedAt;
            source.IsSentToSales = true;
            source.SentToSalesAt = now;
            source.SalesStatus = "Satışta";
            source.Status = "Aktarıldı";
            source.UpdatedAt = now;
        }

        await _dbContext.SaveChangesAsync();

        var customer = await FindCustomer(entity.CustomerId);
        return Ok(ToResponse(entity, customer));
    }

    [HttpPatch("{id:int}/handoff")]
    public async Task<ActionResult<SalesRoutingRequestDto>> UpdateHandoff(int id, UpdateSalesRoutingHandoffRequest request)
    {
        var entity = await _dbContext.SalesRoutingRequests
            .SingleOrDefaultAsync(currentRequest => currentRequest.Id == id && !currentRequest.IsDeleted);

        if (entity is null)
        {
            return NotFound(new { success = false, message = "Satışa yönlendirme kaydı bulunamadı." });
        }

        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(request.HandoffNote))
        {
            parts.Add($"Handoff Notu= {request.HandoffNote.Trim()}");
        }

        if (!string.IsNullOrWhiteSpace(request.ExpectedOfferDate))
        {
            parts.Add($"Beklenen Teklif Tarihi= {request.ExpectedOfferDate.Trim()}");
        }

        if (parts.Count == 0)
        {
            return BadRequest(new { success = false, message = "Kaydetmek için handoff notu veya beklenen teklif tarihi girilmelidir." });
        }

        var currentNotes = string.IsNullOrWhiteSpace(entity.Notes) ? null : entity.Notes.Trim();
        var nextNotes = string.Join(" / ", parts);
        entity.Notes = currentNotes is null ? nextNotes : $"{currentNotes} / {nextNotes}";
        entity.UpdatedAt = DateTime.Now;

        await _dbContext.SaveChangesAsync();

        var customer = await FindCustomer(entity.CustomerId);
        return Ok(ToResponse(entity, customer));
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

    private static SalesRoutingRequestDto ToResponse(SalesRoutingRequest request, Customer? customer = null)
    {
        return new SalesRoutingRequestDto
        {
            Id = request.Id,
            RequestId = request.RequestId,
            CustomerId = request.CustomerId,
            CustomerBrandName = request.CustomerBrandName,
            RequestTitle = request.RequestTitle,
            RequestSource = request.RequestSource,
            Priority = request.Priority,
            RequestStatus = request.RequestStatus,
            RoutingStatus = request.RoutingStatus,
            SalesStatus = request.SalesStatus,
            AssignedTo = request.AssignedTo,
            Notes = request.Notes,
            RoutedAt = request.RoutedAt,
            RoutedByUserId = request.RoutedByUserId,
            RoutedByUserName = request.RoutedByUserName,
            SentToSalesAt = request.SentToSalesAt,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt,
            CustomerContactName = customer?.Contact1FullName,
            CustomerContactPhone = customer?.Contact1Phone,
            CustomerContactEmail = customer?.Contact1Email,
            CustomerContactTitle = customer?.Contact1Title,
        };
    }
}
