namespace ADOS.CustomerData.Api.DTOs;

public class SalesPanelRequestDto
{
    public int Id { get; set; }
    public int SalesRoutingRequestId { get; set; }
    public int SourceMarketingRequestId { get; set; }
    public string? RequestCode { get; set; }
    public Guid? CustomerId { get; set; }
    public string? CustomerBrandName { get; set; }
    public string RequestTitle { get; set; } = string.Empty;
    public string? RequestSource { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string? RequestStatus { get; set; }
    public string SalesStatus { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? AssignedTo { get; set; }
    public string? Description { get; set; }
    public List<string> Services { get; set; } = [];
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public string? CustomerContactName { get; set; }
    public string? CustomerContactPhone { get; set; }
    public string? CustomerContactEmail { get; set; }
    public string? CustomerContactTitle { get; set; }
    public string? Notes { get; set; }
    public DateTime? ExpectedOfferDate { get; set; }
    public DateTime TransferredAt { get; set; }
    public string? TransferredByUserId { get; set; }
    public string? TransferredByUserName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}

public class TransferSalesRoutingToSalesPanelResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? SalesPanelRequestId { get; set; }
}
