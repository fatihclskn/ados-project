namespace ADOS.CustomerData.Api.Entities;

public class AiSetting
{
    public int Id { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string ApiBaseUrl { get; set; } = string.Empty;
    public string ApiEndpoint { get; set; } = string.Empty;
    public string? ApiKey { get; set; }
    public string? ModelName { get; set; }
    public bool IsActive { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
