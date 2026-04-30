using ADOS.CustomerData.Api.Data;
using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Entities;
using ADOS.CustomerData.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PersonnelController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;

    public PersonnelController(AppDbContext dbContext, IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonnelResponse>>> GetAll()
    {
        var users = await _dbContext.Users
            .AsNoTracking()
            .OrderBy(user => user.FullName)
            .Select(user => ToResponse(user))
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PersonnelResponse>> GetById(int id)
    {
        var user = await _dbContext.Users.AsNoTracking().SingleOrDefaultAsync(currentUser => currentUser.Id == id);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(user));
    }

    [HttpPost]
    [Authorize(Roles = $"{UserRoles.MasterAdmin},{UserRoles.GenelMudur}")]
    public async Task<ActionResult<PersonnelResponse>> Create(CreatePersonnelRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.Position) ||
            string.IsNullOrWhiteSpace(request.Department))
        {
            return BadRequest(new { message = "Zorunlu personel alanları eksik." });
        }

        if (!UserRoles.IsValid(request.Role))
        {
            return BadRequest(new { message = "Geçersiz rol." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var emailExists = await _dbContext.Users.AnyAsync(user => user.Email == email);
        if (emailExists)
        {
            return Conflict(new { message = "Bu e-posta adresi zaten kayıtlı." });
        }

        var normalizedRole = UserRoles.Normalize(request.Role);
        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Position = request.Position.Trim(),
            Department = request.Department.Trim(),
            StartDate = request.StartDate,
            BirthDate = request.BirthDate,
            Salary = request.Salary,
            ReportsTo = string.IsNullOrWhiteSpace(request.ReportsTo) ? null : request.ReportsTo.Trim(),
            Role = normalizedRole,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            IsActive = true,
            HasAdosAccess = request.HasAdosAccess,
            AccessLevel = request.HasAdosAccess ? request.AccessLevel ?? UserRoles.GetAccessLevel(normalizedRole) : null,
            PanelAccess = request.HasAdosAccess ? request.PanelAccess ?? UserRoles.GetPanelAccess(normalizedRole) : null,
            MfaEnabled = request.MfaEnabled,
            CreatedAt = DateTime.UtcNow,
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, ToResponse(user));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = $"{UserRoles.MasterAdmin},{UserRoles.GenelMudur}")]
    public async Task<ActionResult<PersonnelResponse>> Update(int id, UpdatePersonnelRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Position) ||
            string.IsNullOrWhiteSpace(request.Department))
        {
            return BadRequest(new { message = "Zorunlu personel alanları eksik." });
        }

        if (!UserRoles.IsValid(request.Role))
        {
            return BadRequest(new { message = "Geçersiz rol." });
        }

        var user = await _dbContext.Users.SingleOrDefaultAsync(currentUser => currentUser.Id == id);
        if (user is null)
        {
            return NotFound();
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var emailExists = await _dbContext.Users.AnyAsync(currentUser => currentUser.Id != id && currentUser.Email == email);
        if (emailExists)
        {
            return Conflict(new { message = "Bu e-posta adresi zaten kayıtlı." });
        }

        var normalizedRole = UserRoles.Normalize(request.Role);
        user.FullName = request.FullName.Trim();
        user.Email = email;
        user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        user.Position = request.Position.Trim();
        user.Department = request.Department.Trim();
        user.StartDate = request.StartDate;
        user.BirthDate = request.BirthDate;
        user.Salary = request.Salary;
        user.ReportsTo = string.IsNullOrWhiteSpace(request.ReportsTo) ? null : request.ReportsTo.Trim();
        user.Role = normalizedRole;
        user.IsActive = request.IsActive;
        user.HasAdosAccess = request.HasAdosAccess;
        user.AccessLevel = request.HasAdosAccess ? request.AccessLevel ?? UserRoles.GetAccessLevel(normalizedRole) : null;
        user.PanelAccess = request.HasAdosAccess ? request.PanelAccess ?? UserRoles.GetPanelAccess(normalizedRole) : null;
        user.MfaEnabled = request.MfaEnabled;
        user.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = _passwordHasher.HashPassword(request.Password);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(ToResponse(user));
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = $"{UserRoles.MasterAdmin},{UserRoles.GenelMudur}")]
    public async Task<ActionResult<PersonnelResponse>> UpdateStatus(int id, UpdatePersonnelStatusRequest request)
    {
        var user = await _dbContext.Users.SingleOrDefaultAsync(currentUser => currentUser.Id == id);
        if (user is null)
        {
            return NotFound();
        }

        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return Ok(ToResponse(user));
    }

    private static PersonnelResponse ToResponse(User user)
    {
        return new PersonnelResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Phone,
            user.Position,
            user.Department,
            user.StartDate,
            user.BirthDate,
            user.Salary,
            user.ReportsTo,
            user.Role,
            user.IsActive,
            user.HasAdosAccess,
            user.AccessLevel,
            user.PanelAccess,
            user.MfaEnabled,
            user.LastLoginAt,
            user.CreatedAt,
            user.UpdatedAt);
    }
}
