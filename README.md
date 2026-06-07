# Financial OCR Micro-SaaS (Bilingual Canadian MVP)

## Project overview

This project is a bilingual Canadian Financial OCR MVP for receipts and invoices. It provides:
- Document upload and processing
- OCR routing with fallback
- Structured financial field extraction
- Validation warnings with English and French messages
- Manual correction workflow
- JSON and CSV export

The MVP is focused on stability, bilingual extraction quality, and production-ready configuration for Gemini Flash 3.1 Lite as an optional provider.

## Bilingual Canadian English/French features

- Upload mode supports Auto, English Canada, Français Canada, and Bilingual Canada
- Extraction supports English, French, and mixed labels in the same document
- Validation warnings include both `messageEn` and `messageFr`
- UI displays requested and detected document languages
- UI displays bilingual warnings during detail and review workflows
- Tax labels are normalized across English/French variants

## Supported document types

- Receipt
- Invoice

## Supported language modes

- Auto
- English Canada (`en-CA`)
- Français Canada (`fr-CA`)
- Bilingual Canada (`bilingual-CA`)

## Supported tax labels

- GST/TPS
- QST/TVQ
- HST/TVH
- PST/TVP
- Tip/Pourboire

## Architecture summary

- **Frontend**: Angular standalone app (`frontend`)
- **Backend**: ASP.NET Core Web API (`backend/src/Api`)
- **Application layer**: DTOs and services (`backend/src/Application`)
- **Domain layer**: entities and enums (`backend/src/Domain`)
- **Infrastructure layer**: EF Core persistence (`backend/src/Infrastructure`)
- **Database**: SQL Server (LocalDB by default)

Key flow:
1. Upload document
2. Route OCR by file type/language mode
3. Extract structured fields
4. Validate and generate bilingual warnings
5. Review/correct fields in Angular
6. Export JSON/CSV

## Backend setup

From repository root:

```bash
dotnet restore backend/FinancialOCR.sln
dotnet build backend/FinancialOCR.sln
```

Run API:

```bash
dotnet run --project backend/src/Api/Api.csproj
```

Swagger is available in Development at:
- `http://localhost:5000/`
- `https://localhost:5001/`

## Frontend setup

```bash
cd frontend
npm install
npm run build
npm start
```

App URL:
- `http://localhost:4200`

## Database setup

Default connection string uses SQL Server LocalDB (`appsettings.json`).

Migrations are applied on API startup (except Testing environment).

If needed:

```bash
dotnet ef database update --project backend/src/Infrastructure --startup-project backend/src/Api
```

## Native PDF text extraction setup

Enable native PDF OCR route in `backend/src/Api/appsettings.json`:

```json
{
  "Ocr": {
    "EnableNativePdfText": true
  }
}
```

## Tesseract setup for eng, fra, and eng+fra

In `backend/src/Api/appsettings.json`:

```json
{
  "Ocr": {
    "EnableTesseract": true,
    "TesseractDataPath": "App_Data/tessdata",
    "EnglishLanguage": "eng",
    "FrenchLanguage": "fra",
    "BilingualLanguage": "eng+fra",
    "DefaultLanguage": "eng+fra"
  }
}
```

Ensure tessdata includes:
- `eng.traineddata`
- `fra.traineddata`

## Gemini Flash 3.1 Lite setup as preferred vision fallback

Configure in `Ocr:VisionOcr`:

```json
{
  "Ocr": {
    "VisionOcr": {
      "PreferredProvider": "GeminiFlashLite",
      "FallbackEnabled": true,
      "GeminiFlashLite": {
        "Enabled": true,
        "ProviderName": "GoogleGemini",
        "Model": "CONFIGURE_ACTUAL_MODEL_ID_HERE",
        "ApiKey": "",
        "Endpoint": "",
        "TimeoutSeconds": 60,
        "MaxRetries": 2
      }
    }
  }
}
```

