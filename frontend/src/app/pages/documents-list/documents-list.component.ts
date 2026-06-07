import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Financial Documents</h1>
        <a routerLink="/documents/upload" class="btn btn-primary">Upload Document</a>
      </div>

      <div *ngIf="loading" class="loading">Loading documents...</div>

      <div *ngIf="!loading && documents.length === 0" class="no-documents">
        <p>No documents yet. <a routerLink="/documents/upload">Upload your first document</a></p>
      </div>

      <div *ngIf="!loading && documents.length > 0" class="documents-grid">
        <div *ngFor="let doc of documents" class="document-card" [routerLink]="['/documents', doc.id]">
          <div class="card-header">
            <h3>{{ doc.fileName }}</h3>
            <span class="badge" [class]="'status-' + doc.status.toLowerCase()">{{ doc.status }}</span>
          </div>
          <div class="card-body">
            <p><strong>Type:</strong> {{ doc.type }}</p>
            <p><strong>Size:</strong> {{ formatFileSize(doc.fileSizeBytes) }}</p>
            <p><strong>Uploaded:</strong> {{ doc.uploadedAt | date:'short' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .loading, .no-documents {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .document-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .document-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 18px;
      flex: 1;
      word-break: break-word;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      margin-left: 10px;
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

    .card-body p {
      margin: 8px 0;
      font-size: 14px;
      color: #666;
    }
  `]
})
export class DocumentsListComponent implements OnInit {
  documents: any[] = [];
  loading = true;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    this.documentService.getAllDocuments().subscribe({
      next: (data) => {
        this.documents = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading documents:', err);
        this.loading = false;
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
