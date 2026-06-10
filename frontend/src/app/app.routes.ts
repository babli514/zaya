import { Routes } from '@angular/router';
import { DocumentsListComponent } from './pages/documents-list/documents-list.component';
import { DocumentUploadComponent } from './pages/document-upload/document-upload.component';
import { DocumentDetailComponent } from './pages/document-detail/document-detail.component';
import { DocumentReviewComponent } from './pages/document-review/document-review.component';

// export const routes: Routes = [
//   { path: '', redirectTo: 'documents', pathMatch: 'full' },
//   { path: 'documents', component: DocumentsListComponent, pathMatch: 'full' },
//   { path: 'documents/upload', component: DocumentUploadComponent },
//   { path: 'documents/:id', component: DocumentDetailComponent },
//   { path: 'documents/:id/review', component: DocumentReviewComponent },
//   { path: '**', redirectTo: 'documents' }
// ];

export const routes: Routes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },

  // MOST SPECIFIC FIRST
  { path: 'documents/upload', component: DocumentUploadComponent },
  { path: 'documents/:id/review', component: DocumentReviewComponent },
  { path: 'documents/:id', component: DocumentDetailComponent },

  // LEAST SPECIFIC LAST
  { path: 'documents', component: DocumentsListComponent, pathMatch: 'full' },

  { path: '**', redirectTo: 'documents' }
];

