using ADOS.CustomerData.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace ADOS.CustomerData.Api.Services;

public class AiProviderService : IAiProviderService
{
    private readonly AppDbContext _dbContext;
    private readonly IHttpClientFactory _httpClientFactory;

    public AiProviderService(AppDbContext dbContext, IHttpClientFactory httpClientFactory)
    {
        _dbContext = dbContext;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<string> GenerateAsync(string prompt, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(prompt))
        {
            throw new ArgumentException("Prompt boş olamaz.", nameof(prompt));
        }

        var setting = await _dbContext.AiSettings
            .AsNoTracking()
            .Where(current => current.IsActive && !current.IsDeleted)
            .OrderByDescending(current => current.UpdatedAt ?? current.CreatedAt)
            .ThenByDescending(current => current.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (setting is null)
        {
            throw new InvalidOperationException("Aktif AI sağlayıcısı bulunamadı.");
        }

        var baseUrl = setting.ApiBaseUrl.Trim().TrimEnd('/');
        var endpoint = setting.ApiEndpoint.Trim();
        if (string.IsNullOrWhiteSpace(baseUrl) || string.IsNullOrWhiteSpace(endpoint))
        {
            throw new InvalidOperationException("Aktif AI sağlayıcısının API adresi eksik.");
        }

        var requestUrl = endpoint.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                         endpoint.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
            ? endpoint
            : $"{baseUrl}/{endpoint.TrimStart('/')}";

        var client = _httpClientFactory.CreateClient("AiProvider");
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, requestUrl)
        {
            Content = JsonContent.Create(new { prompt }),
        };

        if (!string.IsNullOrWhiteSpace(setting.ApiKey))
        {
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", setting.ApiKey);
            httpRequest.Headers.TryAddWithoutValidation("X-API-Key", setting.ApiKey);
        }

        using var response = await client.SendAsync(httpRequest, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"AI servisi hata döndürdü. HTTP {(int)response.StatusCode}: {responseText}", null, response.StatusCode);
        }

        return responseText;
    }
}
