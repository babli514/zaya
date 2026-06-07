import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly apiUrl = 'https://localhost:7167/api/documents';

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(this.apiUrl);
  }

  getDocument(id: string): Observable<DocumentDto> {
    return this.http.get<DocumentDto>(`${this.apiUrl}/${id}`);
  }

  uploadDocument(file: File, documentType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return this.http.post<DocumentDto>(this.apiUrl, formData);
  }

  deleteDocument(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
