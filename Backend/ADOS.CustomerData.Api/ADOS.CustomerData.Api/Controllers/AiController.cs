using ADOS.CustomerData.Api.DTOs;
using ADOS.CustomerData.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace ADOS.CustomerData.Api.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IAiProviderService _aiProviderService;
    private readonly ILogger<AiController> _logger;

    public AiController(IHttpClientFactory httpClientFactory, IAiProviderService aiProviderService, ILogger<AiController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _aiProviderService = aiProviderService;
        _logger = logger;
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate(AiGenerateRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
        {
            return BadRequest(new { message = "Prompt boş olamaz." });
        }

        try
        {
            var result = await _aiProviderService.GenerateAsync(request.Prompt, cancellationToken);
            return Ok(new { result });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "AI provider failed");
            return StatusCode(StatusCodes.Status502BadGateway, new { message = "AI servisi hata döndürdü.", detail = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AI generate failed");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "AI üretimi tamamlanamadı.", detail = ex.Message });
        }
    }

    [HttpPost("analyze-website")]
    public async Task<IActionResult> AnalyzeWebsite(AiWebsiteAnalyzeRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.WebsiteUrl))
        {
            return BadRequest(new { message = "Lütfen analiz edilecek site adresini girin." });
        }

        if (!TryNormalizeUrl(request.WebsiteUrl, out var websiteUri))
        {
            return BadRequest(new { message = "Geçerli bir web sitesi adresi girin." });
        }

        try
        {
            var websiteText = await TryReadWebsiteTextAsync(websiteUri, cancellationToken);
            var prompt = BuildPrompt(websiteUri.ToString(), websiteText);
            var responseText = await _aiProviderService.GenerateAsync(prompt, cancellationToken);

            return Ok(new
            {
                result = responseText,
                websiteUrl = websiteUri.ToString()
            });
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "AI website analysis timed out for {WebsiteUrl}", websiteUri);
            return StatusCode(StatusCodes.Status504GatewayTimeout, new { message = "AI analizi zaman aşımına uğradı." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "AI provider failed for {WebsiteUrl}", websiteUri);
            return StatusCode(StatusCodes.Status502BadGateway, new { message = "AI servisi hata döndürdü.", detail = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AI website analysis failed for {WebsiteUrl}", websiteUri);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "AI analizi tamamlanamadı.", detail = ex.Message });
        }
    }

    private static bool TryNormalizeUrl(string value, out Uri websiteUri)
    {
        var candidate = value.Trim();
        if (!candidate.StartsWith("http://", StringComparison.OrdinalIgnoreCase) &&
            !candidate.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            candidate = $"https://{candidate}";
        }

        return Uri.TryCreate(candidate, UriKind.Absolute, out websiteUri!) &&
               (websiteUri.Scheme == Uri.UriSchemeHttp || websiteUri.Scheme == Uri.UriSchemeHttps);
    }

    private async Task<string> TryReadWebsiteTextAsync(Uri websiteUri, CancellationToken cancellationToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("WebsiteReader");
            using var response = await client.GetAsync(websiteUri, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return $"Site içeriği okunamadı. HTTP {(int)response.StatusCode} {response.ReasonPhrase}";
            }

            var html = await response.Content.ReadAsStringAsync(cancellationToken);
            return ExtractReadableText(html);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Website content could not be read for {WebsiteUrl}", websiteUri);
            return $"Site içeriği okunamadı: {ex.Message}";
        }
    }

    private static string ExtractReadableText(string html)
    {
        var withoutScripts = Regex.Replace(html, "<script[\\s\\S]*?</script>", " ", RegexOptions.IgnoreCase);
        var withoutStyles = Regex.Replace(withoutScripts, "<style[\\s\\S]*?</style>", " ", RegexOptions.IgnoreCase);
        var withoutTags = Regex.Replace(withoutStyles, "<[^>]+>", " ");
        var decoded = WebUtility.HtmlDecode(withoutTags);
        var normalized = Regex.Replace(decoded, "\\s+", " ").Trim();
        return normalized.Length > 12000 ? normalized[..12000] : normalized;
    }

    private static string BuildPrompt(string websiteUrl, string websiteText)
    {
        var builder = new StringBuilder();
        builder.AppendLine("Aşağıdaki web sitesini ve içerik metnini analiz et:");
        builder.AppendLine(websiteUrl);
        builder.AppendLine();
        builder.AppendLine("Web sitesi içeriği:");
        builder.AppendLine(websiteText);
        builder.AppendLine();
        builder.AppendLine("Bana sadece geçerli JSON formatında dön. Açıklama, markdown veya kod bloğu yazma.");
        builder.AppendLine("""
{
  "firmaAdi": "",
  "sektor": "",
  "hizmetIhtiyaci": "",
  "mevcutDurum": "",
  "onerilenHizmetler": [],
  "teklifNotu": "",
  "kisaAnaliz": ""
}
""");
        return builder.ToString();
    }
}
