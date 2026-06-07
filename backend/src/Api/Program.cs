using FinancialOCR.Application.Services;
using FinancialOCR.Infrastructure.Persistence;
using FinancialOCR.Api.Middleware;
using FinancialOCR.Api.Options;
using FinancialOCR.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/financial-ocr-.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Financial OCR API", Version = "v1", Description = "Bilingual Canadian financial OCR API for receipts and invoices with OCR routing, structured extraction, validation, and export workflows." });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularLocal", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.Configure<ApiSecurityOptions>(builder.Configuration.GetSection(ApiSecurityOptions.SectionName));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=FinancialOCR;Trusted_Connection=true;";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString)
);

builder.Services.Configure<DocumentUploadOptions>(builder.Configuration.GetSection(DocumentUploadOptions.SectionName));
builder.Services.Configure<OcrOptions>(builder.Configuration.GetSection(OcrOptions.SectionName));
builder.Services.Configure<FinancialExtractionOptions>(builder.Configuration.GetSection(FinancialExtractionOptions.SectionName));
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IDocumentProcessingService, DocumentProcessingService>();
builder.Services.AddScoped<IOcrRouter, OcrRouter>();
builder.Services.AddScoped<ILanguageDetectionService, LanguageDetectionService>();
builder.Services.AddScoped<RuleBasedFinancialExtractionProvider>();
builder.Services.AddScoped<GeminiFlashLiteFinancialExtractionProvider>();
builder.Services.AddScoped<LlmFinancialExtractionProvider>();
builder.Services.AddScoped<IFinancialExtractionProviderSelector, FinancialExtractionProviderSelector>();
builder.Services.AddScoped<IFinancialFieldExtractor, FinancialFieldExtractor>();
builder.Services.AddScoped<IFinancialDocumentValidator, FinancialDocumentValidator>();
builder.Services.AddScoped<ITesseractOcrEngineAdapter, TesseractOcrEngineAdapter>();
builder.Services.AddScoped<IOcrProvider, NativePdfTextOcrProvider>();
builder.Services.AddScoped<IOcrProvider, TesseractOcrProvider>();
builder.Services.AddScoped<IOcrProvider, GeminiFlashLiteOcrProvider>();
builder.Services.AddScoped<IOcrProvider, VisionFallbackOcrProvider>();

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>();

var app = builder.Build();

if (!app.Environment.IsEnvironment("Testing"))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Financial OCR API v1");
        c.RoutePrefix = string.Empty;
    });
}

var apiSecurityOptions = app.Services.GetRequiredService<IOptions<ApiSecurityOptions>>().Value;
if (!string.IsNullOrWhiteSpace(apiSecurityOptions.ApiKey))
{
    app.Use(async (context, next) =>
    {
        var path = context.Request.Path;
        var isHealthRequest = path.StartsWithSegments("/api/health", StringComparison.OrdinalIgnoreCase);
        var isDevelopmentSwaggerRequest = app.Environment.IsDevelopment() && path.StartsWithSegments("/swagger", StringComparison.OrdinalIgnoreCase);

        if (isHealthRequest || isDevelopmentSwaggerRequest)
        {
            await next();
            return;
        }

        if (!context.Request.Headers.TryGetValue("X-API-Key", out var providedApiKey) ||
            string.IsNullOrWhiteSpace(providedApiKey) ||
            !string.Equals(providedApiKey.ToString(), apiSecurityOptions.ApiKey, StringComparison.Ordinal))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new { message = "Missing or invalid X-API-Key." });
            return;
        }

        await next();
    });
}

app.Use(async (context, next) =>
{
    var path = context.Request.Path;
    if (path.StartsWithSegments("/App_Data", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWithSegments("/uploads", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    await next();
});

app.UseSerilogRequestLogging();
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseCors("AllowAngularLocal");
app.MapHealthChecks("/api/health");
app.MapControllers();

app.Run();

public partial class Program
{
}
