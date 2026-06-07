using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using FinancialOCR.Application.DTOs;
using FinancialOCR.Api.Options;
using Microsoft.Extensions.DependencyInjection;

namespace Api.Tests;

public class DocumentsApiIntegrationTests : IClassFixture<ApiIntegrationTestFactory>
{
    private readonly ApiIntegrationTestFactory _factory;
    private readonly HttpClient _client;

    public DocumentsApiIntegrationTests(ApiIntegrationTestFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ApiKey_Mode_Rejects_Protected_Endpoint_Without_Header()
    {
        using var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.PostConfigure<ApiSecurityOptions>(options =>
                {
                    options.ApiKey = "integration-test-key";
                });
            });
        }).CreateClient();

        var response = await client.GetAsync("/api/documents");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ApiKey_Mode_Allows_Protected_Endpoint_With_Valid_Header()
    {
        using var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.PostConfigure<ApiSecurityOptions>(options =>
                {
                    options.ApiKey = "integration-test-key";
                });
            });
        }).CreateClient();
        client.DefaultRequestHeaders.Add("X-API-Key", "integration-test-key");

        var response = await client.GetAsync("/api/documents");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task ApiKey_Mode_Allows_Health_Without_Header()
    {
        using var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.PostConfigure<ApiSecurityOptions>(options =>
                {
                    options.ApiKey = "integration-test-key";
                });
            });
        }).CreateClient();

        var response = await client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Upload_Rejects_Unsupported_File_Type()
    {
        using var content = BuildUploadContent("notes.txt", "text/plain", "receipt", "en-CA", "hello");

        var response = await _client.PostAsync("/api/documents/upload", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Upload_Rejects_Missing_Document_Type()
    {
        using var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(Encoding.UTF8.GetBytes("%PDF-1.4"));
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
        content.Add(fileContent, "file", "doc.pdf");
        content.Add(new StringContent("en-CA"), "documentLanguage");

        var response = await _client.PostAsync("/api/documents/upload", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Upload_Accepts_Valid_Pdf_Metadata()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");

        Assert.NotEqual(Guid.Empty, upload.DocumentId);
        Assert.Equal("Receipt", upload.DocumentType);
    }

    [Fact]
    public async Task Upload_Accepts_Valid_Image_Metadata()
    {
        var upload = await UploadAsync("img.png", "image/png", "invoice", "fr-CA", "fakepng");

        Assert.NotEqual(Guid.Empty, upload.DocumentId);
        Assert.Equal("Invoice", upload.DocumentType);
    }

    [Fact]
    public async Task Get_Documents_Returns_Uploaded_Document()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");

        var response = await _client.GetAsync("/api/documents");
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();

        Assert.Contains(upload.DocumentId.ToString(), body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Get_Document_By_Id_Returns_Details()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");

        var response = await _client.GetAsync($"/api/documents/{upload.DocumentId}");
        response.EnsureSuccessStatusCode();
        var detail = await response.Content.ReadFromJsonAsync<DocumentDetailDto>();

        Assert.NotNull(detail);
        Assert.Equal(upload.DocumentId, detail!.Id);
        Assert.Equal("doc.pdf", detail.OriginalFileName);
    }

    [Fact]
    public async Task Upload_With_EnqueueProcessing_Transitions_To_Processing_Or_Terminal()
    {
        using var content = BuildUploadContent("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");
        content.Add(new StringContent("true"), "enqueueProcessing");

        var response = await _client.PostAsync("/api/documents/upload", content);
        response.EnsureSuccessStatusCode();
        var upload = await response.Content.ReadFromJsonAsync<UploadDocumentResponseDto>();

        Assert.NotNull(upload);
        var detailResponse = await _client.GetAsync($"/api/documents/{upload!.DocumentId}");
        detailResponse.EnsureSuccessStatusCode();
        var detail = await detailResponse.Content.ReadFromJsonAsync<DocumentDetailDto>();

        Assert.NotNull(detail);
        Assert.True(detail!.Status is "Processing" or "Completed" or "NeedsReview" or "Failed");
    }

    [Fact]
    public async Task Process_Handles_Test_Document_Using_Fake_Ocr_Provider()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");

        var response = await _client.PostAsync($"/api/documents/{upload.DocumentId}/process", content: null);
        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var detail = await response.Content.ReadFromJsonAsync<DocumentDetailDto>();

        Assert.NotNull(detail);
        Assert.Equal(upload.DocumentId, detail!.Id);
        Assert.Equal("Processing", detail.Status);

        var terminalStatus = await WaitForTerminalStatusAsync(upload.DocumentId);
        Assert.True(terminalStatus == "Completed" || terminalStatus == "NeedsReview");
    }

    [Fact]
    public async Task Get_Result_Returns_Structured_Result()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");
        var processResponse = await _client.PostAsync($"/api/documents/{upload.DocumentId}/process", content: null);
        Assert.Equal(HttpStatusCode.Accepted, processResponse.StatusCode);

        await WaitForTerminalStatusAsync(upload.DocumentId);

        var response = await _client.GetAsync($"/api/documents/{upload.DocumentId}/result");
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<DocumentResultDto>();

        Assert.NotNull(result);
        Assert.Equal(upload.DocumentId, result!.Document.Id);
        Assert.NotNull(result.StructuredExtractedFields);
        Assert.Equal("PDF Store", result.StructuredExtractedFields!.VendorName);
        Assert.Equal(114.98m, result.StructuredExtractedFields.Total);
    }

    [Fact]
    public async Task Update_Extracted_Fields_Records_Manual_Corrections()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");
        var processResponse = await _client.PostAsync($"/api/documents/{upload.DocumentId}/process", content: null);
        Assert.Equal(HttpStatusCode.Accepted, processResponse.StatusCode);

        await WaitForTerminalStatusAsync(upload.DocumentId);

        var update = new UpdateExtractedFieldsRequestDto
        {
            VendorName = "Edited Vendor",
            Total = 120.00m,
            DocumentDate = new DateTime(2026, 5, 31)
        };

        var updateResponse = await _client.PutAsJsonAsync($"/api/documents/{upload.DocumentId}/extracted-fields", update);
        updateResponse.EnsureSuccessStatusCode();

        var correctionsResponse = await _client.GetAsync($"/api/documents/{upload.DocumentId}/corrections");
        correctionsResponse.EnsureSuccessStatusCode();
        var corrections = await correctionsResponse.Content.ReadFromJsonAsync<List<ManualCorrectionDto>>();

        Assert.NotNull(corrections);
        Assert.NotEmpty(corrections!);
        Assert.Contains(corrections!, c => c.FieldName == "VendorName");
        Assert.Contains(corrections!, c => c.FieldName == "Total");
    }

    [Fact]
    public async Task Export_Json_Returns_Valid_Json()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");
        var processResponse = await _client.PostAsync($"/api/documents/{upload.DocumentId}/process", content: null);
        Assert.Equal(HttpStatusCode.Accepted, processResponse.StatusCode);

        await WaitForTerminalStatusAsync(upload.DocumentId);

        var response = await _client.GetAsync($"/api/documents/{upload.DocumentId}/export/json");
        response.EnsureSuccessStatusCode();
        Assert.Contains("application/json", response.Content.Headers.ContentType?.MediaType, StringComparison.OrdinalIgnoreCase);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var hasCamelCase = doc.RootElement.TryGetProperty("document", out var camelCaseDocument);
        var hasPascalCase = doc.RootElement.TryGetProperty("Document", out var pascalCaseDocument);
        Assert.True(hasCamelCase || hasPascalCase);

        var document = hasCamelCase ? camelCaseDocument : pascalCaseDocument;
        var id = document.TryGetProperty("id", out var camelCaseId)
            ? camelCaseId.GetGuid()
            : document.GetProperty("Id").GetGuid();

        Assert.Equal(upload.DocumentId, id);
    }

    [Fact]
    public async Task Export_Csv_Returns_TextCsv_With_Expected_Headers()
    {
        var upload = await UploadAsync("doc.pdf", "application/pdf", "receipt", "en-CA", "%PDF-1.4");
        var processResponse = await _client.PostAsync($"/api/documents/{upload.DocumentId}/process", content: null);
        Assert.Equal(HttpStatusCode.Accepted, processResponse.StatusCode);

        await WaitForTerminalStatusAsync(upload.DocumentId);

        var response = await _client.GetAsync($"/api/documents/{upload.DocumentId}/export/csv");
        response.EnsureSuccessStatusCode();
        Assert.Contains("text/csv", response.Content.Headers.ContentType?.MediaType, StringComparison.OrdinalIgnoreCase);

        var bytes = await response.Content.ReadAsByteArrayAsync();
        var csv = Encoding.UTF8.GetString(bytes);
        Assert.Contains("\"DocumentId\",\"DocumentType\",\"RequestedLanguage\"", csv, StringComparison.Ordinal);
        Assert.Contains("\"VendorName\"", csv, StringComparison.Ordinal);
        Assert.Contains(upload.DocumentId.ToString(), csv, StringComparison.OrdinalIgnoreCase);
    }

    private async Task<string> WaitForTerminalStatusAsync(Guid documentId)
    {
        for (var attempt = 0; attempt < 20; attempt++)
        {
            var response = await _client.GetAsync($"/api/documents/{documentId}");
            response.EnsureSuccessStatusCode();
            var detail = await response.Content.ReadFromJsonAsync<DocumentDetailDto>();
            Assert.NotNull(detail);

            if (detail!.Status is "Completed" or "NeedsReview" or "Failed")
            {
                return detail.Status;
            }

            await Task.Delay(100);
        }

        throw new TimeoutException($"Document {documentId} did not reach a terminal status in time.");
    }

    private async Task<UploadDocumentResponseDto> UploadAsync(string fileName, string contentType, string documentType, string documentLanguage, string payload)
    {
        using var content = BuildUploadContent(fileName, contentType, documentType, documentLanguage, payload);
        var response = await _client.PostAsync("/api/documents/upload", content);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Upload failed: {(int)response.StatusCode} {response.StatusCode} {error}");
        }

        var upload = await response.Content.ReadFromJsonAsync<UploadDocumentResponseDto>();
        Assert.NotNull(upload);
        return upload!;
    }

    private static MultipartFormDataContent BuildUploadContent(string fileName, string contentType, string documentType, string documentLanguage, string payload)
    {
        var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(Encoding.UTF8.GetBytes(payload));
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);

        content.Add(fileContent, "file", fileName);
        content.Add(new StringContent(documentType), "documentType");
        content.Add(new StringContent(documentLanguage), "documentLanguage");
        return content;
    }
}
