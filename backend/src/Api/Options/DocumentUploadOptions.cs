namespace FinancialOCR.Api.Options;

public class DocumentUploadOptions
{
    public const string SectionName = "DocumentUpload";
    public string RootFolder { get; set; } = "App_Data/uploads";
    public int MaxFileSizeMb { get; set; } = 10;
}
