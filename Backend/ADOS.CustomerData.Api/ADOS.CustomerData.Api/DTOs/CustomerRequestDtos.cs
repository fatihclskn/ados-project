namespace ADOS.CustomerData.Api.DTOs;

public class CreateCustomerRequestDto
{
    public Guid? CustomerId { get; set; }
    public string? CustomerBrandName { get; set; }
    public string? RequestTitle { get; set; }
    public string? RequestSource { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public string? Department { get; set; }
    public string? AssignedTo { get; set; }
    public string? Description { get; set; }
    public List<string>? Services { get; set; }
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
}

public class UpdateCustomerRequestDto : CreateCustomerRequestDto
{
}

public class CustomerRequestDto
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
    public List<string> Services { get; set; } = [];
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public string? CustomerContactName { get; set; }
    public string? CustomerContactPhone { get; set; }
    public string? CustomerContactEmail { get; set; }
    public string? CustomerContactTitle { get; set; }
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
