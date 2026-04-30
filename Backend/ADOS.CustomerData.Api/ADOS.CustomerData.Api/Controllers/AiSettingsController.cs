using ADOS.CustomerData.Api.Data;
using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/ai-settings")]
[Authorize]
public class AiSettingsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public AiSettingsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AiSettingDto>>> GetAll()
    {
        var settings = await _dbContext.AiSettings
            .AsNoTracking()
            .Where(setting => !setting.IsDeleted)
            .OrderByDescending(setting => setting.IsActive)
            .ThenBy(setting => setting.ProviderName)
            .Select(setting => ToDto(setting))
            .ToListAsync();

        return Ok(settings);
    }

    [HttpGet("active")]
    public async Task<ActionResult<AiSettingDto>> GetActive()
    {
        var setting = await _dbContext.AiSettings
            .AsNoTracking()
            .Where(current => current.IsActive && !current.IsDeleted)
            .OrderByDescending(current => current.UpdatedAt ?? current.CreatedAt)
            .ThenByDescending(current => current.Id)
            .FirstOrDefaultAsync();

        if (setting is null)
        {
            return NotFound(new { message = "Aktif AI sağlayıcısı bulunamadı." });
        }

        return Ok(ToDto(setting));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AiSettingDto>> Update(int id, UpdateAiSettingRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProviderName) ||
            string.IsNullOrWhiteSpace(request.ApiBaseUrl) ||
            string.IsNullOrWhiteSpace(request.ApiEndpoint))
        {
            return BadRequest(new { message = "Sağlayıcı adı, API base URL ve endpoint zorunludur." });
        }

        var setting = await _dbContext.AiSettings.SingleOrDefaultAsync(current => current.Id == id && !current.IsDeleted);
        if (setting is null)
        {
            return NotFound(new { message = "AI ayarı bulunamadı." });
        }

        setting.ProviderName = request.ProviderName.Trim();
        setting.ApiBaseUrl = request.ApiBaseUrl.Trim().TrimEnd('/');
        setting.ApiEndpoint = request.ApiEndpoint.Trim();
        setting.ApiKey = string.IsNullOrWhiteSpace(request.ApiKey) ? null : request.ApiKey.Trim();
        setting.ModelName = string.IsNullOrWhiteSpace(request.ModelName) ? null : request.ModelName.Trim();
        setting.IsActive = request.IsActive;
        setting.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        setting.UpdatedAt = DateTime.Now;

        if (setting.IsActive)
        {
            var otherActiveSettings = await _dbContext.AiSettings
                .Where(current => current.Id != setting.Id && current.IsActive && !current.IsDeleted)
                .ToListAsync();

            foreach (var other in otherActiveSettings)
            {
                other.IsActive = false;
                other.UpdatedAt = DateTime.Now;
            }
        }

        await _dbContext.SaveChangesAsync();
        return Ok(ToDto(setting));
    }

    private static AiSettingDto ToDto(AiSetting setting)
    {
        return new AiSettingDto
        {
            Id = setting.Id,
            ProviderName = setting.ProviderName,
            ApiBaseUrl = setting.ApiBaseUrl,
            ApiEndpoint = setting.ApiEndpoint,
            ApiKey = setting.ApiKey,
            ModelName = setting.ModelName,
            IsActive = setting.IsActive,
            Description = setting.Description,
            CreatedAt = setting.CreatedAt,
            UpdatedAt = setting.UpdatedAt,
            IsDeleted = setting.IsDeleted,
        };
    }
}
