import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentService, UploadDocumentLanguage, UploadDocumentType } from '../../services/document.service';

type UploadMode = 'uploadOnly' | 'uploadAndProcess';

interface LabelOption<TValue extends string> {
  value: TValue;
  label: string;
}

const UPLOAD_LABELS = {
  title: 'Upload Document',
  fields: {
    documentType: 'Document type',
    documentLanguage: 'Document language',
    selectFile: 'Select file',
    processAfterUpload: 'Automatically process after upload'
  },
  buttons: {
    chooseFile: 'Choose file',
    uploadOnly: 'Upload only',
    uploadAndProcess: 'Upload and process now',
    cancel: 'Cancel'
  },
  file: {
    noneSelected: 'No file selected',
    invalidType: 'Unsupported file type. Allowed: PDF, PNG, JPG, JPEG, WEBP.',
    tooLarge: 'File size exceeds the maximum allowed size of 10 MB.'
  },
  status: {
    uploading: 'Uploading...',
    processing: 'Processing document...',
    uploadSuccess: 'Upload successful. Redirecting to document details...',
    processSuccess: 'Document processed successfully. Redirecting to document details...'
  },
  validation: {
    fileRequired: 'Please select a file before uploading.'
  }
} as const;

const DOCUMENT_TYPE_OPTIONS: LabelOption<UploadDocumentType>[] = [
  { value: 'receipt', label: 'Receipt' },
  { value: 'invoice', label: 'Invoice' }
];

