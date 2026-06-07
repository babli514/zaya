import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentsApiService, DocumentListItem } from '../../services/documents-api.service';

type StatusBadgeClass = 'badge-uploaded' | 'badge-processing' | 'badge-completed' | 'badge-failed' | 'badge-needs-review' | 'badge-unknown';
type LanguageBadgeClass = 'badge-language-en' | 'badge-language-fr' | 'badge-language-bilingual' | 'badge-language-unknown';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>{{ labels.title }}</h1>
        <a routerLink="/documents/upload" class="btn btn-primary">{{ labels.actions.uploadNewDocument }}</a>
      </div>

      <div *ngIf="loading" class="loading-state">{{ labels.loading }}</div>

      <div *ngIf="!loading && errorMessage" class="error-state">
        <p>{{ errorMessage }}</p>
        <button type="button" class="btn btn-secondary" (click)="loadDocuments()">{{ labels.retry }}</button>
      </div>

      <div *ngIf="!loading && !errorMessage && documents.length === 0" class="empty-state">
        <p>{{ labels.empty }}</p>
      </div>

      <div *ngIf="!loading && !errorMessage && documents.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ labels.columns.originalFileName }}</th>
              <th>{{ labels.columns.documentType }}</th>
              <th>{{ labels.columns.documentLanguage }}</th>
              <th>{{ labels.columns.processingStatus }}</th>
              <th>{{ labels.columns.uploadedDate }}</th>
              <th>{{ labels.columns.processedDate }}</th>
              <th>{{ labels.columns.actions }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let document of documents">
              <td>{{ document.fileName }}</td>
              <td>{{ document.documentType }}</td>
              <td>
                <span class="badge" [ngClass]="getLanguageBadgeClass(document.documentLanguage)">
                  {{ getLanguageLabel(document.documentLanguage) }}
                </span>
              </td>
              <td>
                <span class="badge" [ngClass]="getStatusBadgeClass(document.status)">
                  {{ getStatusLabel(document.status) }}
                </span>
              </td>
              <td>{{ formatDate(document.uploadedAtUtc) }}</td>
              <td>{{ formatDate(document.processedAtUtc) }}</td>
              <td>
                <div class="row-actions">
                  <a [routerLink]="['/documents', document.id]" class="btn btn-link">{{ labels.actions.viewDetails }}</a>
                  <a routerLink="/documents/upload" class="btn btn-link">{{ labels.actions.uploadNewDocument }}</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .loading-state,
    .error-state,
    .empty-state {
      border: 1px solid #e4e7ec;
      border-radius: 8px;
      padding: 20px;
      background-color: #ffffff;
      color: #475467;
    }

    .error-state {
      border-color: #fda29b;
      color: #b42318;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .error-state p {
      margin: 0;
    }

    .table-wrapper {
      border: 1px solid #e4e7ec;
      border-radius: 8px;
      overflow: hidden;
      background-color: #ffffff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f9fafb;
    }

    th,
    td {
      text-align: left;
      padding: 12px 14px;
      border-bottom: 1px solid #e4e7ec;
      vertical-align: middle;
      font-size: 14px;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .btn {
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background-color: #2563eb;
      color: #ffffff;
      padding: 10px 16px;
    }

    .btn-primary:hover {
      background-color: #1d4ed8;
    }

    .btn-secondary {
      background-color: #475467;
      color: #ffffff;
      padding: 8px 14px;
    }

    .btn-secondary:hover {
      background-color: #344054;
    }

    .btn-link {
      background: transparent;
      color: #175cd3;
      padding: 0;
    }

    .row-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }

    .badge-uploaded {
      background-color: #eff8ff;
      color: #175cd3;
    }

    .badge-processing {
      background-color: #ecfdf3;
      color: #027a48;
    }

    .badge-completed {
      background-color: #ecfdf3;
      color: #027a48;
    }

    .badge-failed {
      background-color: #fef3f2;
      color: #b42318;
    }

    .badge-needs-review {
      background-color: #fff7ed;
      color: #b54708;
    }

    .badge-unknown {
      background-color: #f2f4f7;
      color: #475467;
    }

    .badge-language-en {
      background-color: #eff8ff;
      color: #175cd3;
    }

    .badge-language-fr {
      background-color: #f5f3ff;
      color: #6941c6;
    }

    .badge-language-bilingual {
      background-color: #ecfdf3;
      color: #027a48;
    }

    .badge-language-unknown {
      background-color: #f2f4f7;
      color: #475467;
    }
  `]
})
export class DocumentsListComponent implements OnInit {
  documents: DocumentListItem[] = [];
  loading = false;
  errorMessage = '';

  readonly labels = {
    title: 'Documents',
    loading: 'Loading documents...',
    empty: 'No documents found.',
    retry: 'Retry',
    columns: {
      originalFileName: 'Original file name',
      documentType: 'Document type',
      documentLanguage: 'Document language',
      processingStatus: 'Processing status',
      uploadedDate: 'Uploaded date',
      processedDate: 'Processed date',
      actions: 'Actions'
    },
    actions: {
      viewDetails: 'View details',
      uploadNewDocument: 'Upload new document'
    }
  } as const;

  private readonly statusLabels: Record<string, string> = {
    Uploaded: 'Uploaded',
    Processing: 'Processing',
    Completed: 'Completed',
    Failed: 'Failed',
    NeedsReview: 'Needs Review'
  };

  private readonly languageLabels: Record<string, string> = {
    EnglishCanada: 'English Canada',
    FrenchCanada: 'Français Canada',
    BilingualCanada: 'Bilingual Canada',
    Unknown: 'Auto/Unknown'
  };

  constructor(private readonly documentsApiService: DocumentsApiService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.documentsApiService.getDocuments().subscribe({
      next: (response) => {
        this.documents = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load documents. Please try again.';
      }
    });
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] ?? status;
  }

  getLanguageLabel(language: string): string {
    return this.languageLabels[language] ?? this.languageLabels['Unknown'];
  }

  getStatusBadgeClass(status: string): StatusBadgeClass {
    const badgeClassMap: Record<string, StatusBadgeClass> = {
      Uploaded: 'badge-uploaded',
      Processing: 'badge-processing',
      Completed: 'badge-completed',
      Failed: 'badge-failed',
      NeedsReview: 'badge-needs-review'
    };

    return badgeClassMap[status] ?? 'badge-unknown';
  }

  getLanguageBadgeClass(language: string): LanguageBadgeClass {
    const badgeClassMap: Record<string, LanguageBadgeClass> = {
      EnglishCanada: 'badge-language-en',
      FrenchCanada: 'badge-language-fr',
      BilingualCanada: 'badge-language-bilingual',
      Unknown: 'badge-language-unknown'
    };

    return badgeClassMap[language] ?? 'badge-language-unknown';
  }

  formatDate(value: string | null): string {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString();
  }
}
