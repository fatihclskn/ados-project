namespace ADOS.CustomerData.Api.Entities;

public class CustomerRequest
{
    public int Id { get; set; }
    public string RequestCode { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public string? CustomerBrandName { get; set; }
    public string RequestTitle { get; set; } = string.Empty;
    public string RequestSource { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? AssignedTo { get; set; }
    public string? Description { get; set; }
    public string? Services { get; set; }
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public string? CreatedByUserId { get; set; }
    public string? CreatedByUserName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsSentToSalesRouting { get; set; }
    public DateTime? SentToSalesRoutingAt { get; set; }
    public bool IsSentToSales { get; set; }
    public DateTime? SentToSalesAt { get; set; }
    public string? SalesStatus { get; set; }
}