const DOCUMENT_LANGUAGE_OPTIONS: LabelOption<UploadDocumentLanguage>[] = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'en-CA', label: 'English Canada' },
  { value: 'fr-CA', label: 'Français Canada' },
  { value: 'bilingual-CA', label: 'Bilingual Canada' }
];

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="upload-section">
        <h1>{{ labels.title }}</h1>

        <div class="form-group">
          <label>{{ labels.fields.documentType }}</label>
          <select [(ngModel)]="documentType" class="form-control">
            <option *ngFor="let option of documentTypeOptions" [value]="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ labels.fields.documentLanguage }}</label>
          <select [(ngModel)]="documentLanguage" class="form-control">
            <option *ngFor="let option of documentLanguageOptions" [value]="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ labels.fields.selectFile }}</label>
          <div class="file-input-wrapper">
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              class="file-input"
            />
            <button type="button" (click)="fileInput.click()" class="btn btn-secondary">
              {{ labels.buttons.chooseFile }}
            </button>
            <span class="file-name">{{ selectedFileDisplay || labels.file.noneSelected }}</span>
          </div>
        </div>

        <div class="form-group checkbox-row">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="processAfterUpload" />
            <span>{{ labels.fields.processAfterUpload }}</span>
          </label>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div *ngIf="uploading || processing" class="uploading">
          <div class="spinner"></div>
          <p>{{ processing ? labels.status.processing : labels.status.uploading }}</p>
          <p *ngIf="uploading && uploadProgress > 0" class="progress">{{ uploadProgress }}%</p>
        </div>

        <div class="button-row">
          <button
            type="button"
            [disabled]="!selectedFile || uploading || processing"
            (click)="submit('uploadOnly')"
            class="btn btn-primary btn-lg"
          >
            {{ labels.buttons.uploadOnly }}
          </button>

          <button
            type="button"
            [disabled]="!selectedFile || uploading || processing"
            (click)="submit('uploadAndProcess')"
            class="btn btn-primary btn-lg"
          >
            {{ labels.buttons.uploadAndProcess }}
          </button>

          <a routerLink="/documents" class="btn btn-secondary btn-lg">{{ labels.buttons.cancel }}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
    }

    .upload-section {
      background: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1 {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-control,
    .btn {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      box-sizing: border-box;
    }

    .file-input-wrapper {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .file-input {
      display: none;
    }

    .file-name {
      flex: 1;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .checkbox-row {
      margin-top: -4px;
    }

    .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0;
      cursor: pointer;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-lg {
      padding: 12px 24px;
      font-size: 16px;
    }

    .button-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 10px;
      align-items: center;
      margin-top: 10px;
    }

    .alert {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-success {
      background-color: #d1e7dd;
      color: #0f5132;
      border: 1px solid #badbcc;
    }

    .uploading {
      text-align: center;
      padding: 20px;
      margin-bottom: 20px;
    }

    .progress {
      margin: 0;
      font-weight: 600;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 720px) {
      .button-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DocumentUploadComponent {
  readonly labels = UPLOAD_LABELS;
  readonly documentTypeOptions = DOCUMENT_TYPE_OPTIONS;
  readonly documentLanguageOptions = DOCUMENT_LANGUAGE_OPTIONS;

  readonly maxFileSizeBytes = 10 * 1024 * 1024;
  readonly allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
  readonly allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];

  selectedFile: File | null = null;
  selectedFileDisplay = '';
  documentType: UploadDocumentType = 'receipt';
  documentLanguage: UploadDocumentLanguage = 'auto';
  processAfterUpload = false;
  uploading = false;
  processing = false;
  uploadProgress = 0;
  error = '';
  successMessage = '';

  constructor(
    private readonly documentService: DocumentService,
    private readonly router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;

    this.error = '';
    this.successMessage = '';
    this.selectedFile = null;
    this.selectedFileDisplay = '';

    if (!file) {
      return;
    }

    if (!this.isSupportedFileType(file)) {
      this.error = this.labels.file.invalidType;
      return;
    }

    if (file.size > this.maxFileSizeBytes) {
      this.error = this.labels.file.tooLarge;
      return;
    }

    this.selectedFile = file;
    this.selectedFileDisplay = `${file.name} (${this.formatFileSize(file.size)})`;
  }

  submit(mode: UploadMode): void {
    if (!this.selectedFile) {
      this.error = this.labels.validation.fileRequired;
      return;
    }

    this.uploading = true;
    this.processing = false;
    this.uploadProgress = 0;
    this.error = '';
    this.successMessage = '';

    this.documentService.uploadDocument(this.selectedFile, this.documentType, this.documentLanguage).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total && event.total > 0) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          }
          return;
        }

        if (event.type !== HttpEventType.Response || !event.body) {
          return;
        }

        this.uploading = false;

        const uploadResponse = event.body;
        const shouldProcess = mode === 'uploadAndProcess' || this.processAfterUpload;

        if (!shouldProcess) {
          this.successMessage = this.labels.status.uploadSuccess;
          this.navigateToDocument(uploadResponse.documentId);
          return;
        }

        this.processing = true;
        this.documentService.processDocument(uploadResponse.documentId).subscribe({
          next: () => {
            this.processing = false;
            this.successMessage = this.labels.status.processSuccess;
            this.navigateToDocument(uploadResponse.documentId);
          },
          error: (err) => {
            this.processing = false;
            this.error = this.getBackendErrorMessage(err);
          }
        });
      },
      error: (err) => {
        this.uploading = false;
        this.processing = false;
        this.error = this.getBackendErrorMessage(err);
      }
    });
  }

  private navigateToDocument(documentId: string): void {
    setTimeout(() => {
      this.router.navigate(['/documents', documentId]);
    }, 700);
  }

  private isSupportedFileType(file: File): boolean {
    const extension = this.getFileExtension(file.name);
    const extensionAllowed = extension ? this.allowedExtensions.includes(extension) : false;

    if (extensionAllowed) {
      return true;
    }

    return this.allowedMimeTypes.includes(file.type);
  }

  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    if (lastDot < 0 || lastDot === fileName.length - 1) {
      return '';
    }

    return fileName.slice(lastDot + 1).toLowerCase();
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  private getBackendErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Unexpected error while uploading the document.';
    }

    const payload = error.error;

    if (typeof payload === 'string' && payload.trim().length > 0) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const messageValue = (payload as { message?: unknown }).message;
      if (typeof messageValue === 'string' && messageValue.trim().length > 0) {
        return messageValue;
      }

      const errorsValue = (payload as { errors?: unknown }).errors;
      if (errorsValue && typeof errorsValue === 'object') {
        const flattened = Object.values(errorsValue as Record<string, unknown>)
          .flatMap((entry) => Array.isArray(entry) ? entry : [entry])
          .filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);

        if (flattened.length > 0) {
          return flattened.join(' ');
        }
      }
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }

    return 'Upload failed. Please verify the document and try again.';
  }
}
