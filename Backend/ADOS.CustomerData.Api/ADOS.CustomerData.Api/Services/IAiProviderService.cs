namespace ADOS.CustomerData.Api.Services;

public interface IAiProviderService
{
    Task<string> GenerateAsync(string prompt, CancellationToken cancellationToken = default);
}
