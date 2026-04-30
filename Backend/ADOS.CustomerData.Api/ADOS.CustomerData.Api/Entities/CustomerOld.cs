namespace ADOS.CustomerData.Api.Entities;

public class CustomerOld
{
    public int Id { get; set; }
    public string? CustomerCode { get; set; }
    public string? BrandName { get; set; }
    public string? OfficialTitle { get; set; }
    public string? CustomerStatus { get; set; }
    public string? DataQualityStatus { get; set; }
    public string? Source { get; set; }
    public string? Segment { get; set; }
    public string? CompanyPhone { get; set; }
    public string? CompanyEmail { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool? IsDeleted { get; set; }
}
