# OCR Evaluation Harness

This folder contains a dedicated evaluation harness for comparing OCR quality and downstream structured extraction quality across:

- NativePdfText
- Tesseract
- GeminiFlashLite

Scope is limited to redacted or synthetic Canadian financial documents.

Do not add real sensitive financial documents.

## Structure

- `samples/english-receipts/`
- `samples/french-receipts/`
- `samples/bilingual-invoices/`
- `expected/expected-results.json`
- `evaluation-results.json` (generated)
- `evaluation-summary.csv` (generated)

## Add redacted sample documents

1. Add only redacted or synthetic documents.
2. Keep language/type aligned with folder:
   - English receipts in `samples/english-receipts/`
   - French receipts in `samples/french-receipts/`
   - Bilingual invoices in `samples/bilingual-invoices/`
3. Use relative paths in `expected/expected-results.json`.

Example path value:

`english-receipts/sample-english-redacted-001.pdf`

## Define expected structured results

Edit `expected/expected-results.json` under `documents`.

Per sample, define:

- `sampleRelativePath`
- `documentType` (`Receipt` or `Invoice`)
- `documentLanguage` (`EnglishCanada`, `FrenchCanada`, `BilingualCanada`)
- `expected` fields:
  - `vendorName`
  - `documentDate`
  - `total`
  - `subtotal`
  - `gst`
  - `qst`
  - `documentNumber`

## Run evaluation

From repository root:

```bash
dotnet test backend/tests/Api.Tests/Api.Tests.csproj --filter EvaluationHarness_Generates_Results_And_Summary
```

By default, Gemini API calls are disabled.

To explicitly allow live Gemini execution:

```bash
set EVAL_ENABLE_GEMINI_API=true
set EVAL_GEMINI_API_KEY=your_key
set EVAL_GEMINI_MODEL=your_model
set EVAL_GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models
```

Optionally set Tesseract traineddata path:

```bash
set EVAL_TESSDATA_PATH=absolute_path_to_tessdata
```

## Outputs

- `evaluation-results.json`
  - per-document and per-provider rows with:
    - vendor match
    - date match
    - total match
    - subtotal match
    - GST/TPS match
    - QST/TVQ match
    - document number match
    - validation success
    - confidence
    - latency
    - estimated cost
- `evaluation-summary.csv`
  - provider-level metrics:
    - field-level accuracy
    - amount accuracy
    - date accuracy
    - validation pass rate
    - needs review rate
    - average latency
    - estimated cost per successful document

## Interpreting results

- Field-level and amount accuracy reflect extraction correctness against expected results.
- Validation pass rate indicates accounting consistency and required-field completeness.
- NeedsReview rate approximates operational manual-review burden.
- Average latency and estimated cost per successful document quantify throughput/cost trade-offs.

## Comparing Gemini Flash 3.1 Lite against cheaper providers

1. Run evaluation with Gemini disabled to baseline NativePdfText and Tesseract.
2. Run again with Gemini enabled for the same sample set.
3. Compare:
   - gains in field/date/amount accuracy
   - validation and needs-review improvements
   - added latency and estimated cost
4. Decide if Gemini should be used always, only as fallback, or only for difficult samples.
