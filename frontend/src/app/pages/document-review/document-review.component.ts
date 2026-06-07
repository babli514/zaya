import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import {
  DetectedLanguageValue,
  DocumentResultDto,
  DocumentService,
  UpdateExtractedFieldsRequestDto,
  ValidationWarningDto
} from '../../services/document.service';

type UiLanguage = 'en' | 'fr';

type ReviewFormGroup = FormGroup<{
  vendorName: FormControl<string>;
  customerName: FormControl<string>;
  documentNumber: FormControl<string>;
  documentDate: FormControl<string>;
  dueDate: FormControl<string>;
  currency: FormControl<string>;
  subtotal: FormControl<string>;
  gst: FormControl<string>;
  qst: FormControl<string>;
  hst: FormControl<string>;
  pst: FormControl<string>;
  tip: FormControl<string>;
  total: FormControl<string>;
  detectedLanguage: FormControl<DetectedLanguageValue>;
}>;

@Component({
  selector: 'app-document-review',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Loading document review...</div>

      <div *ngIf="!loading && loadError" class="not-found">
        <p>{{ loadError }}</p>
        <a routerLink="/documents" class="btn btn-secondary">Back to list</a>
      </div>

      <div *ngIf="!loading && result" class="review-section">
        <div class="review-layout">
          <aside class="preview-panel">
            <h3>Document preview</h3>
            <div class="preview-frame" *ngIf="isPdfPreview">
              <iframe [src]="safePreviewUrl" title="Document preview" (error)="onPreviewError()"></iframe>
            </div>
            <div class="preview-frame" *ngIf="isImagePreview">
              <img [src]="previewUrl" [alt]="result.document.originalFileName" (error)="onPreviewError()" />
            </div>
            <div class="preview-fallback" *ngIf="previewFailed || (!isPdfPreview && !isImagePreview)">
              <p>Preview is not available for this file type.</p>
              <div class="preview-actions">
                <a [href]="previewUrl" class="btn btn-outline" target="_blank" rel="noopener">Open file</a>
                <a [href]="previewUrl" class="btn btn-outline" download>Download file</a>
              </div>
            </div>
          </aside>

          <div class="review-content">
            <div class="header">
          <div>
            <h1>Review {{ result.document.originalFileName }}</h1>
            <p class="meta">Document ID: {{ result.document.id }}</p>
          </div>
          <a [routerLink]="['/documents', result.document.id]" class="btn btn-secondary">Back to detail</a>
        </div>

        <div class="actions top-actions">
          <button type="button" class="btn btn-primary" [disabled]="saving || form.invalid" (click)="saveCorrections()">
            {{ saving ? 'Saving...' : 'Save corrections' }}
          </button>
          <a [href]="jsonExportUrl" class="btn btn-outline" download>Download JSON</a>
          <a [href]="csvExportUrl" class="btn btn-outline" download>Download CSV</a>
        </div>

        <div class="status-card" *ngIf="result.validationResult">
          <h3>Current validation status</h3>
          <p>
            <strong>{{ result.validationResult.isValidated ? 'Validated' : 'Needs review' }}</strong>
            — {{ result.validationResult.summary }}
          </p>
        </div>

        <div class="status-card" *ngIf="!result.validationResult">
          <h3>Current validation status</h3>
          <p>No validation result is currently available.</p>
        </div>

        <form [formGroup]="form" class="form-grid" (ngSubmit)="saveCorrections()">
          <div class="field full-width">
            <label for="vendorName">VendorName</label>
            <input id="vendorName" type="text" formControlName="vendorName" />
            <p *ngIf="form.controls.vendorName.touched && form.controls.vendorName.invalid" class="field-error">VendorName is required.</p>
          </div>

          <div class="field">
            <label for="customerName">CustomerName</label>
            <input id="customerName" type="text" formControlName="customerName" />
          </div>

          <div class="field">
            <label for="documentNumber">DocumentNumber</label>
            <input id="documentNumber" type="text" formControlName="documentNumber" />
          </div>

          <div class="field">
            <label for="documentDate">DocumentDate</label>
            <input id="documentDate" type="date" formControlName="documentDate" />
          </div>

          <div class="field">
            <label for="dueDate">DueDate</label>
            <input id="dueDate" type="date" formControlName="dueDate" />
          </div>

          <div class="field">
            <label for="currency">Currency</label>
            <input id="currency" type="text" formControlName="currency" maxlength="3" />
          </div>

          <div class="field">
            <label for="detectedLanguage">DetectedLanguage</label>
            <select id="detectedLanguage" formControlName="detectedLanguage">
              <option *ngFor="let option of languageOptions" [value]="option.value">{{ option.label }}</option>
            </select>
          </div>

          <div class="field">
            <label for="subtotal">Subtotal</label>
            <input id="subtotal" type="text" inputmode="decimal" formControlName="subtotal" (blur)="formatMoneyControl('subtotal')" />
          </div>

          <div class="field">
            <label for="gst">GST/TPS</label>
            <input id="gst" type="text" inputmode="decimal" formControlName="gst" (blur)="formatMoneyControl('gst')" />
          </div>

          <div class="field">
            <label for="qst">QST/TVQ</label>
            <input id="qst" type="text" inputmode="decimal" formControlName="qst" (blur)="formatMoneyControl('qst')" />
          </div>

          <div class="field">
            <label for="hst">HST/TVH</label>
            <input id="hst" type="text" inputmode="decimal" formControlName="hst" (blur)="formatMoneyControl('hst')" />
          </div>

          <div class="field">
            <label for="pst">PST/TVP</label>
            <input id="pst" type="text" inputmode="decimal" formControlName="pst" (blur)="formatMoneyControl('pst')" />
          </div>

          <div class="field">
            <label for="tip">Tip/Pourboire</label>
            <input id="tip" type="text" inputmode="decimal" formControlName="tip" (blur)="formatMoneyControl('tip')" />
          </div>

          <div class="field">
            <label for="total">Total</label>
            <input id="total" type="text" inputmode="decimal" formControlName="total" (blur)="formatMoneyControl('total')" />
          </div>
        </form>

        <div *ngIf="saveError" class="alert alert-danger">{{ saveError }}</div>
        <div *ngIf="saveSuccess" class="alert alert-success">{{ saveSuccess }}</div>

        <div class="warnings" *ngIf="result.bilingualWarnings.length > 0">
          <h3>Bilingual warnings and errors</h3>
          <div class="warning-item" *ngFor="let warning of result.bilingualWarnings" [ngClass]="getWarningSeverityClass(warning)">
            <div class="warning-meta">
              <span class="warning-code">{{ warning.code }}</span>
              <span class="warning-severity">{{ warning.severity }}</span>
            </div>
            <p>{{ getWarningMessage(warning) }}</p>
            <p *ngIf="warning.fieldName" class="warning-field">Field: {{ warning.fieldName }}</p>
          </div>
        </div>

        <div class="raw-panel">
          <button type="button" class="btn btn-outline" (click)="rawPanelExpanded = !rawPanelExpanded">
            {{ rawPanelExpanded ? 'Hide raw OCR text' : 'Show raw OCR text' }}
          </button>
          <div class="raw-content" *ngIf="rawPanelExpanded">
            <pre>{{ result.rawText || 'No raw OCR text available.' }}</pre>
          </div>
        </div>

        <div class="actions bottom-actions">
          <button type="button" class="btn btn-primary" [disabled]="saving || form.invalid" (click)="saveCorrections()">
            {{ saving ? 'Saving...' : 'Save corrections' }}
          </button>
          <a [routerLink]="['/documents', result.document.id]" class="btn btn-secondary">Back to detail</a>
          <a [href]="jsonExportUrl" class="btn btn-outline" download>Download JSON</a>
          <a [href]="csvExportUrl" class="btn btn-outline" download>Download CSV</a>
        </div>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px;
    }

    .loading,
    .not-found {
      text-align: center;
      padding: 40px;
      border: 1px solid #eaecf0;
      border-radius: 10px;
      background: #fff;
      color: #667085;
    }

    .review-section {
      background: #fff;
      border-radius: 10px;
      padding: 26px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
      border: 1px solid #eaecf0;
    }

    .review-layout {
      display: grid;
      grid-template-columns: minmax(280px, 34%) minmax(0, 1fr);
      gap: 18px;
      align-items: start;
    }

    .preview-panel {
      border: 1px solid #eaecf0;
      border-radius: 8px;
      background: #fff;
      padding: 12px;
      position: sticky;
      top: 16px;
    }

    .preview-frame {
      border: 1px solid #e4e7ec;
      border-radius: 8px;
      overflow: hidden;
      background: #f8fafc;
      min-height: 520px;
    }

    .preview-frame iframe,
    .preview-frame img {
      width: 100%;
      height: 100%;
      min-height: 520px;
      border: 0;
      display: block;
      object-fit: contain;
      background: #fff;
    }

    .preview-fallback {
      border: 1px dashed #d0d5dd;
      border-radius: 8px;
      padding: 12px;
      background: #f9fafb;
    }

    .preview-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 14px;
      margin-bottom: 14px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .meta {
      margin: 6px 0 0;
      color: #667085;
      font-size: 13px;
    }

    .status-card {
      border: 1px solid #e4e7ec;
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 14px;
    }

    .status-card h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }

    .status-card p {
      margin: 0;
      font-size: 14px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
    }

    .top-actions {
      margin-bottom: 16px;
    }

    .bottom-actions {
      margin-top: 18px;
      margin-bottom: 0;
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

    .btn-primary {
      background-color: #175cd3;
      color: #fff;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1849a9;
    }

    .btn-secondary {
      background-color: #475467;
      color: #fff;
    }

    .btn-secondary:hover {
      background-color: #344054;
    }

    .btn-outline {
      border-color: #d0d5dd;
      background: #fff;
      color: #344054;
    }

    .btn-outline:hover {
      background: #f9fafb;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: 13px;
      font-weight: 700;
      color: #475467;
    }

    input,
    select {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #d0d5dd;
      border-radius: 8px;
      padding: 10px;
      font-size: 14px;
      color: #101828;
      background: #fff;
    }

    input:focus,
    select:focus {
      border-color: #175cd3;
      outline: none;
      box-shadow: 0 0 0 3px rgba(23, 92, 211, 0.12);
    }

    .field-error {
      margin: 0;
      color: #b42318;
      font-size: 12px;
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

    .alert-success {
      background-color: #ecfdf3;
      color: #027a48;
      border: 1px solid #abefc6;
    }

    .warnings {
      margin-top: 8px;
      padding: 14px;
      border: 1px solid #eaecf0;
      border-radius: 8px;
      background: #fff;
    }

    .warnings h3 {
      margin: 0 0 10px;
    }

    .warning-item {
      border-radius: 8px;
      padding: 10px;
      border: 1px solid #e5e7eb;
      margin-bottom: 8px;
    }

    .warning-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 4px;
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

    .raw-panel {
      margin-top: 14px;
      border: 1px solid #eaecf0;
      border-radius: 8px;
      padding: 12px;
      background: #fff;
    }

    .raw-content {
      margin-top: 10px;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 300px;
      overflow: auto;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    }

    @media (max-width: 900px) {
      .review-layout {
        grid-template-columns: 1fr;
      }

      .preview-frame,
      .preview-frame iframe,
      .preview-frame img {
        min-height: 320px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class DocumentReviewComponent implements OnInit {
  readonly uiLanguage: UiLanguage = 'en';
  readonly languageOptions: Array<{ value: DetectedLanguageValue; label: string }> = [
    { value: 'Unknown', label: 'Unknown' },
    { value: 'EnglishCanada', label: 'English Canada' },
    { value: 'FrenchCanada', label: 'Français Canada' },
    { value: 'BilingualCanada', label: 'Bilingual Canada' }
  ];

  result: DocumentResultDto | null = null;
  loading = true;
  saving = false;
  loadError = '';
  saveError = '';
  saveSuccess = '';
  rawPanelExpanded = false;
  jsonExportUrl = '';
  csvExportUrl = '';
  previewUrl = '';
  safePreviewUrl: SafeResourceUrl | null = null;
  isPdfPreview = false;
  isImagePreview = false;
  previewFailed = false;

  readonly form: ReviewFormGroup;

  constructor(
    private readonly documentService: DocumentService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      vendorName: this.fb.nonNullable.control('', [Validators.required]),
      customerName: this.fb.nonNullable.control(''),
      documentNumber: this.fb.nonNullable.control(''),
      documentDate: this.fb.nonNullable.control(''),
      dueDate: this.fb.nonNullable.control(''),
      currency: this.fb.nonNullable.control('CAD', [Validators.required]),
      subtotal: this.fb.nonNullable.control(''),
      gst: this.fb.nonNullable.control(''),
      qst: this.fb.nonNullable.control(''),
      hst: this.fb.nonNullable.control(''),
      pst: this.fb.nonNullable.control(''),
      tip: this.fb.nonNullable.control(''),
      total: this.fb.nonNullable.control(''),
      detectedLanguage: this.fb.nonNullable.control<DetectedLanguageValue>('Unknown')
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadReview(id);
      }
    });
  }

  loadReview(id: string): void {
    this.loading = true;
    this.loadError = '';
    this.saveError = '';
    this.saveSuccess = '';
    this.previewUrl = '';
    this.safePreviewUrl = null;
    this.isPdfPreview = false;
    this.isImagePreview = false;
    this.previewFailed = false;

    forkJoin({
      result: this.documentService.getDocumentResult(id),
      rawText: this.documentService.getRawText(id).pipe(catchError(() => of({ rawText: '' })))
    }).subscribe({
      next: ({ result, rawText }) => {
        result.rawText = result.rawText || rawText.rawText || '';
        this.result = result;
        this.jsonExportUrl = this.documentService.getJsonExportUrl(result.document.id);
        this.csvExportUrl = this.documentService.getCsvExportUrl(result.document.id);
        this.previewUrl = this.documentService.getDocumentFileUrl(result.document.id);
        this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
        const contentType = (result.document.contentType || '').toLowerCase();
        this.isPdfPreview = contentType.includes('application/pdf');
        this.isImagePreview = contentType.startsWith('image/');
        this.previewFailed = false;
        this.patchFormFromResult(result);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = 'Document result not found or could not be loaded.';
      }
    });
  }

  saveCorrections(): void {
    if (!this.result) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.saveError = '';
    this.saveSuccess = '';

    const request = this.buildUpdateRequest();
    this.documentService.updateExtractedFields(this.result.document.id, request).subscribe({
      next: (updatedResult) => {
        this.result = updatedResult;
        this.patchFormFromResult(updatedResult);
        this.saving = false;
        this.saveSuccess = 'Corrections saved successfully. Validation result has been updated.';
      },
      error: (err) => {
        this.saving = false;
        this.saveError = this.getErrorMessage(err);
      }
    });
  }

  formatMoneyControl(controlName: 'subtotal' | 'gst' | 'qst' | 'hst' | 'pst' | 'tip' | 'total'): void {
    const control = this.form.controls[controlName];
    const parsed = this.parseMoney(control.value);

    if (parsed === null) {
      control.setValue(control.value.trim());
      return;
    }

    control.setValue(parsed.toFixed(2));
  }

  getWarningMessage(warning: ValidationWarningDto): string {
    if (this.uiLanguage === 'fr' && warning.messageFr) {
      return warning.messageFr;
    }

    return warning.messageEn;
  }

  getWarningSeverityClass(warning: ValidationWarningDto): string {
    const severity = warning.severity.toLowerCase();

    if (severity.includes('error') || severity.includes('critical') || severity.includes('high')) {
      return 'warning-critical';
    }

    if (severity.includes('warning') || severity.includes('medium')) {
      return 'warning-warning';
    }

    return 'warning-info';
  }

  onPreviewError(): void {
    this.previewFailed = true;
  }

  private patchFormFromResult(result: DocumentResultDto): void {
    const fields = result.structuredExtractedFields;

    this.form.setValue({
      vendorName: fields?.vendorName ?? '',
      customerName: fields?.customerName ?? '',
      documentNumber: fields?.documentNumber ?? '',
      documentDate: this.toDateInputValue(fields?.documentDate),
      dueDate: this.toDateInputValue(fields?.dueDate),
      currency: fields?.currency ?? 'CAD',
      subtotal: this.moneyToControlValue(fields?.subtotal),
      gst: this.moneyToControlValue(fields?.gst),
      qst: this.moneyToControlValue(fields?.qst),
      hst: this.moneyToControlValue(fields?.hst),
      pst: this.moneyToControlValue(fields?.pst),
      tip: this.moneyToControlValue(fields?.tip),
      total: this.moneyToControlValue(fields?.total),
      detectedLanguage: this.toDetectedLanguageValue(result.detectedDocumentLanguage)
    });
  }

  private buildUpdateRequest(): UpdateExtractedFieldsRequestDto {
    const value = this.form.getRawValue();

    return {
      vendorName: this.toNullableTrimmed(value.vendorName),
      customerName: this.toNullableTrimmed(value.customerName),
      documentNumber: this.toNullableTrimmed(value.documentNumber),
      documentDate: this.toNullableTrimmed(value.documentDate),
      dueDate: this.toNullableTrimmed(value.dueDate),
      currency: this.toNullableTrimmed(value.currency)?.toUpperCase() ?? null,
      subtotal: this.parseMoney(value.subtotal),
      gst: this.parseMoney(value.gst),
      qst: this.parseMoney(value.qst),
      hst: this.parseMoney(value.hst),
      pst: this.parseMoney(value.pst),
      tip: this.parseMoney(value.tip),
      total: this.parseMoney(value.total),
      detectedLanguage: value.detectedLanguage
    };
  }

  private toDateInputValue(value?: string | null): string {
    if (!value) {
      return '';
    }

    if (value.length >= 10) {
      return value.slice(0, 10);
    }

    return value;
  }

  private moneyToControlValue(value?: number | null): string {
    if (typeof value !== 'number') {
      return '';
    }

    return value.toFixed(2);
  }

  private parseMoney(value: string): number | null {
    const normalized = value.trim().replace(/\s/g, '').replace(',', '.');
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      return null;
    }

    return Math.round(parsed * 100) / 100;
  }

  private toNullableTrimmed(value: string): string | null {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private toDetectedLanguageValue(value: string): DetectedLanguageValue {
    if (value === 'EnglishCanada' || value === 'FrenchCanada' || value === 'BilingualCanada' || value === 'Unknown') {
      return value;
    }

    return 'Unknown';
  }

  private getErrorMessage(err: unknown): string {
    if (typeof err === 'string' && err.trim().length > 0) {
      return err;
    }

    if (err && typeof err === 'object') {
      const value = err as { error?: unknown; message?: string };

      if (typeof value.error === 'string' && value.error.trim().length > 0) {
        return value.error;
      }

      if (value.error && typeof value.error === 'object') {
        const message = (value.error as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim().length > 0) {
          return message;
        }
      }

      if (typeof value.message === 'string' && value.message.trim().length > 0) {
        return value.message;
      }
    }

    return 'Failed to save corrections.';
  }
}
