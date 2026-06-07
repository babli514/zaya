import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DocumentService, DocumentDto } from '../../services/document.service';

@Component({
  selector: 'app-document-review',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Loading document review...</div>

      <div *ngIf="!loading && document" class="review-section">
        <div class="header">
          <h1>Review {{ document.fileName }}</h1>
          <a routerLink="/documents/{{ document.id }}" class="btn btn-secondary">Back to Document</a>
        </div>

        <div class="overview">
          <p><strong>Status:</strong> {{ document.status }}</p>
          <p><strong>Type:</strong> {{ document.type }}</p>
          <p><strong>Uploaded:</strong> {{ document.uploadedAt | date:'medium' }}</p>
        </div>

        <div *ngIf="document.extractedData && objectKeys(document.extractedData).length > 0" class="extracted-data">
          <h2>Extracted Data</h2>
          <div class="data-grid">
            <div *ngFor="let key of objectKeys(document.extractedData)" class="data-item">
              <label>{{ key }}</label>
              <p>{{ document.extractedData[key] }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!document.extractedData || objectKeys(document.extractedData).length === 0" class="empty-state">
          <p>No extracted data is available yet for this document.</p>
        </div>
      </div>

      <div *ngIf="!loading && !document" class="not-found">
        <p>Document not found.</p>
        <a routerLink="/documents" class="btn btn-secondary">Back to list</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }

    .loading,
    .not-found {
      text-align: center;
      padding: 40px;
      color: #555;
    }

    .review-section {
      background: #fff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }

    .overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }

    .extracted-data {
      padding: 24px;
      border: 1px solid #e3eaf7;
      border-radius: 8px;
      background: #f8fbff;
    }

    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .data-item {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.03);
    }

    .data-item label {
      display: block;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .data-item p {
      margin: 0;
      color: #333;
      word-break: break-word;
    }

    .empty-state {
      padding: 30px;
      color: #666;
      border-radius: 8px;
      background: #fff;
      border: 1px dashed #ced4da;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 18px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      color: #fff;
      background: #6c757d;
      transition: background-color 0.2s ease;
    }

    .btn:hover {
      background: #5a6268;
    }
  `]
})
export class DocumentReviewComponent implements OnInit {
  document: DocumentDto | null = null;
  loading = true;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadDocument(id);
      }
    });
  }

  loadDocument(id: string) {
    this.loading = true;
    this.documentService.getDocument(id).subscribe({
      next: (value) => {
        this.document = value;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load document review', err);
        this.loading = false;
      }
    });
  }

  objectKeys(value: Record<string, unknown>) {
    return Object.keys(value);
  }
}
