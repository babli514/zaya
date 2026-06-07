# Financial OCR Backend API

## API Usage

Base URL (local): `https://localhost:5001` or `http://localhost:5000`

### 1) Upload a document

`POST /api/documents/upload` accepts `multipart/form-data`:

- `file`: required, supported content types:
  - `application/pdf`
  - `image/png`
  - `image/jpeg`
  - `image/webp`
- `documentType`: required, values:
  - `receipt`
  - `invoice`
- `documentLanguage`: optional, values:
  - `auto`
  - `en-CA`
  - `fr-CA`
  - `bilingual-CA`

### 2) Specify document language

Use `documentLanguage` during upload to hint OCR and extraction behavior:

- `en-CA`: English Canadian documents
- `fr-CA`: French Canadian documents
- `bilingual-CA`: mixed English/French documents
- `auto`: let the system detect language from OCR text

### 3) How auto language detection works

When `documentLanguage=auto`, the pipeline infers language from extracted text patterns. Example indicators include English tokens (`receipt`, `invoice`, `gst`) and French tokens (`taxe`, `total tps`, `total tvq`).

### 4) Process uploaded document

Call `POST /api/documents/{id}/process` after upload.

Processing status values:

- `Pending`
- `Uploaded`
- `Processing`
- `Completed`
- `Failed`
- `NeedsReview`

### 5) Get structured result

Call `GET /api/documents/{id}/result`.

Result includes:

- Structured fields (vendor, dates, subtotal/taxes/total, line items)
- Validation output
- Bilingual warnings with both `messageEn` and `messageFr`
- Warning severities:
  - `Info`
  - `Warning`
  - `Error`
- OCR metadata:
  - `primaryOcrEngineUsed` (`primaryOcrEngine`)
  - `fallbackOcrEngineUsed` (`fallbackOcrEngine`)
  - `fallbackUsed`
  - `providerName`
  - `modelName`
  - `providerLatencyMs`

Supported Canadian tax labels normalized by the pipeline:

- `GST/TPS`
- `QST/TVQ`
- `HST/TVH`
- `PST/TVP`
- `Tip/Pourboire`

### 6) Export JSON and CSV

- JSON: `GET /api/documents/{id}/export/json`
- CSV: `GET /api/documents/{id}/export/csv`
- Line items CSV: `GET /api/documents/{id}/export/line-items.csv`

## OCR and Extraction Configuration

Configuration is in `appsettings.json` under `Ocr` and `FinancialExtraction`.

### VisionOcr section (Gemini Flash 3.1 Lite preferred fallback)

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
        "ApiKey": "USE_USER_SECRETS_OR_ENV_VAR",
        "Endpoint": "",
        "TimeoutSeconds": 60,
        "MaxRetries": 2
      }
    }
  }
}
```

### FinancialExtraction section (Gemini Flash 3.1 Lite in Hybrid mode)

```json
{
  "FinancialExtraction": {
    "Mode": "Hybrid",
    "GeminiFlashLite": {
      "Enabled": true,
      "ProviderName": "GoogleGemini",
      "Model": "CONFIGURE_ACTUAL_MODEL_ID_HERE",
      "ApiKey": "USE_USER_SECRETS_OR_ENV_VAR",
      "Endpoint": "",
      "TimeoutSeconds": 60,
      "MaxRetries": 2
    }
  }
}
```

`FinancialExtraction.Mode` supported values:

- `RuleBased`
- `GeminiFlashLite`
- `Llm`
- `Hybrid`

### Native PDF text extraction

Enable in:

```json
{
  "Ocr": {
    "EnableNativePdfText": true
  }
}
```

### Bilingual Tesseract configuration

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

Language codes used:

- `eng`
- `fra`
- `eng+fra`

### Local file storage configuration

```json
{
  "DocumentUpload": {
    "RootFolder": "App_Data/uploads",
    "MaxFileSizeMb": 10
  }
}
```

## Security Guidance

- Do not commit Gemini API keys.
- Use .NET user-secrets for local development.
- Use environment variables or a secret manager in deployment.
- Do not log full OCR text for sensitive documents.
- Do not log financial document images.
- Do not commit real invoices, receipts, statements, or OCR outputs.

Example local user-secrets commands:

```bash
dotnet user-secrets set "Ocr:VisionOcr:GeminiFlashLite:ApiKey" "<your-key>"
dotnet user-secrets set "FinancialExtraction:GeminiFlashLite:ApiKey" "<your-key>"
```

## Sample curl Commands

### Upload English Canadian receipt

```bash
curl -X POST "http://localhost:5000/api/documents/upload" \
  -F "file=@./samples/receipt-en.pdf;type=application/pdf" \
  -F "documentType=receipt" \
  -F "documentLanguage=en-CA"
```

### Upload French Canadian receipt

```bash
curl -X POST "http://localhost:5000/api/documents/upload" \
  -F "file=@./samples/recu-fr.jpg;type=image/jpeg" \
  -F "documentType=receipt" \
  -F "documentLanguage=fr-CA"
```

### Upload bilingual invoice

```bash
curl -X POST "http://localhost:5000/api/documents/upload" \
  -F "file=@./samples/invoice-bilingual.png;type=image/png" \
  -F "documentType=invoice" \
  -F "documentLanguage=bilingual-CA"
```

### Process document

```bash
curl -X POST "http://localhost:5000/api/documents/{documentId}/process"
```

### Get result

```bash
curl "http://localhost:5000/api/documents/{documentId}/result"
```

### Download CSV

```bash
curl "http://localhost:5000/api/documents/{documentId}/export/csv" -o result.csv
```
