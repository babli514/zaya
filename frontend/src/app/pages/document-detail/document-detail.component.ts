import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Loading document...</div>

      <div *ngIf="!loading && document" class="detail-section">
        <div class="header">
          <h1>{{ document.fileName }}</h1>
          <a routerLink="/documents" class="btn btn-secondary">Back to List</a>
        </div>

        <div class="document-info">
          <div class="info-grid">
            <div class="info-item">
              <label>Status</label>
              <span class="badge" [class]="'status-' + document.status.toLowerCase()">
                {{ document.status }}
              </span>
            </div>
            <div class="info-item">
              <label>Type</label>
              <p>{{ document.type }}</p>
            </div>
            <div class="info-item">
              <label>File Size</label>
              <p>{{ formatFileSize(document.fileSizeBytes) }}</p>
            </div>
            <div class="info-item">
              <label>Content Type</label>
              <p>{{ document.contentType }}</p>
            </div>
            <div class="info-item">
              <label>Uploaded</label>
              <p>{{ document.uploadedAt | date:'medium' }}</p>
            </div>
            <div class="info-item" *ngIf="document.processedAt">
              <label>Processed</label>
              <p>{{ document.processedAt | date:'medium' }}</p>
            </div>
          </div>

          <div *ngIf="document.extractedData && Object.keys(document.extractedData).length > 0" class="extracted-data">
            <h3>Extracted Data</h3>
            <div class="data-grid">
              <div *ngFor="let key of Object.keys(document.extractedData)" class="data-item">
                <label>{{ key }}</label>
                <p>{{ document.extractedData[key] }}</p>
              </div>
            </div>
          </div>

          <div *ngIf="document.errorMessage" class="alert alert-danger">
            <strong>Error:</strong> {{ document.errorMessage }}
          </div>

          <div class="actions">
            <a *ngIf="document.status === 'Completed'" 
               [routerLink]="['/documents', document.id, 'review']" 
               class="btn btn-primary">
              Review Extracted Data
            </a>
            <button (click)="deleteDocument()" class="btn btn-danger">
              Delete Document
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !document" class="not-found">
        <p>Document not found</p>
        <a routerLink="/documents" class="btn btn-secondary">Back to List</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }

    .loading, .not-found {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .detail-section {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .info-item {
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .info-item label {
      display: block;
      font-weight: 600;
      margin-bottom: 5px;
      color: #666;
    }

    .info-item p {
      margin: 0;
      color: #333;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .status-pending {
      background-color: #ffc107;
      color: #000;
    }

    .status-processing {
      background-color: #17a2b8;
      color: white;
    }

    .status-completed {
      background-color: #28a745;
      color: white;
    }

    .status-failed {
      background-color: #dc3545;
      color: white;
    }

    .extracted-data {
      margin: 30px 0;
      padding: 20px;
      background-color: #f0f7ff;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    }

    .extracted-data h3 {
      margin-top: 0;
    }

    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .data-item {
      padding: 12px;
      background: white;
      border-radius: 4px;
    }

    .data-item label {
      display: block;
      font-weight: 600;
      margin-bottom: 5px;
      color: #666;
    }

    .data-item p {
      margin: 0;
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

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      border: none;
      cursor: pointer;
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
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }
  `]
})
export class DocumentDetailComponent implements OnInit {
  document: any = null;
  loading = true;
  Object = Object;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadDocument(id);
    });
  }

  loadDocument(id: string) {
    this.loading = true;
    this.documentService.getDocument(id).subscribe({
      next: (data) => {
        this.document = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading document:', err);
        this.loading = false;
      }
    });
  }

  deleteDocument() {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(this.document.id).subscribe({
        next: () => {
          this.router.navigate(['/documents']);
        },
        error: (err) => {
          console.error('Error deleting document:', err);
          alert('Failed to delete document');
        }
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
