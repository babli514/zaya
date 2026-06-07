namespace FinancialOCR.Api.Options;

public class ApiSecurityOptions
{
    public const string SectionName = "ApiSecurity";
    public string ApiKey { get; set; } = string.Empty;
}
