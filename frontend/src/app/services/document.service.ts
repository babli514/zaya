import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type UploadDocumentType = 'receipt' | 'invoice';
export type UploadDocumentLanguage = 'auto' | 'en-CA' | 'fr-CA' | 'bilingual-CA';

export interface DocumentDto {
  id: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  type: string;
  status: string;
  uploadedAt: string;
  processedAt?: string;
  errorMessage?: string;
  extractedData: Record<string, unknown>;
}

export interface UploadDocumentResponseDto {
  documentId: string;
  originalFileName: string;
  documentType: string;
  documentLanguage: string;
  status: string;
  uploadedAtUtc: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly apiUrl = '/api/documents';

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(this.apiUrl);
  }

  getDocument(id: string): Observable<DocumentDto> {
    return this.http.get<DocumentDto>(`${this.apiUrl}/${id}`);
  }

  uploadDocument(file: File, documentType: UploadDocumentType, documentLanguage: UploadDocumentLanguage): Observable<HttpEvent<UploadDocumentResponseDto>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('documentLanguage', documentLanguage);

    return this.http.post<UploadDocumentResponseDto>(`${this.apiUrl}/upload`, formData, {
      observe: 'events',
      reportProgress: true
    });
  }

  processDocument(id: string): Observable<DocumentDto> {
    return this.http.post<DocumentDto>(`${this.apiUrl}/${id}/process`, {});
  }

  deleteDocument(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
