import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="upload-section">
        <h1>Upload Document</h1>
        
        <div class="form-group">
          <label>Document Type</label>
          <select [(ngModel)]="documentType" class="form-control">
            <option value="Receipt">Receipt</option>
            <option value="Invoice">Invoice</option>
          </select>
        </div>

        <div class="form-group">
          <label>Select File</label>
          <div class="file-input-wrapper">
            <input 
              type="file" 
              #fileInput 
              (change)="onFileSelected($event)" 
              accept="image/*,.pdf"
              class="file-input"
            />
            <button (click)="fileInput.click()" class="btn btn-secondary">
              Choose File
            </button>
            <span class="file-name">{{ selectedFileName || 'No file selected' }}</span>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div *ngIf="uploading" class="uploading">
          <div class="spinner"></div>
          <p>Uploading...</p>
        </div>

        <button 
          [disabled]="!selectedFile || uploading" 
          (click)="uploadDocument()" 
          class="btn btn-primary btn-lg"
        >
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>

        <a routerLink="/documents" class="btn btn-secondary btn-lg">Cancel</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
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

    .form-control, .btn {
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

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
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
      width: 100%;
      margin-top: 10px;
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

    .uploading {
      text-align: center;
      padding: 20px;
      margin-bottom: 20px;
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
  `]
})
export class DocumentUploadComponent {
  selectedFile: File | null = null;
  selectedFileName = '';
  documentType = 'Receipt';
  uploading = false;
  error = '';

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.error = '';
    }
  }

  uploadDocument() {
    if (!this.selectedFile) {
      this.error = 'Please select a file';
      return;
    }

    this.uploading = true;
    this.error = '';

    this.documentService.uploadDocument(this.selectedFile, this.documentType).subscribe({
      next: (response) => {
        this.uploading = false;
        this.router.navigate(['/documents', response.id]);
      },
      error: (err) => {
        this.uploading = false;
        this.error = 'Failed to upload document: ' + (err.error?.message || err.message);
        console.error('Upload error:', err);
      }
    });
  }
}
