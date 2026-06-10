import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

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
  primaryLatencyMs: number;
  fallbackLatencyMs?: number | null;
  providerLatencyMs?: number | null;
  totalProcessingLatencyMs: number;
  estimatedProviderCost?: number | null;
  pageCount?: number | null;
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

  // private mockCounter = 0;

  // getDocument(id: string): Observable<DocumentDetailDto> {
  //   this.mockCounter++;

  //   const status = this.mockCounter < 4 ? 'Running' : 'Completed';

  //   console.log(`MOCK getDocument: returning ${status} (call #${this.mockCounter})`);

  //   return of({
  //     id,
  //     originalFileName: 'mock.pdf',
  //     storedFileName: "8acc93535e184b388fb84022bc12866d.pdf",
  //     contentType: 'application/pdf',
  //     documentType: 'Invoice',
  //     status,
  //     uploadedAtUtc: new Date().toISOString(),
  //     processedAtUtc: new Date().toISOString(),
  //     fileSizeBytes: 12345,
  //     documentLanguage: 'EnglishCanada'
  //   }).pipe(delay(500));
  // }


  getDocumentResult(id: string): Observable<DocumentResultDto> {
    return this.http.get<DocumentResultDto>(`${this.apiUrl}/${id}/result`);
  }

  // private mockCounter = 0;

  // getDocumentResult(id: string): Observable<DocumentResultDto> {
  //   this.mockCounter++;

  //   const base: DocumentResultDto = {
  //     "document": {
  //       "id": "46590962-1c6e-4f5c-bcea-97d20c0467a2",
  //       "originalFileName": "sample-pdf-invoice.pdf",
  //       "storedFileName": "8acc93535e184b388fb84022bc12866d.pdf",
  //       "contentType": "application/pdf",
  //       "documentType": "Invoice",
  //       "status": "Running",
  //       "uploadedAtUtc": "2026-06-09T13:34:23.2924715",
  //       "processedAtUtc": "2026-06-09T13:34:23.3827169"
  //   },
  //   "requestedDocumentLanguage": "EnglishCanada",
  //   "detectedDocumentLanguage": "EnglishCanada",
  //   "latestExtractionJob": {
  //       "id": "1419fa43-585f-409d-8232-bd9122bd948e",
  //       "startedAtUtc": "2026-06-09T13:34:23.317065",
  //       "completedAtUtc": "2026-06-09T13:34:23.3756202",
  //       "status": this.mockCounter < 4 ? 'Running' : 'Completed',
  //       "errorMessage": null
  //   },
  //     rawText: '',
  //     lineItems: [],
  //     bilingualWarnings: [],
  //     "confidence": 1.0000,
  //   "primaryOcrEngineUsed": "NativePdfText",
  //   "fallbackOcrEngineUsed": null,
  //   "fallbackUsed": false,
  //   "providerName": "NativePdf",
  //   "modelName": "PdfPig",
  //   "primaryLatencyMs": 39,
  //   "fallbackLatencyMs": null,
  //   "providerLatencyMs": 39,
  //   "totalProcessingLatencyMs": 39,
  //   "estimatedProviderCost": 0.000000,
  //   "pageCount": 2
  //   };

  //   console.log(
  //     `MOCK: returning ${base?.latestExtractionJob?.status} (call #${this.mockCounter})`
  //   );

  //   return of(base).pipe(delay(500));
  // }



  getRawText(id: string): Observable<DocumentRawTextDto> {
    return this.http.get<DocumentRawTextDto>(`${this.apiUrl}/${id}/raw-text`);
  }

  getDocumentFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/file`, { responseType: 'blob' });
  }

  getDocumentFileUrl(id: string): string {
    return `${this.apiUrl}/${id}/file`;
  }

  updateExtractedFields(id: string, request: UpdateExtractedFieldsRequestDto): Observable<DocumentResultDto> {
    return this.http.put<DocumentResultDto>(`${this.apiUrl}/${id}/extracted-fields`, request);
  }

  uploadDocument(file: File, documentType: UploadDocumentType, documentLanguage: UploadDocumentLanguage, enqueueProcessing = true): Observable<HttpEvent<UploadDocumentResponseDto>> {
    const formData = this.createUploadFormData([file], documentType, documentLanguage, enqueueProcessing);

    return this.http.post<UploadDocumentResponseDto>(`${this.apiUrl}/upload`, formData, {
      observe: 'events',
      reportProgress: true
    });
  }

  private createUploadFormData(files: readonly File[], documentType: UploadDocumentType, documentLanguage: UploadDocumentLanguage, enqueueProcessing: boolean): FormData {
    const formData = new FormData();
    const file = files[0];

    if (file) {
      formData.append('file', file);
    }

    formData.append('documentType', documentType);
    formData.append('documentLanguage', documentLanguage);
    if (enqueueProcessing) {
      formData.append('enqueueProcessing', 'true');
    }
    return formData;
  }

  processDocument(id: string): Observable<DocumentDetailDto> {
    return this.http.post<DocumentDetailDto>(`${this.apiUrl}/${id}/process`, {}, { observe: 'body' });
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
