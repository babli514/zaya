import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type DocumentProcessingStatus = 'Uploaded' | 'Processing' | 'Completed' | 'Failed' | 'NeedsReview' | 'Pending';
export type DocumentLanguageCode = 'EnglishCanada' | 'FrenchCanada' | 'BilingualCanada' | 'Unknown';

export interface DocumentListItem {
  id: string;
  fileName: string;
  documentType: string;
  documentLanguage: DocumentLanguageCode | string;
  status: DocumentProcessingStatus | string;
  uploadedAtUtc: string;
  processedAtUtc: string | null;
}

@Injectable({ providedIn: 'root' })
export class DocumentsApiService {
  private readonly apiUrl = '/api/documents';

  constructor(private readonly http: HttpClient) {}

  getDocuments(): Observable<DocumentListItem[]> {
    return this.http.get<DocumentListItem[]>(this.apiUrl);
  }
}
