import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type UploadDocumentType = 'receipt' | 'invoice';
export type UploadDocumentLanguage = 'auto' | 'en-CA' | 'fr-CA' | 'bilingual-CA';
export type DetectedLanguageValue = 'Unknown' | 'EnglishCanada' | 'FrenchCanada' | 'BilingualCanada';

export interface DocumentDetailDto {
  id: string;
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  fileSizeBytes: number;
  documentType: string;
  documentLanguage: string;
  status: string;
  uploadedAtUtc: string;
  processedAtUtc?: string | null;
}

export type DocumentDto = DocumentDetailDto;

export interface ValidationWarningDto {
  code: string;
  messageEn: string;
  messageFr: string;
  severity: string;
  fieldName?: string | null;
}

export interface ValidationResultSummaryDto {
  isValidated: boolean;
  summary: string;
}

export interface ExtractionJobResultDto {
  id: string;
  startedAtUtc: string;
  completedAtUtc?: string | null;
  status: string;
  errorMessage?: string | null;
}

export interface ExtractedFieldsDto {
  vendorName: string;
  customerName?: string | null;
  documentNumber?: string | null;
  documentDate?: string | null;
  dueDate?: string | null;
  currency: string;
  subtotal?: number | null;
  gst?: number | null;
  qst?: number | null;
  hst?: number | null;
  pst?: number | null;
  tip?: number | null;
  total?: number | null;
}

export interface UpdateExtractedFieldsRequestDto {
  vendorName?: string | null;
  customerName?: string | null;
  documentNumber?: string | null;
  documentDate?: string | null;
  dueDate?: string | null;
  currency?: string | null;
  subtotal?: number | null;
  gst?: number | null;
  qst?: number | null;
  hst?: number | null;
  pst?: number | null;
  tip?: number | null;
  total?: number | null;
  detectedLanguage?: DetectedLanguageValue;
}

export interface DocumentResultDto {
  document: {
    id: string;
    originalFileName: string;
    storedFileName: string;
    contentType: string;
    documentType: string;
    status: string;
    uploadedAtUtc: string;
    processedAtUtc?: string | null;
  };
  requestedDocumentLanguage: string;
  detectedDocumentLanguage: string;
  latestExtractionJob?: ExtractionJobResultDto | null;
  rawText: string;
  structuredExtractedFields?: ExtractedFieldsDto | null;
  lineItems: Array<Record<string, unknown>>;
  validationResult?: ValidationResultSummaryDto | null;
  bilingualWarnings: ValidationWarningDto[];
  confidence?: number | null;
  primaryOcrEngineUsed: string;
  fallbackOcrEngineUsed?: string | null;
  fallbackUsed: boolean;
  providerName?: string | null;
  modelName?: string | null;
  providerLatencyMs?: number | null;
}

export interface DocumentRawTextDto {
  rawText: string;
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

  constructor(private readonly http: HttpClient) {}

  getAllDocuments(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(this.apiUrl);
  }

  getDocument(id: string): Observable<DocumentDetailDto> {
    return this.http.get<DocumentDetailDto>(`${this.apiUrl}/${id}`);
  }

  getDocumentResult(id: string): Observable<DocumentResultDto> {
    return this.http.get<DocumentResultDto>(`${this.apiUrl}/${id}/result`);
  }

  getRawText(id: string): Observable<DocumentRawTextDto> {
    return this.http.get<DocumentRawTextDto>(`${this.apiUrl}/${id}/raw-text`);
  }

  updateExtractedFields(id: string, request: UpdateExtractedFieldsRequestDto): Observable<DocumentResultDto> {
    return this.http.put<DocumentResultDto>(`${this.apiUrl}/${id}/extracted-fields`, request);
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

  processDocument(id: string): Observable<DocumentDetailDto> {
    return this.http.post<DocumentDetailDto>(`${this.apiUrl}/${id}/process`, {});
  }

  getJsonExportUrl(id: string): string {
    return `${this.apiUrl}/${id}/export/json`;
  }

  getCsvExportUrl(id: string): string {
    return `${this.apiUrl}/${id}/export/csv`;
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
