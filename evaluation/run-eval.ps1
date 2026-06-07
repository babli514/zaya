param(
    [switch]$EnableGeminiApi,
    [string]$GeminiApiKey,
    [string]$GeminiModel,
    [string]$GeminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models",
    [string]$TessdataPath
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if ($EnableGeminiApi) {
    $env:EVAL_ENABLE_GEMINI_API = "true"
    if (-not [string]::IsNullOrWhiteSpace($GeminiApiKey)) {
        $env:EVAL_GEMINI_API_KEY = $GeminiApiKey
    }
    if (-not [string]::IsNullOrWhiteSpace($GeminiModel)) {
        $env:EVAL_GEMINI_MODEL = $GeminiModel
    }
    if (-not [string]::IsNullOrWhiteSpace($GeminiEndpoint)) {
        $env:EVAL_GEMINI_ENDPOINT = $GeminiEndpoint
    }
} else {
    $env:EVAL_ENABLE_GEMINI_API = "false"
}

if (-not [string]::IsNullOrWhiteSpace($TessdataPath)) {
    $env:EVAL_TESSDATA_PATH = $TessdataPath
}

dotnet test backend/tests/Api.Tests/Api.Tests.csproj --filter EvaluationHarness_Generates_Results_And_Summary
if ($LASTEXITCODE -ne 0) {
    throw "Evaluation harness test failed with exit code $LASTEXITCODE."
}

$resultsPath = Join-Path $PSScriptRoot "evaluation-results.json"
$summaryPath = Join-Path $PSScriptRoot "evaluation-summary.csv"
Write-Host "Evaluation completed."
Write-Host "Results JSON: $resultsPath"
Write-Host "Summary CSV:  $summaryPath"