Behavior:
- If disabled, provider is never used
- If enabled with missing required values, API returns a clear configuration error

## Gemini Flash 3.1 Lite setup for optional structured extraction

Configure in `FinancialExtraction`:

```json
{
  "FinancialExtraction": {
    "Mode": "RuleBased",
    "GeminiFlashLite": {
      "Enabled": false,
      "ProviderName": "GoogleGemini",
      "Model": "CONFIGURE_ACTUAL_MODEL_ID_HERE",
      "ApiKey": "",
      "Endpoint": "",
      "TimeoutSeconds": 60,
      "MaxRetries": 2
    }
  }
}
```

Supported modes:
- `RuleBased`
- `GeminiFlashLite`
- `Llm`
- `Hybrid`

## Secret management (.NET user-secrets or environment variables)

Do not commit secrets to source control.

User-secrets example:

```bash
dotnet user-secrets set "Ocr:VisionOcr:GeminiFlashLite:ApiKey" "<your-key>" --project backend/src/Api/Api.csproj
dotnet user-secrets set "FinancialExtraction:GeminiFlashLite:ApiKey" "<your-key>" --project backend/src/Api/Api.csproj
```

Environment variable examples:

```bash
setx Ocr__VisionOcr__GeminiFlashLite__ApiKey "<your-key>"
setx FinancialExtraction__GeminiFlashLite__ApiKey "<your-key>"
```

Security defaults:
- Gemini API keys are not logged by default
- Full OCR text/images are not logged by default

## Configuration options

Primary configuration files:
- `backend/src/Api/appsettings.json`
- `backend/src/Api/appsettings.Development.json`

Main sections:
- `ConnectionStrings`
- `DocumentUpload`
- `Ocr`
- `FinancialExtraction`
- `ApiSecurity`
- `Logging`

## API examples

Upload English receipt:

```bash
curl -X POST "http://localhost:5000/api/documents/upload" \
  -H "X-API-Key: dev-local-api-key" \
  -F "file=@./samples/receipt-en.pdf;type=application/pdf" \
  -F "documentType=receipt" \
  -F "documentLanguage=en-CA"
```

Upload French receipt:

```bash
curl -X POST "http://localhost:5000/api/documents/upload" \
  -H "X-API-Key: dev-local-api-key" \
  -F "file=@./samples/recu-fr.jpg;type=image/jpeg" \
  -F "documentType=receipt" \
  -F "documentLanguage=fr-CA"
```

Upload bilingual invoice:

```bash
curl -X POST "http://localhost:5000/api/documents/upload" \
  -H "X-API-Key: dev-local-api-key" \
  -F "file=@./samples/invoice-bilingual.png;type=image/png" \
  -F "documentType=invoice" \
  -F "documentLanguage=bilingual-CA"
```

Process:

```bash
curl -X POST "http://localhost:5000/api/documents/{documentId}/process" \
  -H "X-API-Key: dev-local-api-key"
```

Result:

```bash
curl "http://localhost:5000/api/documents/{documentId}/result" \
  -H "X-API-Key: dev-local-api-key"
```

Export JSON:

```bash
curl "http://localhost:5000/api/documents/{documentId}/export/json" \
  -H "X-API-Key: dev-local-api-key" -o result.json
```

Export CSV:

```bash
curl "http://localhost:5000/api/documents/{documentId}/export/csv" \
  -H "X-API-Key: dev-local-api-key" -o result.csv
```

## Known limitations

- Gemini Flash 3.1 Lite integration points are configuration-ready, but live SDK/API calls must be completed before production use
- OCR quality depends on source scan quality
- Very noisy documents may still require manual review
- UI labels are primarily English (warnings/messages support bilingual content)
- Batch processing endpoint is reserved and not fully implemented

## Future roadmap

- More OCR providers
- Full UI localization
- Bank statement OCR
- Credit card statement OCR
- Batch processing
- Multi-tenant auth
- Bookkeeping cleanup
