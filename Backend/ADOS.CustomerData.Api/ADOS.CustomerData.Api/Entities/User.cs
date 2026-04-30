namespace ADOS.CustomerData.Api.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Position { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? BirthDate { get; set; }
    public decimal? Salary { get; set; }
    public string? ReportsTo { get; set; }
    public string Role { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool HasAdosAccess { get; set; }
    public string? AccessLevel { get; set; }
    public string? PanelAccess { get; set; }
    public bool MfaEnabled { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
