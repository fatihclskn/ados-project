namespace ADOS.CustomerData.Api.DTOs;

public class AiSettingDto
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

public class UpdateAiSettingRequest
{
    public string ProviderName { get; set; } = string.Empty;
    public string ApiBaseUrl { get; set; } = string.Empty;
    public string ApiEndpoint { get; set; } = string.Empty;
    public string? ApiKey { get; set; }
    public string? ModelName { get; set; }
    public bool IsActive { get; set; }
    public string? Description { get; set; }
}

public class AiGenerateRequest
{
    public string Prompt { get; set; } = string.Empty;
}
