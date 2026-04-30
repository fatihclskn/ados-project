namespace ADOS.CustomerData.Api.DTOs;

public record CreatePersonnelRequest(
    string FullName,
    string Email,
    string Password,
    string? Phone,
    string Position,
    string Department,
    DateTime StartDate,
    DateTime? BirthDate,
    decimal? Salary,
    string? ReportsTo,
    string Role,
    bool HasAdosAccess,
    string? AccessLevel,
    string? PanelAccess,
    bool MfaEnabled);

public record UpdatePersonnelRequest(
    string FullName,
    string Email,
    string? Password,
    string? Phone,
    string Position,
    string Department,
    DateTime StartDate,
    DateTime? BirthDate,
    decimal? Salary,
    string? ReportsTo,
    string Role,
    bool IsActive,
    bool HasAdosAccess,
    string? AccessLevel,
    string? PanelAccess,
    bool MfaEnabled);

public record UpdatePersonnelStatusRequest(bool IsActive);

public record PersonnelResponse(
    int Id,
    string FullName,
    string Email,
    string? Phone,
    string Position,
    string Department,
    DateTime StartDate,
    DateTime? BirthDate,
    decimal? Salary,
    string? ReportsTo,
    string Role,
    bool IsActive,
    bool HasAdosAccess,
    string? AccessLevel,
    string? PanelAccess,
    bool MfaEnabled,
    DateTime? LastLoginAt,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
