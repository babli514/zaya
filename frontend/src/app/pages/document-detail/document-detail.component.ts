import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { DocumentDetailDto, DocumentResultDto, DocumentService, ValidationWarningDto } from '../../services/document.service';

type UiLanguage = 'en' | 'fr';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Loading document details...</div>

      <div *ngIf="!loading && loadError" class="not-found">
        <p>{{ loadError }}</p>
        <a routerLink="/documents" class="btn btn-secondary">Back to list</a>
      </div>

      <div *ngIf="!loading && document" class="detail-section">
        <div class="header">
          <div>
            <h1>{{ document.originalFileName }}</h1>
            <p class="subtitle">Document ID: {{ document.id }}</p>
          </div>
          <a routerLink="/documents" class="btn btn-secondary">Back to list</a>
        </div>

        <div *ngIf="isNeedsReview" class="status-callout status-needs-review">
          This document requires manual review before final approval.
        </div>

        <div *ngIf="isFailed" class="status-callout status-failed">
          <strong>Processing failed:</strong> {{ failureReason }}
        </div>

        <div class="badge-row">
          <span class="badge" [ngClass]="getStatusBadgeClass(document.status)">{{ document.status }}</span>
          <span class="badge badge-engine" *ngFor="let badge of engineBadges">{{ badge }}</span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label>File name</label>
            <p>{{ document.originalFileName }}</p>
          </div>
          <div class="info-item">
            <label>Document type</label>
            <p>{{ document.documentType }}</p>
          </div>
          <div class="info-item">
            <label>Requested document language</label>
            <p>{{ getRequestedLanguageLabel(document.documentLanguage) }}</p>
          </div>
          <div class="info-item">
            <label>Detected document language</label>
            <p>{{ getDetectedLanguageLabel() }}</p>
          </div>
          <div class="info-item">
            <label>Status</label>
            <p>{{ document.status }}</p>
          </div>
          <div class="info-item">
            <label>Uploaded date</label>
            <p>{{ formatDate(document.uploadedAtUtc) }}</p>
          </div>
          <div class="info-item">
            <label>Processed date</label>
            <p>{{ formatDate(document.processedAtUtc) }}</p>
          </div>
          <div class="info-item">
            <label>Primary OCR engine used</label>
            <p>{{ result?.primaryOcrEngineUsed || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Fallback OCR engine used</label>
            <p>{{ result?.fallbackOcrEngineUsed || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Fallback used</label>
            <p>{{ result?.fallbackUsed ? 'Yes' : 'No' }}</p>
          </div>
          <div class="info-item">
            <label>Provider name</label>
            <p>{{ result?.providerName || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Model name</label>
            <p>{{ result?.modelName || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Provider latency ms</label>
            <p>{{ result?.providerLatencyMs ?? '-' }}</p>
          </div>
          <div class="info-item">
            <label>Overall confidence</label>
            <p>{{ formatConfidence(result?.confidence) }}</p>
          </div>
        </div>

        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            *ngIf="isUploaded"
            [disabled]="actionLoading"
            (click)="processDocument()"
          >
            {{ actionLoading ? 'Processing...' : 'Process' }}
          </button>

          <button
            type="button"
            class="btn btn-primary"
            *ngIf="isFailed"
            [disabled]="actionLoading"
            (click)="processDocument()"
          >
            {{ actionLoading ? 'Reprocessing...' : 'Reprocess' }}
          </button>

          <a [routerLink]="['/documents', document.id, 'review']" class="btn btn-outline">Review/Edit extracted fields</a>
          <a [href]="jsonExportUrl" class="btn btn-outline" download>Download JSON</a>
          <a [href]="csvExportUrl" class="btn btn-outline" download>Download CSV</a>
          <button type="button" class="btn btn-outline" [disabled]="rawTextLoading" (click)="toggleRawText()">
            {{ rawTextVisible ? 'Hide raw OCR text' : 'View raw OCR text' }}
          </button>
        </div>

        <div *ngIf="actionError" class="alert alert-danger">{{ actionError }}</div>

        <div *ngIf="rawTextVisible" class="raw-text">
          <h3>Raw OCR text</h3>
          <p *ngIf="rawTextLoading">Loading raw OCR text...</p>
          <pre *ngIf="!rawTextLoading">{{ rawText || 'No raw OCR text available.' }}</pre>
        </div>

        <div *ngIf="result?.validationResult" class="validation-summary">
          <h3>Validation summary</h3>
          <p>{{ result.validationResult.summary }}</p>
        </div>

        <div *ngIf="result && result.bilingualWarnings.length > 0" class="warnings">
          <h3>Validation warnings</h3>
          <div class="warning-item" *ngFor="let warning of result.bilingualWarnings" [ngClass]="getWarningSeverityClass(warning)">
            <div class="warning-meta">
              <span class="warning-code">{{ warning.code }}</span>
              <span class="warning-severity">{{ warning.severity }}</span>
            </div>
            <p>{{ getWarningMessage(warning) }}</p>
            <p *ngIf="warning.fieldName" class="warning-field">Field: {{ warning.fieldName }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 24px;
    }

    .loading,
    .not-found {
      text-align: center;
      padding: 40px;
      color: #667085;
      background: #fff;
      border-radius: 10px;
      border: 1px solid #eaecf0;
    }

    .detail-section {
      background: white;
      border-radius: 10px;
      padding: 28px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      border: 1px solid #eaecf0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 12px;
      margin-bottom: 16px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .subtitle {
      margin: 6px 0 0;
      color: #667085;
      font-size: 13px;
    }

    .status-callout {
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
      font-weight: 500;
    }

    .status-needs-review {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      color: #9a3412;
    }

    .status-failed {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0 18px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
    }

    .badge-uploaded {
      background: #eff8ff;
      color: #175cd3;
    }

    .badge-processing {
      background: #ecfdf3;
      color: #027a48;
    }

    .badge-completed {
      background: #ecfdf3;
      color: #027a48;
    }

    .badge-failed {
      background: #fef3f2;
      color: #b42318;
    }

    .badge-needs-review {
      background: #fff7ed;
      color: #b54708;
    }

    .badge-unknown {
      background: #f2f4f7;
      color: #475467;
    }

    .badge-engine {
      background: #f5f3ff;
      color: #6941c6;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .info-item {
      padding: 14px;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .info-item label {
      display: block;
      font-weight: 700;
      margin-bottom: 6px;
      color: #475467;
      font-size: 13px;
    }

    .info-item p {
      margin: 0;
      color: #111827;
      font-size: 14px;
      word-break: break-word;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
    }

    .btn {
      padding: 10px 14px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      border: 1px solid transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .btn-secondary {
      background-color: #475467;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #344054;
    }

    .btn-primary {
      background-color: #175cd3;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1849a9;
    }

    .btn-outline {
      border-color: #d0d5dd;
      background: #fff;
      color: #344054;
    }

    .btn-outline:hover {
      background: #f9fafb;
    }

    .alert {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .alert-danger {
      background-color: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .raw-text,
    .validation-summary,
    .warnings {
      margin-top: 16px;
      padding: 16px;
      border: 1px solid #eaecf0;
      border-radius: 8px;
      background: #fff;
    }

    .raw-text h3,
    .validation-summary h3,
    .warnings h3 {
      margin: 0 0 10px;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      font-size: 13px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      max-height: 320px;
      overflow: auto;
    }

    .warning-item {
      border-radius: 8px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      margin-bottom: 10px;
    }

    .warning-item:last-child {
      margin-bottom: 0;
    }

    .warning-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 6px;
    }

    .warning-code,
    .warning-severity {
      border-radius: 999px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 700;
      background: #f3f4f6;
      color: #111827;
    }

    .warning-field {
      margin: 4px 0 0;
      font-size: 12px;
      color: #6b7280;
    }

    .warning-critical {
      border-color: #fecaca;
      background: #fef2f2;
    }

    .warning-warning {
      border-color: #fed7aa;
      background: #fffbeb;
    }

    .warning-info {
      border-color: #bfdbfe;
      background: #eff6ff;
    }

    @media (max-width: 900px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class DocumentDetailComponent implements OnInit {
  document: DocumentDetailDto | null = null;
  result: DocumentResultDto | null = null;
  loading = true;
  actionLoading = false;
  rawTextVisible = false;
  rawTextLoading = false;
  rawText = '';
  loadError = '';
  actionError = '';
  uiLanguage: UiLanguage = 'en';
  jsonExportUrl = '';
  csvExportUrl = '';
  engineBadges: string[] = [];

  constructor(
    private readonly documentService: DocumentService,
    private readonly route: ActivatedRoute
  ) {}

  get isUploaded(): boolean {
    return this.document?.status === 'Uploaded';
  }

  get isFailed(): boolean {
    return this.document?.status === 'Failed';
  }

  get isNeedsReview(): boolean {
    return this.document?.status === 'NeedsReview';
  }

  get failureReason(): string {
    return this.result?.latestExtractionJob?.errorMessage || 'No failure details were provided by the backend.';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadDocument(id);
      }
    });
  }

  loadDocument(id: string): void {
    this.loading = true;
    this.loadError = '';
    this.actionError = '';
    this.rawTextVisible = false;
    this.rawText = '';

    forkJoin({
      document: this.documentService.getDocument(id),
      result: this.documentService.getDocumentResult(id).pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ document, result }) => {
        this.document = document;
        this.result = result;
        this.jsonExportUrl = this.documentService.getJsonExportUrl(document.id);
        this.csvExportUrl = this.documentService.getCsvExportUrl(document.id);
        this.engineBadges = this.buildEngineBadges(result);
        this.loading = false;
      },
      error: () => {
        this.document = null;
        this.result = null;
        this.loading = false;
        this.loadError = 'Document not found or could not be loaded.';
      }
    });
  }

  processDocument(): void {
    if (!this.document) {
      return;
    }

    this.actionLoading = true;
    this.actionError = '';

    this.documentService.processDocument(this.document.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.loadDocument(this.document!.id);
      },
      error: (err) => {
        this.actionLoading = false;
        this.actionError = this.getErrorMessage(err);
      }
    });
  }

  toggleRawText(): void {
    if (!this.document) {
      return;
    }

    if (this.rawTextVisible) {
      this.rawTextVisible = false;
      return;
    }

    this.rawTextVisible = true;

    if (this.rawText.length > 0) {
      return;
    }

    this.rawTextLoading = true;
    this.documentService.getRawText(this.document.id).subscribe({
      next: (response) => {
        this.rawText = response.rawText;
        this.rawTextLoading = false;
      },
      error: (err) => {
        this.rawTextLoading = false;
        this.rawText = this.getErrorMessage(err);
      }
    });
  }

  getRequestedLanguageLabel(value: string): string {
    const map: Record<string, string> = {
      Unknown: 'Auto-detect',
      EnglishCanada: 'English Canada',
      FrenchCanada: 'Français Canada',
      BilingualCanada: 'Bilingual Canada'
    };

    return map[value] ?? value;
  }

  getDetectedLanguageLabel(): string {
    if (!this.result || !this.result.detectedDocumentLanguage) {
      return '-';
    }

    return this.getRequestedLanguageLabel(this.result.detectedDocumentLanguage);
  }

  formatDate(value?: string | null): string {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString();
  }

  formatConfidence(value?: number | null): string {
    if (typeof value !== 'number') {
      return '-';
    }

    return `${(value * 100).toFixed(1)}%`;
  }

  getWarningMessage(warning: ValidationWarningDto): string {
    if (this.uiLanguage === 'fr' && warning.messageFr) {
      return warning.messageFr;
    }

    return warning.messageEn;
  }

  getWarningSeverityClass(warning: ValidationWarningDto): string {
    const value = warning.severity.toLowerCase();

    if (value.includes('critical') || value.includes('error') || value.includes('high')) {
      return 'warning-critical';
    }

    if (value.includes('warn') || value.includes('medium')) {
      return 'warning-warning';
    }

    return 'warning-info';
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Uploaded: 'badge-uploaded',
      Processing: 'badge-processing',
      Completed: 'badge-completed',
      Failed: 'badge-failed',
      NeedsReview: 'badge-needs-review'
    };

    return map[status] ?? 'badge-unknown';
  }

  private buildEngineBadges(result: DocumentResultDto | null): string[] {
    if (!result) {
      return [];
    }

    const badges = new Set<string>();
    const primary = (result.primaryOcrEngineUsed || '').toLowerCase();
    const fallback = (result.fallbackOcrEngineUsed || '').toLowerCase();
    const model = (result.modelName || '').toLowerCase();

    if (primary.includes('pdf') || primary.includes('native')) {
      badges.add('Native PDF Text');
    }

    if (primary.includes('tesseract') || fallback.includes('tesseract')) {
      badges.add('Tesseract');
    }

    if (primary.includes('gemini') || fallback.includes('gemini') || model.includes('gemini')) {
      badges.add('Gemini Flash Lite');
    }

    if (result.fallbackUsed) {
      badges.add('Vision Fallback');
    }

    return Array.from(badges);
  }

  private getErrorMessage(err: unknown): string {
    if (typeof err === 'string' && err.trim().length > 0) {
      return err;
    }

    if (err && typeof err === 'object') {
      const e = err as { error?: unknown; message?: string };
      if (typeof e.error === 'string' && e.error.trim().length > 0) {
        return e.error;
      }

      if (e.error && typeof e.error === 'object') {
        const message = (e.error as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim().length > 0) {
          return message;
        }
      }

      if (typeof e.message === 'string' && e.message.trim().length > 0) {
        return e.message;
      }
    }

    return 'Operation failed. Please try again.';
  }
}
