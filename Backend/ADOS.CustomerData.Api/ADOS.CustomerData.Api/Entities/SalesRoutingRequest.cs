namespace ADOS.CustomerData.Api.Entities;

public class SalesRoutingRequest
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public Guid? CustomerId { get; set; }
    public string? CustomerBrandName { get; set; }
    public string RequestTitle { get; set; } = string.Empty;
    public string? RequestSource { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string? RequestStatus { get; set; }
    public string RoutingStatus { get; set; } = string.Empty;
    public string? SalesStatus { get; set; }
    public string? AssignedTo { get; set; }
    public string? Notes { get; set; }
    public DateTime RoutedAt { get; set; }
    public string? RoutedByUserId { get; set; }
    public string? RoutedByUserName { get; set; }
    public DateTime? SentToSalesAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
