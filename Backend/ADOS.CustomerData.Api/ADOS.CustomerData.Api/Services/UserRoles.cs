namespace ADOS.CustomerData.Api.Services;

public static class UserRoles
{
    public const string MasterAdmin = "MasterAdmin";
    public const string GenelMudur = "GenelMudur";
    public const string Pazarlama = "Pazarlama";
    public const string PazarlamaYonetim = "PazarlamaYonetim";
    public const string Satis = "Satis";
    public const string SatisYonetim = "SatisYonetim";
    public const string Finans = "Finans";
    public const string FinansYonetim = "FinansYonetim";

    public static readonly string[] All =
    [
        MasterAdmin,
        GenelMudur,
        Pazarlama,
        PazarlamaYonetim,
        Satis,
        SatisYonetim,
        Finans,
        FinansYonetim,
    ];

    public static bool IsValid(string role)
    {
        return All.Contains(role, StringComparer.OrdinalIgnoreCase);
    }

    public static string Normalize(string role)
    {
        return All.FirstOrDefault(currentRole => string.Equals(currentRole, role, StringComparison.OrdinalIgnoreCase)) ?? role;
    }

    public static string GetDefaultRoute(string role)
    {
        return Normalize(role) switch
        {
            MasterAdmin or GenelMudur => "/dashboards",
            Pazarlama or PazarlamaYonetim => "/dashboards/marketing",
            Satis or SatisYonetim => "/dashboards/sales",
            Finans or FinansYonetim => "/dashboards/finance",
            _ => "/login",
        };
    }

    public static string GetPanelAccess(string role)
    {
        return Normalize(role) switch
        {
            MasterAdmin or GenelMudur => "All",
            Pazarlama or PazarlamaYonetim => "Marketing",
            Satis or SatisYonetim => "Sales",
            Finans or FinansYonetim => "Finance",
            _ => "None",
        };
    }

    public static string GetAccessLevel(string role)
    {
        return Normalize(role) switch
        {
            MasterAdmin => "Master",
            GenelMudur or PazarlamaYonetim or SatisYonetim or FinansYonetim => "Management",
            _ => "User",
        };
    }
}
