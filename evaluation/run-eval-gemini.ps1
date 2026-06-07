param(
    [Parameter(Mandatory = $true)]
    [string]$GeminiApiKey,

    [Parameter(Mandatory = $true)]
    [string]$GeminiModel,

    [string]$GeminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models",
    [string]$TessdataPath,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($GeminiApiKey)) {
    throw "GeminiApiKey is required."
}

if ([string]::IsNullOrWhiteSpace($GeminiModel)) {
    throw "GeminiModel is required."
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$env:EVAL_ENABLE_GEMINI_API = "true"
$env:EVAL_GEMINI_API_KEY = $GeminiApiKey
$env:EVAL_GEMINI_MODEL = $GeminiModel
$env:EVAL_GEMINI_ENDPOINT = $GeminiEndpoint

if (-not [string]::IsNullOrWhiteSpace($TessdataPath)) {
    $env:EVAL_TESSDATA_PATH = $TessdataPath
}

if ($DryRun) {
    $maskedKey = if ($GeminiApiKey.Length -le 4) { "****" } else { "****" + $GeminiApiKey.Substring($GeminiApiKey.Length - 4) }
    Write-Host "Dry run only. Configuration is valid."
    Write-Host "Repo root: $repoRoot"
    Write-Host "EVAL_ENABLE_GEMINI_API: $env:EVAL_ENABLE_GEMINI_API"
    Write-Host "EVAL_GEMINI_MODEL: $env:EVAL_GEMINI_MODEL"
    Write-Host "EVAL_GEMINI_ENDPOINT: $env:EVAL_GEMINI_ENDPOINT"
    Write-Host "EVAL_GEMINI_API_KEY: $maskedKey"
    if (-not [string]::IsNullOrWhiteSpace($TessdataPath)) {
        Write-Host "EVAL_TESSDATA_PATH: $env:EVAL_TESSDATA_PATH"
    }
    Write-Host "No tests were executed."
    exit 0
}

dotnet test backend/tests/Api.Tests/Api.Tests.csproj --filter EvaluationHarness_Generates_Results_And_Summary
if ($LASTEXITCODE -ne 0) {
    throw "Evaluation harness test failed with exit code $LASTEXITCODE."
}

$resultsPath = Join-Path $PSScriptRoot "evaluation-results.json"
$summaryPath = Join-Path $PSScriptRoot "evaluation-summary.csv"
Write-Host "Gemini-enabled evaluation completed."
Write-Host "Results JSON: $resultsPath"
Write-Host "Summary CSV:  $summaryPath"
