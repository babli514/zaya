import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/main.js");var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/main.ts
import { bootstrapApplication } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_platform-browser.js?v=57d19488";

// src/app/app.config.ts
import { provideZoneChangeDetection } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import { provideHttpClient, withInterceptors } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common_http.js?v=57d19488";
import { provideRouter } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";

// src/app/pages/documents-list/documents-list.component.ts
import { Component } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import { CommonModule } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
import { RouterModule } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import * as i02 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";

// src/app/services/documents-api.service.ts
var documents_api_service_exports = {};
__export(documents_api_service_exports, {
  DocumentsApiService: () => DocumentsApiService
});
import { Injectable } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import * as i0 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import * as i1 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common_http.js?v=57d19488";
var DocumentsApiService = class _DocumentsApiService {
  http;
  apiUrl = "/api/documents";
  constructor(http) {
    this.http = http;
  }
  getDocuments() {
    return this.http.get(this.apiUrl);
  }
  static \u0275fac = function DocumentsApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentsApiService)(i0.\u0275\u0275inject(i1.HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({ token: _DocumentsApiService, factory: _DocumentsApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(DocumentsApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: i1.HttpClient }], null);
})();

// src/app/pages/documents-list/documents-list.component.ts
import * as i2 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
import * as i3 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
var _c0 = (a0) => ["/documents", a0];
function DocumentsListComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "div", 7);
    i02.\u0275\u0275text(1);
    i02.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.loading);
  }
}
function DocumentsListComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = i02.\u0275\u0275getCurrentView();
    i02.\u0275\u0275elementStart(0, "div", 8)(1, "p");
    i02.\u0275\u0275text(2);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(3, "button", 9);
    i02.\u0275\u0275listener("click", function DocumentsListComponent_div_7_Template_button_click_3_listener() {
      i02.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i02.\u0275\u0275nextContext();
      return i02.\u0275\u0275resetView(ctx_r0.loadDocuments());
    });
    i02.\u0275\u0275text(4);
    i02.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.errorMessage);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.retry);
  }
}
function DocumentsListComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "div", 10)(1, "p");
    i02.\u0275\u0275text(2);
    i02.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.empty);
  }
}
function DocumentsListComponent_div_9_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "tr")(1, "td");
    i02.\u0275\u0275text(2);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(3, "td");
    i02.\u0275\u0275text(4);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(5, "td")(6, "span", 13);
    i02.\u0275\u0275text(7);
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(8, "td")(9, "span", 13);
    i02.\u0275\u0275text(10);
    i02.\u0275\u0275elementEnd()();
    i02.\u0275\u0275elementStart(11, "td");
    i02.\u0275\u0275text(12);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(13, "td");
    i02.\u0275\u0275text(14);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(15, "td")(16, "div", 14)(17, "a", 15);
    i02.\u0275\u0275text(18);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(19, "a", 16);
    i02.\u0275\u0275text(20);
    i02.\u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const document_r3 = ctx.$implicit;
    const ctx_r0 = i02.\u0275\u0275nextContext(2);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(document_r3.fileName);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(document_r3.documentType);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275property("ngClass", ctx_r0.getLanguageBadgeClass(document_r3.documentLanguage));
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.getLanguageLabel(document_r3.documentLanguage), " ");
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275property("ngClass", ctx_r0.getStatusBadgeClass(document_r3.status));
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate1(" ", ctx_r0.getStatusLabel(document_r3.status), " ");
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.formatDate(document_r3.uploadedAtUtc));
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.formatDate(document_r3.processedAtUtc));
    i02.\u0275\u0275advance(3);
    i02.\u0275\u0275property("routerLink", i02.\u0275\u0275pureFunction1(11, _c0, document_r3.id));
    i02.\u0275\u0275advance();
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.actions.viewDetails);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.actions.uploadNewDocument);
  }
}
function DocumentsListComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    i02.\u0275\u0275elementStart(0, "div", 11)(1, "table")(2, "thead")(3, "tr")(4, "th");
    i02.\u0275\u0275text(5);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(6, "th");
    i02.\u0275\u0275text(7);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(8, "th");
    i02.\u0275\u0275text(9);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(10, "th");
    i02.\u0275\u0275text(11);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(12, "th");
    i02.\u0275\u0275text(13);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(14, "th");
    i02.\u0275\u0275text(15);
    i02.\u0275\u0275elementEnd();
    i02.\u0275\u0275elementStart(16, "th");
    i02.\u0275\u0275text(17);
    i02.\u0275\u0275elementEnd()()();
    i02.\u0275\u0275elementStart(18, "tbody");
    i02.\u0275\u0275template(19, DocumentsListComponent_div_9_tr_19_Template, 21, 13, "tr", 12);
    i02.\u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = i02.\u0275\u0275nextContext();
    i02.\u0275\u0275advance(5);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.columns.originalFileName);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.columns.documentType);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.columns.documentLanguage);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.columns.processingStatus);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.columns.uploadedDate);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.columns.processedDate);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275textInterpolate(ctx_r0.labels.columns.actions);
    i02.\u0275\u0275advance(2);
    i02.\u0275\u0275property("ngForOf", ctx_r0.documents);
  }
}
var DocumentsListComponent = class _DocumentsListComponent {
  documentsApiService;
  documents = [];
  loading = false;
  errorMessage = "";
  labels = {
    title: "Documents",
    loading: "Loading documents...",
    empty: "No documents found.",
    retry: "Retry",
    columns: {
      originalFileName: "Original file name",
      documentType: "Document type",
      documentLanguage: "Document language",
      processingStatus: "Processing status",
      uploadedDate: "Uploaded date",
      processedDate: "Processed date",
      actions: "Actions"
    },
    actions: {
      viewDetails: "View details",
      uploadNewDocument: "Upload new document"
    }
  };
  statusLabels = {
    Uploaded: "Uploaded",
    Processing: "Processing",
    Completed: "Completed",
    Failed: "Failed",
    NeedsReview: "Needs Review"
  };
  languageLabels = {
    EnglishCanada: "English Canada",
    FrenchCanada: "Fran\xE7ais Canada",
    BilingualCanada: "Bilingual Canada",
    Unknown: "Auto/Unknown"
  };
  constructor(documentsApiService) {
    this.documentsApiService = documentsApiService;
  }
  ngOnInit() {
    this.loadDocuments();
  }
  loadDocuments() {
    this.loading = true;
    this.errorMessage = "";
    this.documentsApiService.getDocuments().subscribe({
      next: (response) => {
        this.documents = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Failed to load documents. Please try again.";
      }
    });
  }
  getStatusLabel(status) {
    return this.statusLabels[status] ?? status;
  }
  getLanguageLabel(language) {
    return this.languageLabels[language] ?? this.languageLabels["Unknown"];
  }
  getStatusBadgeClass(status) {
    const badgeClassMap = {
      Uploaded: "badge-uploaded",
      Processing: "badge-processing",
      Completed: "badge-completed",
      Failed: "badge-failed",
      NeedsReview: "badge-needs-review"
    };
    return badgeClassMap[status] ?? "badge-unknown";
  }
  getLanguageBadgeClass(language) {
    const badgeClassMap = {
      EnglishCanada: "badge-language-en",
      FrenchCanada: "badge-language-fr",
      BilingualCanada: "badge-language-bilingual",
      Unknown: "badge-language-unknown"
    };
    return badgeClassMap[language] ?? "badge-language-unknown";
  }
  formatDate(value) {
    if (!value) {
      return "-";
    }
    return new Date(value).toLocaleString();
  }
  static \u0275fac = function DocumentsListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentsListComponent)(i02.\u0275\u0275directiveInject(DocumentsApiService));
  };
  static \u0275cmp = /* @__PURE__ */ i02.\u0275\u0275defineComponent({ type: _DocumentsListComponent, selectors: [["app-documents-list"]], decls: 10, vars: 6, consts: [[1, "container"], [1, "header"], ["routerLink", "/documents/upload", 1, "btn", "btn-primary"], ["class", "loading-state", 4, "ngIf"], ["class", "error-state", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "table-wrapper", 4, "ngIf"], [1, "loading-state"], [1, "error-state"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], [1, "empty-state"], [1, "table-wrapper"], [4, "ngFor", "ngForOf"], [1, "badge", 3, "ngClass"], [1, "row-actions"], [1, "btn", "btn-link", 3, "routerLink"], ["routerLink", "/documents/upload", 1, "btn", "btn-link"]], template: function DocumentsListComponent_Template(rf, ctx) {
    if (rf & 1) {
      i02.\u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
      i02.\u0275\u0275text(3);
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(4, "a", 2);
      i02.\u0275\u0275text(5);
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275template(6, DocumentsListComponent_div_6_Template, 2, 1, "div", 3)(7, DocumentsListComponent_div_7_Template, 5, 2, "div", 4)(8, DocumentsListComponent_div_8_Template, 3, 1, "div", 5)(9, DocumentsListComponent_div_9_Template, 20, 8, "div", 6);
      i02.\u0275\u0275elementEnd();
    }
    if (rf & 2) {
      i02.\u0275\u0275advance(3);
      i02.\u0275\u0275textInterpolate(ctx.labels.title);
      i02.\u0275\u0275advance(2);
      i02.\u0275\u0275textInterpolate(ctx.labels.actions.uploadNewDocument);
      i02.\u0275\u0275advance();
      i02.\u0275\u0275property("ngIf", ctx.loading);
      i02.\u0275\u0275advance();
      i02.\u0275\u0275property("ngIf", !ctx.loading && ctx.errorMessage);
      i02.\u0275\u0275advance();
      i02.\u0275\u0275property("ngIf", !ctx.loading && !ctx.errorMessage && ctx.documents.length === 0);
      i02.\u0275\u0275advance();
      i02.\u0275\u0275property("ngIf", !ctx.loading && !ctx.errorMessage && ctx.documents.length > 0);
    }
  }, dependencies: [CommonModule, i2.NgClass, i2.NgComponentOutlet, i2.NgForOf, i2.NgIf, i2.NgTemplateOutlet, i2.NgStyle, i2.NgSwitch, i2.NgSwitchCase, i2.NgSwitchDefault, i2.NgPlural, i2.NgPluralCase, RouterModule, i3.RouterOutlet, i3.RouterLink, i3.RouterLinkActive, i3.\u0275EmptyOutletComponent, i2.AsyncPipe, i2.UpperCasePipe, i2.LowerCasePipe, i2.JsonPipe, i2.SlicePipe, i2.DecimalPipe, i2.PercentPipe, i2.TitleCasePipe, i2.CurrencyPipe, i2.DatePipe, i2.I18nPluralPipe, i2.I18nSelectPipe, i2.KeyValuePipe], styles: ["\n.container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 24px;\n}\n.header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 28px;\n  font-weight: 600;\n}\n.loading-state[_ngcontent-%COMP%], \n.error-state[_ngcontent-%COMP%], \n.empty-state[_ngcontent-%COMP%] {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  padding: 20px;\n  background-color: #ffffff;\n  color: #475467;\n}\n.error-state[_ngcontent-%COMP%] {\n  border-color: #fda29b;\n  color: #b42318;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n}\n.error-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.table-wrapper[_ngcontent-%COMP%] {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  overflow: hidden;\n  background-color: #ffffff;\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\nthead[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 12px 14px;\n  border-bottom: 1px solid #e4e7ec;\n  vertical-align: middle;\n  font-size: 14px;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.btn[_ngcontent-%COMP%] {\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  text-decoration: none;\n  font-weight: 600;\n  font-size: 14px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background-color: #2563eb;\n  color: #ffffff;\n  padding: 10px 16px;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  background-color: #1d4ed8;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background-color: #475467;\n  color: #ffffff;\n  padding: 8px 14px;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background-color: #344054;\n}\n.btn-link[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #175cd3;\n  padding: 0;\n}\n.row-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 1;\n  white-space: nowrap;\n}\n.badge-uploaded[_ngcontent-%COMP%] {\n  background-color: #eff8ff;\n  color: #175cd3;\n}\n.badge-processing[_ngcontent-%COMP%] {\n  background-color: #ecfdf3;\n  color: #027a48;\n}\n.badge-completed[_ngcontent-%COMP%] {\n  background-color: #ecfdf3;\n  color: #027a48;\n}\n.badge-failed[_ngcontent-%COMP%] {\n  background-color: #fef3f2;\n  color: #b42318;\n}\n.badge-needs-review[_ngcontent-%COMP%] {\n  background-color: #fff7ed;\n  color: #b54708;\n}\n.badge-unknown[_ngcontent-%COMP%] {\n  background-color: #f2f4f7;\n  color: #475467;\n}\n.badge-language-en[_ngcontent-%COMP%] {\n  background-color: #eff8ff;\n  color: #175cd3;\n}\n.badge-language-fr[_ngcontent-%COMP%] {\n  background-color: #f5f3ff;\n  color: #6941c6;\n}\n.badge-language-bilingual[_ngcontent-%COMP%] {\n  background-color: #ecfdf3;\n  color: #027a48;\n}\n.badge-language-unknown[_ngcontent-%COMP%] {\n  background-color: #f2f4f7;\n  color: #475467;\n}\n/*# sourceMappingURL=documents-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(DocumentsListComponent, [{
    type: Component,
    args: [{ selector: "app-documents-list", standalone: true, imports: [CommonModule, RouterModule], template: `
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
  `, styles: ["/* angular:styles/component:css;2db20754fcc3ab03cd9d1c495b05580f604d89888b34b2b798694f78e6f8ed4a;E:/Zaya/frontend/src/app/pages/documents-list/documents-list.component.ts */\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 24px;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n}\nh1 {\n  margin: 0;\n  font-size: 28px;\n  font-weight: 600;\n}\n.loading-state,\n.error-state,\n.empty-state {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  padding: 20px;\n  background-color: #ffffff;\n  color: #475467;\n}\n.error-state {\n  border-color: #fda29b;\n  color: #b42318;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n}\n.error-state p {\n  margin: 0;\n}\n.table-wrapper {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  overflow: hidden;\n  background-color: #ffffff;\n}\ntable {\n  width: 100%;\n  border-collapse: collapse;\n}\nthead {\n  background-color: #f9fafb;\n}\nth,\ntd {\n  text-align: left;\n  padding: 12px 14px;\n  border-bottom: 1px solid #e4e7ec;\n  vertical-align: middle;\n  font-size: 14px;\n}\ntbody tr:last-child td {\n  border-bottom: none;\n}\n.btn {\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  text-decoration: none;\n  font-weight: 600;\n  font-size: 14px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.btn-primary {\n  background-color: #2563eb;\n  color: #ffffff;\n  padding: 10px 16px;\n}\n.btn-primary:hover {\n  background-color: #1d4ed8;\n}\n.btn-secondary {\n  background-color: #475467;\n  color: #ffffff;\n  padding: 8px 14px;\n}\n.btn-secondary:hover {\n  background-color: #344054;\n}\n.btn-link {\n  background: transparent;\n  color: #175cd3;\n  padding: 0;\n}\n.row-actions {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.badge {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 1;\n  white-space: nowrap;\n}\n.badge-uploaded {\n  background-color: #eff8ff;\n  color: #175cd3;\n}\n.badge-processing {\n  background-color: #ecfdf3;\n  color: #027a48;\n}\n.badge-completed {\n  background-color: #ecfdf3;\n  color: #027a48;\n}\n.badge-failed {\n  background-color: #fef3f2;\n  color: #b42318;\n}\n.badge-needs-review {\n  background-color: #fff7ed;\n  color: #b54708;\n}\n.badge-unknown {\n  background-color: #f2f4f7;\n  color: #475467;\n}\n.badge-language-en {\n  background-color: #eff8ff;\n  color: #175cd3;\n}\n.badge-language-fr {\n  background-color: #f5f3ff;\n  color: #6941c6;\n}\n.badge-language-bilingual {\n  background-color: #ecfdf3;\n  color: #027a48;\n}\n.badge-language-unknown {\n  background-color: #f2f4f7;\n  color: #475467;\n}\n/*# sourceMappingURL=documents-list.component.css.map */\n"] }]
  }], () => [{ type: DocumentsApiService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassDebugInfo(DocumentsListComponent, { className: "DocumentsListComponent", filePath: "app/pages/documents-list/documents-list.component.ts", lineNumber: 251 });
})();
(() => {
  const id = "app%2Fpages%2Fdocuments-list%2Fdocuments-list.component.ts%40DocumentsListComponent";
  function DocumentsListComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i02.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i02.\u0275\u0275replaceMetadata(DocumentsListComponent, m.default, [i02, i2, i3, documents_api_service_exports], [CommonModule, RouterModule, Component], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && DocumentsListComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && DocumentsListComponent_HmrLoad(d.timestamp)));
})();

// src/app/pages/document-upload/document-upload.component.ts
import { HttpErrorResponse, HttpEventType } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common_http.js?v=57d19488";
import { Component as Component2 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import { CommonModule as CommonModule2 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
import { FormsModule } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_forms.js?v=57d19488";
import { RouterModule as RouterModule2 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import * as i04 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";

// src/app/services/document.service.ts
var document_service_exports = {};
__export(document_service_exports, {
  DocumentService: () => DocumentService
});
import { Injectable as Injectable2 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import * as i03 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import * as i12 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common_http.js?v=57d19488";
var DocumentService = class _DocumentService {
  http;
  apiUrl = "/api/documents";
  constructor(http) {
    this.http = http;
  }
  getAllDocuments() {
    return this.http.get(this.apiUrl);
  }
  getDocument(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getDocumentResult(id) {
    return this.http.get(`${this.apiUrl}/${id}/result`);
  }
  getRawText(id) {
    return this.http.get(`${this.apiUrl}/${id}/raw-text`);
  }
  getDocumentFileUrl(id) {
    return `${this.apiUrl}/${id}/file`;
  }
  updateExtractedFields(id, request) {
    return this.http.put(`${this.apiUrl}/${id}/extracted-fields`, request);
  }
  uploadDocument(file, documentType, documentLanguage, enqueueProcessing = false) {
    const formData = this.createUploadFormData([file], documentType, documentLanguage, enqueueProcessing);
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      observe: "events",
      reportProgress: true
    });
  }
  createUploadFormData(files, documentType, documentLanguage, enqueueProcessing) {
    const formData = new FormData();
    const file = files[0];
    if (file) {
      formData.append("file", file);
    }
    formData.append("documentType", documentType);
    formData.append("documentLanguage", documentLanguage);
    if (enqueueProcessing) {
      formData.append("enqueueProcessing", "true");
    }
    return formData;
  }
  processDocument(id) {
    return this.http.post(`${this.apiUrl}/${id}/process`, {}, { observe: "body" });
  }
  getJsonExportUrl(id) {
    return `${this.apiUrl}/${id}/export/json`;
  }
  getCsvExportUrl(id) {
    return `${this.apiUrl}/${id}/export/csv`;
  }
  deleteDocument(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  static \u0275fac = function DocumentService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentService)(i03.\u0275\u0275inject(i12.HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ i03.\u0275\u0275defineInjectable({ token: _DocumentService, factory: _DocumentService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(DocumentService, [{
    type: Injectable2,
    args: [{ providedIn: "root" }]
  }], () => [{ type: i12.HttpClient }], null);
})();

// src/app/pages/document-upload/document-upload.component.ts
import * as i22 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import * as i32 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
import * as i4 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_forms.js?v=57d19488";
function DocumentUploadComponent_option_8_Template(rf, ctx) {
  if (rf & 1) {
    i04.\u0275\u0275elementStart(0, "option", 19);
    i04.\u0275\u0275text(1);
    i04.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r2 = ctx.$implicit;
    i04.\u0275\u0275property("value", option_r2.value);
    i04.\u0275\u0275advance();
    i04.\u0275\u0275textInterpolate(option_r2.label);
  }
}
function DocumentUploadComponent_option_13_Template(rf, ctx) {
  if (rf & 1) {
    i04.\u0275\u0275elementStart(0, "option", 19);
    i04.\u0275\u0275text(1);
    i04.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r3 = ctx.$implicit;
    i04.\u0275\u0275property("value", option_r3.value);
    i04.\u0275\u0275advance();
    i04.\u0275\u0275textInterpolate(option_r3.label);
  }
}
function DocumentUploadComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    i04.\u0275\u0275elementStart(0, "div", 20);
    i04.\u0275\u0275text(1);
    i04.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = i04.\u0275\u0275nextContext();
    i04.\u0275\u0275advance();
    i04.\u0275\u0275textInterpolate1(" ", ctx_r4.error, " ");
  }
}
function DocumentUploadComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    i04.\u0275\u0275elementStart(0, "div", 21);
    i04.\u0275\u0275text(1);
    i04.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = i04.\u0275\u0275nextContext();
    i04.\u0275\u0275advance();
    i04.\u0275\u0275textInterpolate1(" ", ctx_r4.successMessage, " ");
  }
}
function DocumentUploadComponent_div_31_p_4_Template(rf, ctx) {
  if (rf & 1) {
    i04.\u0275\u0275elementStart(0, "p", 25);
    i04.\u0275\u0275text(1);
    i04.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = i04.\u0275\u0275nextContext(2);
    i04.\u0275\u0275advance();
    i04.\u0275\u0275textInterpolate1("", ctx_r4.uploadProgress, "%");
  }
}
function DocumentUploadComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    i04.\u0275\u0275elementStart(0, "div", 22);
    i04.\u0275\u0275element(1, "div", 23);
    i04.\u0275\u0275elementStart(2, "p");
    i04.\u0275\u0275text(3);
    i04.\u0275\u0275elementEnd();
    i04.\u0275\u0275template(4, DocumentUploadComponent_div_31_p_4_Template, 2, 1, "p", 24);
    i04.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = i04.\u0275\u0275nextContext();
    i04.\u0275\u0275advance(3);
    i04.\u0275\u0275textInterpolate(ctx_r4.processing ? ctx_r4.labels.status.processing : ctx_r4.labels.status.uploading);
    i04.\u0275\u0275advance();
    i04.\u0275\u0275property("ngIf", ctx_r4.uploading && ctx_r4.uploadProgress > 0);
  }
}
var UPLOAD_LABELS = {
  title: "Upload Document",
  fields: {
    documentType: "Document type",
    documentLanguage: "Document language",
    selectFile: "Select file",
    processAfterUpload: "Automatically process after upload"
  },
  buttons: {
    chooseFile: "Choose file",
    uploadOnly: "Upload only",
    uploadAndProcess: "Upload and process now",
    cancel: "Cancel"
  },
  file: {
    noneSelected: "No file selected",
    invalidType: "Unsupported file type. Allowed: PDF, PNG, JPG, JPEG, WEBP.",
    tooLarge: "File size exceeds the maximum allowed size of 10 MB."
  },
  status: {
    uploading: "Uploading...",
    processing: "Processing document...",
    uploadSuccess: "Upload successful. Redirecting to document details...",
    processSuccess: "Document processed successfully. Redirecting to document details..."
  },
  validation: {
    fileRequired: "Please select a file before uploading."
  }
};
var DOCUMENT_TYPE_OPTIONS = [
  { value: "receipt", label: "Receipt" },
  { value: "invoice", label: "Invoice" }
];
var DOCUMENT_LANGUAGE_OPTIONS = [
  { value: "auto", label: "Auto-detect" },
  { value: "en-CA", label: "English Canada" },
  { value: "fr-CA", label: "Fran\xE7ais Canada" },
  { value: "bilingual-CA", label: "Bilingual Canada" }
];
var DocumentUploadComponent = class _DocumentUploadComponent {
  documentService;
  router;
  labels = UPLOAD_LABELS;
  documentTypeOptions = DOCUMENT_TYPE_OPTIONS;
  documentLanguageOptions = DOCUMENT_LANGUAGE_OPTIONS;
  maxSelectableFiles = 1;
  maxFileSizeBytes = 10 * 1024 * 1024;
  allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
  allowedExtensions = ["pdf", "png", "jpg", "jpeg", "webp"];
  selectedFiles = [];
  selectedFileDisplay = "";
  documentType = "receipt";
  documentLanguage = "auto";
  processAfterUpload = false;
  uploading = false;
  processing = false;
  uploadProgress = 0;
  error = "";
  successMessage = "";
  constructor(documentService, router) {
    this.documentService = documentService;
    this.router = router;
  }
  onFileSelected(event) {
    const input = event.target;
    const files = this.getSelectedFiles(input);
    this.error = "";
    this.successMessage = "";
    this.selectedFiles = [];
    this.selectedFileDisplay = "";
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    if (!this.isSupportedFileType(file)) {
      this.error = this.labels.file.invalidType;
      return;
    }
    if (file.size > this.maxFileSizeBytes) {
      this.error = this.labels.file.tooLarge;
      return;
    }
    this.selectedFiles = [file];
    this.selectedFileDisplay = `${file.name} (${this.formatFileSize(file.size)})`;
  }
  submit(enqueueProcessing) {
    const uploadFile = this.selectedFiles[0];
    if (!uploadFile) {
      this.error = this.labels.validation.fileRequired;
      return;
    }
    this.uploading = true;
    this.processing = false;
    this.uploadProgress = 0;
    this.error = "";
    this.successMessage = "";
    this.documentService.uploadDocument(uploadFile, this.documentType, this.documentLanguage, enqueueProcessing).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total && event.total > 0) {
            this.uploadProgress = Math.round(event.loaded / event.total * 100);
          }
          return;
        }
        if (event.type !== HttpEventType.Response || !event.body) {
          return;
        }
        this.uploading = false;
        const uploadResponse = event.body;
        const shouldProcess = enqueueProcessing || this.processAfterUpload;
        if (!shouldProcess) {
          this.successMessage = this.labels.status.uploadSuccess;
          this.navigateToDocument(uploadResponse.documentId);
          return;
        }
        this.processing = false;
        this.successMessage = this.labels.status.processSuccess;
        this.navigateToDocument(uploadResponse.documentId);
      },
      error: (err) => {
        this.uploading = false;
        this.processing = false;
        this.error = this.getBackendErrorMessage(err);
      }
    });
  }
  navigateToDocument(documentId) {
    setTimeout(() => {
      this.router.navigate(["/documents", documentId]);
    }, 700);
  }
  getSelectedFiles(input) {
    const fileList = input.files;
    if (!fileList || fileList.length === 0) {
      return [];
    }
    const files = Array.from(fileList);
    return files.slice(0, this.maxSelectableFiles);
  }
  isSupportedFileType(file) {
    const extension = this.getFileExtension(file.name);
    const extensionAllowed = extension ? this.allowedExtensions.includes(extension) : false;
    if (extensionAllowed) {
      return true;
    }
    return this.allowedMimeTypes.includes(file.type);
  }
  getFileExtension(fileName) {
    const lastDot = fileName.lastIndexOf(".");
    if (lastDot < 0 || lastDot === fileName.length - 1) {
      return "";
    }
    return fileName.slice(lastDot + 1).toLowerCase();
  }
  formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  getBackendErrorMessage(error) {
    if (!(error instanceof HttpErrorResponse)) {
      return "Unexpected error while uploading the document.";
    }
    const payload = error.error;
    if (typeof payload === "string" && payload.trim().length > 0) {
      return payload;
    }
    if (payload && typeof payload === "object") {
      const messageValue = payload.message;
      if (typeof messageValue === "string" && messageValue.trim().length > 0) {
        return messageValue;
      }
      const errorsValue = payload.errors;
      if (errorsValue && typeof errorsValue === "object") {
        const flattened = Object.values(errorsValue).flatMap((entry) => Array.isArray(entry) ? entry : [entry]).filter((entry) => typeof entry === "string" && entry.trim().length > 0);
        if (flattened.length > 0) {
          return flattened.join(" ");
        }
      }
    }
    if (typeof error.message === "string" && error.message.trim().length > 0) {
      return error.message;
    }
    return "Upload failed. Please verify the document and try again.";
  }
  static \u0275fac = function DocumentUploadComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentUploadComponent)(i04.\u0275\u0275directiveInject(DocumentService), i04.\u0275\u0275directiveInject(i22.Router));
  };
  static \u0275cmp = /* @__PURE__ */ i04.\u0275\u0275defineComponent({ type: _DocumentUploadComponent, selectors: [["app-document-upload"]], decls: 39, vars: 20, consts: [["fileInput", ""], [1, "container"], [1, "upload-section"], [1, "form-group"], [1, "form-control", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [1, "file-input-wrapper"], ["type", "file", "accept", ".pdf,.png,.jpg,.jpeg,.webp", 1, "file-input", 3, "change"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], [1, "file-name"], [1, "form-group", "checkbox-row"], [1, "checkbox-label"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], ["class", "alert alert-danger", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["class", "uploading", 4, "ngIf"], [1, "button-row"], ["type", "button", 1, "btn", "btn-primary", "btn-lg", 3, "click", "disabled"], ["routerLink", "/documents", 1, "btn", "btn-secondary", "btn-lg"], [3, "value"], [1, "alert", "alert-danger"], [1, "alert", "alert-success"], [1, "uploading"], [1, "spinner"], ["class", "progress", 4, "ngIf"], [1, "progress"]], template: function DocumentUploadComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = i04.\u0275\u0275getCurrentView();
      i04.\u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h1");
      i04.\u0275\u0275text(3);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(4, "div", 3)(5, "label");
      i04.\u0275\u0275text(6);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(7, "select", 4);
      i04.\u0275\u0275twoWayListener("ngModelChange", function DocumentUploadComponent_Template_select_ngModelChange_7_listener($event) {
        i04.\u0275\u0275restoreView(_r1);
        i04.\u0275\u0275twoWayBindingSet(ctx.documentType, $event) || (ctx.documentType = $event);
        return i04.\u0275\u0275resetView($event);
      });
      i04.\u0275\u0275template(8, DocumentUploadComponent_option_8_Template, 2, 2, "option", 5);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275controlCreate();
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(9, "div", 3)(10, "label");
      i04.\u0275\u0275text(11);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(12, "select", 4);
      i04.\u0275\u0275twoWayListener("ngModelChange", function DocumentUploadComponent_Template_select_ngModelChange_12_listener($event) {
        i04.\u0275\u0275restoreView(_r1);
        i04.\u0275\u0275twoWayBindingSet(ctx.documentLanguage, $event) || (ctx.documentLanguage = $event);
        return i04.\u0275\u0275resetView($event);
      });
      i04.\u0275\u0275template(13, DocumentUploadComponent_option_13_Template, 2, 2, "option", 5);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275controlCreate();
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(14, "div", 3)(15, "label");
      i04.\u0275\u0275text(16);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(17, "div", 6)(18, "input", 7, 0);
      i04.\u0275\u0275listener("change", function DocumentUploadComponent_Template_input_change_18_listener($event) {
        return ctx.onFileSelected($event);
      });
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(20, "button", 8);
      i04.\u0275\u0275listener("click", function DocumentUploadComponent_Template_button_click_20_listener() {
        i04.\u0275\u0275restoreView(_r1);
        const fileInput_r4 = i04.\u0275\u0275reference(19);
        return i04.\u0275\u0275resetView(fileInput_r4.click());
      });
      i04.\u0275\u0275text(21);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(22, "span", 9);
      i04.\u0275\u0275text(23);
      i04.\u0275\u0275elementEnd()()();
      i04.\u0275\u0275elementStart(24, "div", 10)(25, "label", 11)(26, "input", 12);
      i04.\u0275\u0275twoWayListener("ngModelChange", function DocumentUploadComponent_Template_input_ngModelChange_26_listener($event) {
        i04.\u0275\u0275restoreView(_r1);
        i04.\u0275\u0275twoWayBindingSet(ctx.processAfterUpload, $event) || (ctx.processAfterUpload = $event);
        return i04.\u0275\u0275resetView($event);
      });
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275controlCreate();
      i04.\u0275\u0275elementStart(27, "span");
      i04.\u0275\u0275text(28);
      i04.\u0275\u0275elementEnd()()();
      i04.\u0275\u0275template(29, DocumentUploadComponent_div_29_Template, 2, 1, "div", 13)(30, DocumentUploadComponent_div_30_Template, 2, 1, "div", 14)(31, DocumentUploadComponent_div_31_Template, 5, 2, "div", 15);
      i04.\u0275\u0275elementStart(32, "div", 16)(33, "button", 17);
      i04.\u0275\u0275listener("click", function DocumentUploadComponent_Template_button_click_33_listener() {
        return ctx.submit(false);
      });
      i04.\u0275\u0275text(34);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(35, "button", 17);
      i04.\u0275\u0275listener("click", function DocumentUploadComponent_Template_button_click_35_listener() {
        return ctx.submit(true);
      });
      i04.\u0275\u0275text(36);
      i04.\u0275\u0275elementEnd();
      i04.\u0275\u0275elementStart(37, "a", 18);
      i04.\u0275\u0275text(38);
      i04.\u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      i04.\u0275\u0275advance(3);
      i04.\u0275\u0275textInterpolate(ctx.labels.title);
      i04.\u0275\u0275advance(3);
      i04.\u0275\u0275textInterpolate(ctx.labels.fields.documentType);
      i04.\u0275\u0275advance();
      i04.\u0275\u0275twoWayProperty("ngModel", ctx.documentType);
      i04.\u0275\u0275control();
      i04.\u0275\u0275advance();
      i04.\u0275\u0275property("ngForOf", ctx.documentTypeOptions);
      i04.\u0275\u0275advance(3);
      i04.\u0275\u0275textInterpolate(ctx.labels.fields.documentLanguage);
      i04.\u0275\u0275advance();
      i04.\u0275\u0275twoWayProperty("ngModel", ctx.documentLanguage);
      i04.\u0275\u0275control();
      i04.\u0275\u0275advance();
      i04.\u0275\u0275property("ngForOf", ctx.documentLanguageOptions);
      i04.\u0275\u0275advance(3);
      i04.\u0275\u0275textInterpolate(ctx.labels.fields.selectFile);
      i04.\u0275\u0275advance(5);
      i04.\u0275\u0275textInterpolate1(" ", ctx.labels.buttons.chooseFile, " ");
      i04.\u0275\u0275advance(2);
      i04.\u0275\u0275textInterpolate(ctx.selectedFileDisplay || ctx.labels.file.noneSelected);
      i04.\u0275\u0275advance(3);
      i04.\u0275\u0275twoWayProperty("ngModel", ctx.processAfterUpload);
      i04.\u0275\u0275control();
      i04.\u0275\u0275advance(2);
      i04.\u0275\u0275textInterpolate(ctx.labels.fields.processAfterUpload);
      i04.\u0275\u0275advance();
      i04.\u0275\u0275property("ngIf", ctx.error);
      i04.\u0275\u0275advance();
      i04.\u0275\u0275property("ngIf", ctx.successMessage);
      i04.\u0275\u0275advance();
      i04.\u0275\u0275property("ngIf", ctx.uploading || ctx.processing);
      i04.\u0275\u0275advance(2);
      i04.\u0275\u0275property("disabled", ctx.selectedFiles.length === 0 || ctx.uploading || ctx.processing);
      i04.\u0275\u0275advance();
      i04.\u0275\u0275textInterpolate1(" ", ctx.labels.buttons.uploadOnly, " ");
      i04.\u0275\u0275advance();
      i04.\u0275\u0275property("disabled", ctx.selectedFiles.length === 0 || ctx.uploading || ctx.processing);
      i04.\u0275\u0275advance();
      i04.\u0275\u0275textInterpolate1(" ", ctx.labels.buttons.uploadAndProcess, " ");
      i04.\u0275\u0275advance(2);
      i04.\u0275\u0275textInterpolate(ctx.labels.buttons.cancel);
    }
  }, dependencies: [CommonModule2, i32.NgClass, i32.NgComponentOutlet, i32.NgForOf, i32.NgIf, i32.NgTemplateOutlet, i32.NgStyle, i32.NgSwitch, i32.NgSwitchCase, i32.NgSwitchDefault, i32.NgPlural, i32.NgPluralCase, FormsModule, i4.\u0275NgNoValidate, i4.NgSelectOption, i4.\u0275NgSelectMultipleOption, i4.DefaultValueAccessor, i4.NumberValueAccessor, i4.RangeValueAccessor, i4.CheckboxControlValueAccessor, i4.SelectControlValueAccessor, i4.SelectMultipleControlValueAccessor, i4.RadioControlValueAccessor, i4.NgControlStatus, i4.NgControlStatusGroup, i4.RequiredValidator, i4.MinLengthValidator, i4.MaxLengthValidator, i4.PatternValidator, i4.CheckboxRequiredValidator, i4.EmailValidator, i4.MinValidator, i4.MaxValidator, i4.NgModel, i4.NgModelGroup, i4.NgForm, RouterModule2, i22.RouterOutlet, i22.RouterLink, i22.RouterLinkActive, i22.\u0275EmptyOutletComponent, i32.AsyncPipe, i32.UpperCasePipe, i32.LowerCasePipe, i32.JsonPipe, i32.SlicePipe, i32.DecimalPipe, i32.PercentPipe, i32.TitleCasePipe, i32.CurrencyPipe, i32.DatePipe, i32.I18nPluralPipe, i32.I18nSelectPipe, i32.KeyValuePipe], styles: ["\n.container[_ngcontent-%COMP%] {\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.upload-section[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 8px;\n  padding: 40px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\nh1[_ngcontent-%COMP%] {\n  margin-bottom: 30px;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\nlabel[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 500;\n}\n.form-control[_ngcontent-%COMP%], \n.btn[_ngcontent-%COMP%] {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n}\n.form-control[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n}\n.file-input-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n}\n.file-input[_ngcontent-%COMP%] {\n  display: none;\n}\n.file-name[_ngcontent-%COMP%] {\n  flex: 1;\n  color: #666;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.checkbox-row[_ngcontent-%COMP%] {\n  margin-top: -4px;\n}\n.checkbox-label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 0;\n  cursor: pointer;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n  text-decoration: none;\n  display: inline-block;\n  text-align: center;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background-color: #6c757d;\n  color: white;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background-color: #5a6268;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background-color: #007bff;\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background-color: #0056b3;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  background-color: #ccc;\n  cursor: not-allowed;\n}\n.btn-lg[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  font-size: 16px;\n}\n.button-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr auto;\n  gap: 10px;\n  align-items: center;\n  margin-top: 10px;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 15px;\n  border-radius: 4px;\n  margin-bottom: 20px;\n}\n.alert-danger[_ngcontent-%COMP%] {\n  background-color: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background-color: #d1e7dd;\n  color: #0f5132;\n  border: 1px solid #badbcc;\n}\n.uploading[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 20px;\n  margin-bottom: 20px;\n}\n.progress[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 600;\n}\n.spinner[_ngcontent-%COMP%] {\n  border: 4px solid #f3f3f3;\n  border-top: 4px solid #007bff;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin: 0 auto 10px;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 720px) {\n  .button-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=document-upload.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassMetadata(DocumentUploadComponent, [{
    type: Component2,
    args: [{ selector: "app-document-upload", standalone: true, imports: [CommonModule2, FormsModule, RouterModule2], template: `
    <div class="container">
      <div class="upload-section">
        <h1>{{ labels.title }}</h1>

        <div class="form-group">
          <label>{{ labels.fields.documentType }}</label>
          <select [(ngModel)]="documentType" class="form-control">
            <option *ngFor="let option of documentTypeOptions" [value]="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ labels.fields.documentLanguage }}</label>
          <select [(ngModel)]="documentLanguage" class="form-control">
            <option *ngFor="let option of documentLanguageOptions" [value]="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ labels.fields.selectFile }}</label>
          <div class="file-input-wrapper">
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              class="file-input"
            />
            <button type="button" (click)="fileInput.click()" class="btn btn-secondary">
              {{ labels.buttons.chooseFile }}
            </button>
            <span class="file-name">{{ selectedFileDisplay || labels.file.noneSelected }}</span>
          </div>
        </div>

        <div class="form-group checkbox-row">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="processAfterUpload" />
            <span>{{ labels.fields.processAfterUpload }}</span>
          </label>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div *ngIf="uploading || processing" class="uploading">
          <div class="spinner"></div>
          <p>{{ processing ? labels.status.processing : labels.status.uploading }}</p>
          <p *ngIf="uploading && uploadProgress > 0" class="progress">{{ uploadProgress }}%</p>
        </div>

        <div class="button-row">
          <button
            type="button"
            [disabled]="selectedFiles.length === 0 || uploading || processing"
            (click)="submit(false)"
            class="btn btn-primary btn-lg"
          >
            {{ labels.buttons.uploadOnly }}
          </button>

          <button
            type="button"
            [disabled]="selectedFiles.length === 0 || uploading || processing"
            (click)="submit(true)"
            class="btn btn-primary btn-lg"
          >
            {{ labels.buttons.uploadAndProcess }}
          </button>

          <a routerLink="/documents" class="btn btn-secondary btn-lg">{{ labels.buttons.cancel }}</a>
        </div>
      </div>
    </div>
  `, styles: ["/* angular:styles/component:css;c327a169448034fcf129667772ea8072ce586dabb4e846c4196d55ee2262bca3;E:/Zaya/frontend/src/app/pages/document-upload/document-upload.component.ts */\n.container {\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.upload-section {\n  background: white;\n  border-radius: 8px;\n  padding: 40px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\nh1 {\n  margin-bottom: 30px;\n}\n.form-group {\n  margin-bottom: 20px;\n}\nlabel {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 500;\n}\n.form-control,\n.btn {\n  padding: 10px 15px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n}\n.form-control {\n  width: 100%;\n  box-sizing: border-box;\n}\n.file-input-wrapper {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n}\n.file-input {\n  display: none;\n}\n.file-name {\n  flex: 1;\n  color: #666;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.checkbox-row {\n  margin-top: -4px;\n}\n.checkbox-label {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 0;\n  cursor: pointer;\n}\n.btn {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n  text-decoration: none;\n  display: inline-block;\n  text-align: center;\n}\n.btn-secondary {\n  background-color: #6c757d;\n  color: white;\n}\n.btn-secondary:hover {\n  background-color: #5a6268;\n}\n.btn-primary {\n  background-color: #007bff;\n  color: white;\n}\n.btn-primary:hover:not(:disabled) {\n  background-color: #0056b3;\n}\n.btn-primary:disabled {\n  background-color: #ccc;\n  cursor: not-allowed;\n}\n.btn-lg {\n  padding: 12px 24px;\n  font-size: 16px;\n}\n.button-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr auto;\n  gap: 10px;\n  align-items: center;\n  margin-top: 10px;\n}\n.alert {\n  padding: 15px;\n  border-radius: 4px;\n  margin-bottom: 20px;\n}\n.alert-danger {\n  background-color: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n}\n.alert-success {\n  background-color: #d1e7dd;\n  color: #0f5132;\n  border: 1px solid #badbcc;\n}\n.uploading {\n  text-align: center;\n  padding: 20px;\n  margin-bottom: 20px;\n}\n.progress {\n  margin: 0;\n  font-weight: 600;\n}\n.spinner {\n  border: 4px solid #f3f3f3;\n  border-top: 4px solid #007bff;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 10px;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 720px) {\n  .button-row {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=document-upload.component.css.map */\n"] }]
  }], () => [{ type: DocumentService }, { type: i22.Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassDebugInfo(DocumentUploadComponent, { className: "DocumentUploadComponent", filePath: "app/pages/document-upload/document-upload.component.ts", lineNumber: 309 });
})();
(() => {
  const id = "app%2Fpages%2Fdocument-upload%2Fdocument-upload.component.ts%40DocumentUploadComponent";
  function DocumentUploadComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i04.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i04.\u0275\u0275replaceMetadata(DocumentUploadComponent, m.default, [i04, i32, i4, i22, document_service_exports], [CommonModule2, FormsModule, RouterModule2, Component2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && DocumentUploadComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && DocumentUploadComponent_HmrLoad(d.timestamp)));
})();

// src/app/pages/document-detail/document-detail.component.ts
import { Component as Component3 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import { CommonModule as CommonModule3 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
import { RouterModule as RouterModule3 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import { catchError, of, switchMap, timer, timeout } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/rxjs.js?v=57d19488";
import * as i05 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import * as i23 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import * as i33 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_platform-browser.js?v=57d19488";
import * as i42 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
var _c02 = (a0) => ["/documents", a0, "review"];
var _c1 = () => [];
function DocumentDetailComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 4);
    i05.\u0275\u0275text(1, "Loading document details...");
    i05.\u0275\u0275elementEnd();
  }
}
function DocumentDetailComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 5)(1, "p");
    i05.\u0275\u0275text(2);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "a", 6);
    i05.\u0275\u0275text(4, "Back to list");
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(ctx_r0.loadError);
  }
}
function DocumentDetailComponent_div_3_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "div", 32)(1, "iframe", 33);
    i05.\u0275\u0275listener("error", function DocumentDetailComponent_div_3_div_5_Template_iframe_error_1_listener() {
      i05.\u0275\u0275restoreView(_r3);
      const ctx_r0 = i05.\u0275\u0275nextContext(2);
      return i05.\u0275\u0275resetView(ctx_r0.onPreviewError());
    });
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("src", ctx_r0.safePreviewUrl, i05.\u0275\u0275sanitizeResourceUrl);
  }
}
function DocumentDetailComponent_div_3_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "div", 32)(1, "img", 34);
    i05.\u0275\u0275listener("error", function DocumentDetailComponent_div_3_div_6_Template_img_error_1_listener() {
      i05.\u0275\u0275restoreView(_r4);
      const ctx_r0 = i05.\u0275\u0275nextContext(2);
      return i05.\u0275\u0275resetView(ctx_r0.onPreviewError());
    });
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("src", ctx_r0.previewUrl, i05.\u0275\u0275sanitizeUrl)("alt", ctx_r0.document.originalFileName);
  }
}
function DocumentDetailComponent_div_3_div_7_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 35)(1, "p");
    i05.\u0275\u0275text(2, "Preview is not available for this file type.");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "div", 36)(4, "a", 37);
    i05.\u0275\u0275text(5, "Open file");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(6, "a", 26);
    i05.\u0275\u0275text(7, "Download file");
    i05.\u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance(4);
    i05.\u0275\u0275property("href", ctx_r0.previewUrl, i05.\u0275\u0275sanitizeUrl);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275property("href", ctx_r0.previewUrl, i05.\u0275\u0275sanitizeUrl);
  }
}
function DocumentDetailComponent_div_3_div_17_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 38)(1, "strong");
    i05.\u0275\u0275text(2, "Processing");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "p");
    i05.\u0275\u0275text(4);
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance(4);
    i05.\u0275\u0275textInterpolate(ctx_r0.processingProgressMessage);
  }
}
function DocumentDetailComponent_div_3_div_18_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 39);
    i05.\u0275\u0275text(1, " This document requires manual review before final approval. ");
    i05.\u0275\u0275elementEnd();
  }
}
function DocumentDetailComponent_div_3_div_19_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 40)(1, "strong");
    i05.\u0275\u0275text(2, "Processing failed:");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275text(3);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275textInterpolate1(" ", ctx_r0.failureReason, " ");
  }
}
function DocumentDetailComponent_div_3_span_23_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "span", 41);
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const badge_r5 = ctx.$implicit;
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(badge_r5);
  }
}
function DocumentDetailComponent_div_3_button_121_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "button", 42);
    i05.\u0275\u0275listener("click", function DocumentDetailComponent_div_3_button_121_Template_button_click_0_listener() {
      i05.\u0275\u0275restoreView(_r6);
      const ctx_r0 = i05.\u0275\u0275nextContext(2);
      return i05.\u0275\u0275resetView(ctx_r0.processDocument());
    });
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275property("disabled", ctx_r0.actionLoading);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate1(" ", ctx_r0.actionLoading ? "Processing..." : "Process", " ");
  }
}
function DocumentDetailComponent_div_3_button_122_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "button", 42);
    i05.\u0275\u0275listener("click", function DocumentDetailComponent_div_3_button_122_Template_button_click_0_listener() {
      i05.\u0275\u0275restoreView(_r7);
      const ctx_r0 = i05.\u0275\u0275nextContext(2);
      return i05.\u0275\u0275resetView(ctx_r0.processDocument());
    });
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275property("disabled", ctx_r0.actionLoading);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate1(" ", ctx_r0.actionLoading ? "Reprocessing..." : "Reprocess", " ");
  }
}
function DocumentDetailComponent_div_3_div_131_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 43);
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(ctx_r0.actionError);
  }
}
function DocumentDetailComponent_div_3_div_132_p_3_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "p");
    i05.\u0275\u0275text(1, "Loading raw OCR text...");
    i05.\u0275\u0275elementEnd();
  }
}
function DocumentDetailComponent_div_3_div_132_pre_4_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "pre");
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(3);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(ctx_r0.rawText || "No raw OCR text available.");
  }
}
function DocumentDetailComponent_div_3_div_132_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 44)(1, "h3");
    i05.\u0275\u0275text(2, "Raw OCR text");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275template(3, DocumentDetailComponent_div_3_div_132_p_3_Template, 2, 0, "p", 45)(4, DocumentDetailComponent_div_3_div_132_pre_4_Template, 2, 1, "pre", 45);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275property("ngIf", ctx_r0.rawTextLoading);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", !ctx_r0.rawTextLoading);
  }
}
function DocumentDetailComponent_div_3_div_133_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 46)(1, "h3");
    i05.\u0275\u0275text(2, "Validation summary");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "p");
    i05.\u0275\u0275text(4);
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance(4);
    i05.\u0275\u0275textInterpolate(ctx_r0.result.validationResult.summary);
  }
}
function DocumentDetailComponent_div_3_div_134_div_3_p_8_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "p", 54);
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const warning_r8 = i05.\u0275\u0275nextContext().$implicit;
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate1("Field: ", warning_r8.fieldName);
  }
}
function DocumentDetailComponent_div_3_div_134_div_3_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 49)(1, "div", 50)(2, "span", 51);
    i05.\u0275\u0275text(3);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(4, "span", 52);
    i05.\u0275\u0275text(5);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(6, "p");
    i05.\u0275\u0275text(7);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275template(8, DocumentDetailComponent_div_3_div_134_div_3_p_8_Template, 2, 1, "p", 53);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const warning_r8 = ctx.$implicit;
    const ctx_r0 = i05.\u0275\u0275nextContext(3);
    i05.\u0275\u0275property("ngClass", ctx_r0.getWarningSeverityClass(warning_r8));
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275textInterpolate(warning_r8.code);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(warning_r8.severity);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(ctx_r0.getWarningMessage(warning_r8));
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", warning_r8.fieldName);
  }
}
function DocumentDetailComponent_div_3_div_134_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 47)(1, "h3");
    i05.\u0275\u0275text(2, "Validation warnings");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275template(3, DocumentDetailComponent_div_3_div_134_div_3_Template, 9, 5, "div", 48);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275property("ngForOf", ctx_r0.result?.bilingualWarnings ?? i05.\u0275\u0275pureFunction0(1, _c1));
  }
}
function DocumentDetailComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "div", 7)(1, "div", 8)(2, "aside", 9)(3, "h3");
    i05.\u0275\u0275text(4, "Document preview");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275template(5, DocumentDetailComponent_div_3_div_5_Template, 2, 1, "div", 10)(6, DocumentDetailComponent_div_3_div_6_Template, 2, 2, "div", 10)(7, DocumentDetailComponent_div_3_div_7_Template, 8, 2, "div", 11);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(8, "div", 12)(9, "div", 13)(10, "div")(11, "h1");
    i05.\u0275\u0275text(12);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(13, "p", 14);
    i05.\u0275\u0275text(14);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(15, "a", 6);
    i05.\u0275\u0275text(16, "Back to list");
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275template(17, DocumentDetailComponent_div_3_div_17_Template, 5, 1, "div", 15)(18, DocumentDetailComponent_div_3_div_18_Template, 2, 0, "div", 16)(19, DocumentDetailComponent_div_3_div_19_Template, 4, 1, "div", 17);
    i05.\u0275\u0275elementStart(20, "div", 18)(21, "span", 19);
    i05.\u0275\u0275text(22);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275template(23, DocumentDetailComponent_div_3_span_23_Template, 2, 1, "span", 20);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(24, "div", 21)(25, "div", 22)(26, "label");
    i05.\u0275\u0275text(27, "File name");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(28, "p");
    i05.\u0275\u0275text(29);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(30, "div", 22)(31, "label");
    i05.\u0275\u0275text(32, "Document type");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(33, "p");
    i05.\u0275\u0275text(34);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(35, "div", 22)(36, "label");
    i05.\u0275\u0275text(37, "Requested document language");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(38, "p");
    i05.\u0275\u0275text(39);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(40, "div", 22)(41, "label");
    i05.\u0275\u0275text(42, "Detected document language");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(43, "p");
    i05.\u0275\u0275text(44);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(45, "div", 22)(46, "label");
    i05.\u0275\u0275text(47, "Status");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(48, "p");
    i05.\u0275\u0275text(49);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(50, "div", 22)(51, "label");
    i05.\u0275\u0275text(52, "Uploaded date");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(53, "p");
    i05.\u0275\u0275text(54);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(55, "div", 22)(56, "label");
    i05.\u0275\u0275text(57, "Processed date");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(58, "p");
    i05.\u0275\u0275text(59);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(60, "div", 22)(61, "label");
    i05.\u0275\u0275text(62, "Engine used");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(63, "p");
    i05.\u0275\u0275text(64);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(65, "div", 22)(66, "label");
    i05.\u0275\u0275text(67, "Primary OCR engine used");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(68, "p");
    i05.\u0275\u0275text(69);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(70, "div", 22)(71, "label");
    i05.\u0275\u0275text(72, "Fallback OCR engine used");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(73, "p");
    i05.\u0275\u0275text(74);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(75, "div", 22)(76, "label");
    i05.\u0275\u0275text(77, "Fallback used");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(78, "p");
    i05.\u0275\u0275text(79);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(80, "div", 22)(81, "label");
    i05.\u0275\u0275text(82, "Provider name");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(83, "p");
    i05.\u0275\u0275text(84);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(85, "div", 22)(86, "label");
    i05.\u0275\u0275text(87, "Model name");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(88, "p");
    i05.\u0275\u0275text(89);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(90, "div", 22)(91, "label");
    i05.\u0275\u0275text(92, "Provider latency ms");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(93, "p");
    i05.\u0275\u0275text(94);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(95, "div", 22)(96, "label");
    i05.\u0275\u0275text(97, "Primary latency ms");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(98, "p");
    i05.\u0275\u0275text(99);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(100, "div", 22)(101, "label");
    i05.\u0275\u0275text(102, "Fallback latency ms");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(103, "p");
    i05.\u0275\u0275text(104);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(105, "div", 22)(106, "label");
    i05.\u0275\u0275text(107, "Processing time");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(108, "p");
    i05.\u0275\u0275text(109);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(110, "div", 22)(111, "label");
    i05.\u0275\u0275text(112, "Estimated provider cost");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(113, "p");
    i05.\u0275\u0275text(114);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275elementStart(115, "div", 22)(116, "label");
    i05.\u0275\u0275text(117, "Overall confidence");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(118, "p");
    i05.\u0275\u0275text(119);
    i05.\u0275\u0275elementEnd()()();
    i05.\u0275\u0275elementStart(120, "div", 23);
    i05.\u0275\u0275template(121, DocumentDetailComponent_div_3_button_121_Template, 2, 2, "button", 24)(122, DocumentDetailComponent_div_3_button_122_Template, 2, 2, "button", 24);
    i05.\u0275\u0275elementStart(123, "a", 25);
    i05.\u0275\u0275text(124, "Review/Edit extracted fields");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(125, "a", 26);
    i05.\u0275\u0275text(126, "Download JSON");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(127, "a", 26);
    i05.\u0275\u0275text(128, "Download CSV");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(129, "button", 27);
    i05.\u0275\u0275listener("click", function DocumentDetailComponent_div_3_Template_button_click_129_listener() {
      i05.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i05.\u0275\u0275nextContext();
      return i05.\u0275\u0275resetView(ctx_r0.toggleRawText());
    });
    i05.\u0275\u0275text(130);
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275template(131, DocumentDetailComponent_div_3_div_131_Template, 2, 1, "div", 28)(132, DocumentDetailComponent_div_3_div_132_Template, 5, 2, "div", 29)(133, DocumentDetailComponent_div_3_div_133_Template, 5, 1, "div", 30)(134, DocumentDetailComponent_div_3_div_134_Template, 4, 2, "div", 31);
    i05.\u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275property("ngIf", ctx_r0.isPdfPreview);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.isImagePreview);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.previewFailed || !ctx_r0.isPdfPreview && !ctx_r0.isImagePreview);
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.document.originalFileName);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate1("Document ID: ", ctx_r0.document.id);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275property("ngIf", ctx_r0.polling);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.isNeedsReview);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.isFailed);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275property("ngClass", ctx_r0.getStatusBadgeClass(ctx_r0.document.status));
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(ctx_r0.document.status);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngForOf", ctx_r0.engineBadges);
    i05.\u0275\u0275advance(6);
    i05.\u0275\u0275textInterpolate(ctx_r0.document.originalFileName);
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.document.documentType);
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.getRequestedLanguageLabel(ctx_r0.document.documentLanguage));
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.getDetectedLanguageLabel());
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.document.status);
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.formatDate(ctx_r0.document.uploadedAtUtc));
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.formatDate(ctx_r0.document.processedAtUtc));
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.getEngineUsedLabel());
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.primaryOcrEngineUsed || "-");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.fallbackOcrEngineUsed || "-");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.fallbackUsed ? "Yes" : "No");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.providerName || "-");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.modelName || "-");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.providerLatencyMs ?? "-");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.primaryLatencyMs ?? "-");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.result?.fallbackLatencyMs ?? "-");
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.formatProcessingTime(ctx_r0.result?.totalProcessingLatencyMs));
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.formatEstimatedCost(ctx_r0.result?.estimatedProviderCost));
    i05.\u0275\u0275advance(5);
    i05.\u0275\u0275textInterpolate(ctx_r0.formatConfidence(ctx_r0.result?.confidence));
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275property("ngIf", ctx_r0.isUploaded);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.isFailed);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("routerLink", i05.\u0275\u0275pureFunction1(41, _c02, ctx_r0.document.id));
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275property("href", ctx_r0.jsonExportUrl, i05.\u0275\u0275sanitizeUrl);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275property("href", ctx_r0.csvExportUrl, i05.\u0275\u0275sanitizeUrl);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275property("disabled", ctx_r0.rawTextLoading);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate1(" ", ctx_r0.rawTextVisible ? "Hide raw OCR text" : "View raw OCR text", " ");
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.actionError);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.rawTextVisible);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", ctx_r0.result?.validationResult);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngIf", (ctx_r0.result?.bilingualWarnings?.length ?? 0) > 0);
  }
}
var DocumentDetailComponent = class _DocumentDetailComponent {
  documentService;
  route;
  sanitizer;
  document = null;
  result = null;
  loading = true;
  actionLoading = false;
  rawTextVisible = false;
  rawTextLoading = false;
  rawText = "";
  loadError = "";
  actionError = "";
  uiLanguage = "en";
  jsonExportUrl = "";
  csvExportUrl = "";
  engineBadges = [];
  previewUrl = "";
  safePreviewUrl = null;
  isPdfPreview = false;
  isImagePreview = false;
  previewFailed = false;
  polling = false;
  processingProgressMessage = "";
  routeSubscription = null;
  statusPollingSubscription = null;
  constructor(documentService, route, sanitizer) {
    this.documentService = documentService;
    this.route = route;
    this.sanitizer = sanitizer;
  }
  get isUploaded() {
    return this.document?.status === "Uploaded";
  }
  get isFailed() {
    return this.document?.status === "Failed";
  }
  get isNeedsReview() {
    return this.document?.status === "NeedsReview";
  }
  get failureReason() {
    return this.result?.latestExtractionJob?.errorMessage || "No failure details were provided by the backend.";
  }
  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.stopStatusPolling();
        this.loadDocument(id);
      }
    });
  }
  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    this.stopStatusPolling();
  }
  loadDocument(id) {
    this.stopStatusPolling();
    this.loading = true;
    this.loadError = "";
    this.actionError = "";
    this.rawTextVisible = false;
    this.rawText = "";
    this.previewUrl = "";
    this.safePreviewUrl = null;
    this.isPdfPreview = false;
    this.isImagePreview = false;
    this.previewFailed = false;
    this.documentService.getDocument(id).pipe(timeout(15e3)).subscribe({
      next: (document) => {
        try {
          this.document = document;
          this.jsonExportUrl = this.documentService.getJsonExportUrl(document.id);
          this.csvExportUrl = this.documentService.getCsvExportUrl(document.id);
          this.previewUrl = this.documentService.getDocumentFileUrl(document.id);
          this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
          const contentType = (document.contentType || "").toLowerCase();
          this.isPdfPreview = contentType.includes("application/pdf");
          this.isImagePreview = contentType.startsWith("image/");
          this.previewFailed = false;
        } catch (err) {
          this.document = null;
          this.result = null;
          this.loading = false;
          this.loadError = this.getErrorMessage(err);
          return;
        }
        this.documentService.getDocumentResult(id).pipe(timeout(15e3), catchError(() => of(null))).subscribe({
          next: (result) => {
            const normalizedResult = this.normalizeResult(result);
            this.result = normalizedResult;
            this.engineBadges = this.buildEngineBadges(normalizedResult);
            this.loading = false;
          },
          error: () => {
            this.result = null;
            this.engineBadges = [];
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.document = null;
        this.result = null;
        this.loading = false;
        this.loadError = this.getErrorMessage(err);
      }
    });
  }
  processDocument() {
    if (!this.document) {
      return;
    }
    this.actionLoading = true;
    this.actionError = "";
    this.polling = true;
    this.processingProgressMessage = "Submitting process request...";
    const documentId = this.document.id;
    this.document.status = "Processing";
    this.documentService.processDocument(documentId).subscribe({
      next: (response) => {
        this.actionLoading = false;
        this.document = response;
        this.startStatusPolling(documentId);
      },
      error: (err) => {
        this.actionLoading = false;
        this.polling = false;
        this.processingProgressMessage = "";
        this.actionError = this.getErrorMessage(err);
        this.loadDocument(documentId);
      }
    });
  }
  toggleRawText() {
    if (!this.document) {
      return;
    }
    if (this.rawTextVisible) {
      this.rawTextVisible = false;
      return;
    }
    this.rawTextVisible = true;
    if (this.rawText.length > 0) {
      return;
    }
    this.rawTextLoading = true;
    this.documentService.getRawText(this.document.id).subscribe({
      next: (response) => {
        this.rawText = response.rawText;
        this.rawTextLoading = false;
      },
      error: (err) => {
        this.rawTextLoading = false;
        this.rawText = this.getErrorMessage(err);
      }
    });
  }
  onPreviewError() {
    this.previewFailed = true;
  }
  getRequestedLanguageLabel(value) {
    const map = {
      Unknown: "Auto-detect",
      EnglishCanada: "English Canada",
      FrenchCanada: "Fran\xE7ais Canada",
      BilingualCanada: "Bilingual Canada"
    };
    return map[value] ?? value;
  }
  getDetectedLanguageLabel() {
    if (!this.result || !this.result.detectedDocumentLanguage) {
      return "-";
    }
    return this.getRequestedLanguageLabel(this.result.detectedDocumentLanguage);
  }
  formatDate(value) {
    if (!value) {
      return "-";
    }
    return new Date(value).toLocaleString();
  }
  formatConfidence(value) {
    if (typeof value !== "number") {
      return "-";
    }
    return `${(value * 100).toFixed(1)}%`;
  }
  formatProcessingTime(value) {
    if (typeof value !== "number") {
      return "-";
    }
    return `${value} ms`;
  }
  formatEstimatedCost(value) {
    if (typeof value !== "number") {
      return "-";
    }
    return `$${value.toFixed(4)}`;
  }
  getEngineUsedLabel() {
    if (!this.result) {
      return "-";
    }
    if (this.result.fallbackUsed && this.result.fallbackOcrEngineUsed) {
      return this.result.fallbackOcrEngineUsed;
    }
    return this.result.primaryOcrEngineUsed || "-";
  }
  getWarningMessage(warning) {
    if (this.uiLanguage === "fr" && warning.messageFr) {
      return warning.messageFr;
    }
    return warning.messageEn;
  }
  getWarningSeverityClass(warning) {
    const value = warning.severity.toLowerCase();
    if (value.includes("critical") || value.includes("error") || value.includes("high")) {
      return "warning-critical";
    }
    if (value.includes("warn") || value.includes("medium")) {
      return "warning-warning";
    }
    return "warning-info";
  }
  getStatusBadgeClass(status) {
    const map = {
      Uploaded: "badge-uploaded",
      Processing: "badge-processing",
      Completed: "badge-completed",
      Failed: "badge-failed",
      NeedsReview: "badge-needs-review"
    };
    return map[status] ?? "badge-unknown";
  }
  startStatusPolling(documentId) {
    this.stopStatusPolling();
    this.polling = true;
    this.processingProgressMessage = "Checking processing status every 2 seconds...";
    this.statusPollingSubscription = timer(0, 2e3).pipe(switchMap(() => this.documentService.getDocument(documentId))).subscribe({
      next: (document) => {
        this.document = document;
        if (document.status === "Completed" || document.status === "NeedsReview" || document.status === "Failed") {
          this.stopStatusPolling();
          this.processingProgressMessage = "";
          this.documentService.getDocumentResult(documentId).pipe(catchError(() => of(null))).subscribe({
            next: (result) => {
              const normalizedResult = this.normalizeResult(result);
              this.result = normalizedResult;
              this.engineBadges = this.buildEngineBadges(normalizedResult);
              if (document.status === "Failed") {
                this.actionError = this.failureReason;
              }
            },
            error: () => {
              if (document.status === "Failed") {
                this.actionError = this.failureReason;
              }
            }
          });
        }
      },
      error: (err) => {
        this.stopStatusPolling();
        this.processingProgressMessage = "";
        this.actionError = this.getErrorMessage(err);
      }
    });
  }
  stopStatusPolling() {
    this.statusPollingSubscription?.unsubscribe();
    this.statusPollingSubscription = null;
    this.polling = false;
  }
  normalizeResult(result) {
    if (!result) {
      return null;
    }
    return __spreadProps(__spreadValues({}, result), {
      bilingualWarnings: Array.isArray(result.bilingualWarnings) ? result.bilingualWarnings : [],
      lineItems: Array.isArray(result.lineItems) ? result.lineItems : []
    });
  }
  buildEngineBadges(result) {
    if (!result) {
      return [];
    }
    const badges = /* @__PURE__ */ new Set();
    const primary = (result.primaryOcrEngineUsed || "").toLowerCase();
    const fallback = (result.fallbackOcrEngineUsed || "").toLowerCase();
    const model = (result.modelName || "").toLowerCase();
    if (primary.includes("pdf") || primary.includes("native")) {
      badges.add("Native PDF Text");
    }
    if (primary.includes("tesseract") || fallback.includes("tesseract")) {
      badges.add("Tesseract");
    }
    if (primary.includes("gemini") || fallback.includes("gemini") || model.includes("gemini")) {
      badges.add("Gemini Flash Lite");
    }
    if (result.fallbackUsed) {
      badges.add("Vision Fallback");
    }
    return Array.from(badges);
  }
  getErrorMessage(err) {
    if (typeof err === "string" && err.trim().length > 0) {
      return err;
    }
    if (err && typeof err === "object") {
      const e = err;
      if (typeof e.error === "string" && e.error.trim().length > 0) {
        return e.error;
      }
      if (e.error && typeof e.error === "object") {
        const message = e.error.message;
        if (typeof message === "string" && message.trim().length > 0) {
          return message;
        }
      }
      if (typeof e.message === "string" && e.message.trim().length > 0) {
        return e.message;
      }
    }
    return "Operation failed. Please try again.";
  }
  static \u0275fac = function DocumentDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentDetailComponent)(i05.\u0275\u0275directiveInject(DocumentService), i05.\u0275\u0275directiveInject(i23.ActivatedRoute), i05.\u0275\u0275directiveInject(i33.DomSanitizer));
  };
  static \u0275cmp = /* @__PURE__ */ i05.\u0275\u0275defineComponent({ type: _DocumentDetailComponent, selectors: [["app-document-detail"]], decls: 4, vars: 3, consts: [[1, "container"], ["class", "loading", 4, "ngIf"], ["class", "not-found", 4, "ngIf"], ["class", "detail-section", 4, "ngIf"], [1, "loading"], [1, "not-found"], ["routerLink", "/documents", 1, "btn", "btn-secondary"], [1, "detail-section"], [1, "detail-layout"], [1, "preview-panel"], ["class", "preview-frame", 4, "ngIf"], ["class", "preview-fallback", 4, "ngIf"], [1, "main-content"], [1, "header"], [1, "subtitle"], ["class", "status-callout status-processing", 4, "ngIf"], ["class", "status-callout status-needs-review", 4, "ngIf"], ["class", "status-callout status-failed", 4, "ngIf"], [1, "badge-row"], [1, "badge", 3, "ngClass"], ["class", "badge badge-engine", 4, "ngFor", "ngForOf"], [1, "info-grid"], [1, "info-item"], [1, "actions"], ["type", "button", "class", "btn btn-primary", 3, "disabled", "click", 4, "ngIf"], [1, "btn", "btn-outline", 3, "routerLink"], ["download", "", 1, "btn", "btn-outline", 3, "href"], ["type", "button", 1, "btn", "btn-outline", 3, "click", "disabled"], ["class", "alert alert-danger", 4, "ngIf"], ["class", "raw-text", 4, "ngIf"], ["class", "validation-summary", 4, "ngIf"], ["class", "warnings", 4, "ngIf"], [1, "preview-frame"], ["title", "Document preview", 3, "error", "src"], [3, "error", "src", "alt"], [1, "preview-fallback"], [1, "preview-actions"], ["target", "_blank", "rel", "noopener", 1, "btn", "btn-outline", 3, "href"], [1, "status-callout", "status-processing"], [1, "status-callout", "status-needs-review"], [1, "status-callout", "status-failed"], [1, "badge", "badge-engine"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], [1, "alert", "alert-danger"], [1, "raw-text"], [4, "ngIf"], [1, "validation-summary"], [1, "warnings"], ["class", "warning-item", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "warning-item", 3, "ngClass"], [1, "warning-meta"], [1, "warning-code"], [1, "warning-severity"], ["class", "warning-field", 4, "ngIf"], [1, "warning-field"]], template: function DocumentDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      i05.\u0275\u0275elementStart(0, "div", 0);
      i05.\u0275\u0275template(1, DocumentDetailComponent_div_1_Template, 2, 0, "div", 1)(2, DocumentDetailComponent_div_2_Template, 5, 1, "div", 2)(3, DocumentDetailComponent_div_3_Template, 135, 43, "div", 3);
      i05.\u0275\u0275elementEnd();
    }
    if (rf & 2) {
      i05.\u0275\u0275advance();
      i05.\u0275\u0275property("ngIf", ctx.loading);
      i05.\u0275\u0275advance();
      i05.\u0275\u0275property("ngIf", !ctx.loading && ctx.loadError);
      i05.\u0275\u0275advance();
      i05.\u0275\u0275property("ngIf", !ctx.loading && ctx.document);
    }
  }, dependencies: [CommonModule3, i42.NgClass, i42.NgComponentOutlet, i42.NgForOf, i42.NgIf, i42.NgTemplateOutlet, i42.NgStyle, i42.NgSwitch, i42.NgSwitchCase, i42.NgSwitchDefault, i42.NgPlural, i42.NgPluralCase, RouterModule3, i23.RouterOutlet, i23.RouterLink, i23.RouterLinkActive, i23.\u0275EmptyOutletComponent, i42.AsyncPipe, i42.UpperCasePipe, i42.LowerCasePipe, i42.JsonPipe, i42.SlicePipe, i42.DecimalPipe, i42.PercentPipe, i42.TitleCasePipe, i42.CurrencyPipe, i42.DatePipe, i42.I18nPluralPipe, i42.I18nSelectPipe, i42.KeyValuePipe], styles: ['\n.container[_ngcontent-%COMP%] {\n  max-width: 1080px;\n  margin: 0 auto;\n  padding: 24px;\n}\n.loading[_ngcontent-%COMP%], \n.not-found[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #667085;\n  background: #fff;\n  border-radius: 10px;\n  border: 1px solid #eaecf0;\n}\n.detail-section[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 10px;\n  padding: 28px;\n  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);\n  border: 1px solid #eaecf0;\n}\n.detail-layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(280px, 34%) minmax(0, 1fr);\n  gap: 18px;\n  align-items: start;\n}\n.preview-panel[_ngcontent-%COMP%] {\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n  padding: 12px;\n  position: sticky;\n  top: 16px;\n}\n.preview-frame[_ngcontent-%COMP%] {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  overflow: hidden;\n  background: #f8fafc;\n  min-height: 420px;\n}\n.preview-frame[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%], \n.preview-frame[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  min-height: 420px;\n  border: 0;\n  display: block;\n  object-fit: contain;\n}\n.preview-fallback[_ngcontent-%COMP%] {\n  border: 1px dashed #d0d5dd;\n  border-radius: 8px;\n  padding: 12px;\n  background: #f9fafb;\n}\n.preview-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: start;\n  gap: 12px;\n  margin-bottom: 16px;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 28px;\n  line-height: 1.2;\n}\n.subtitle[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  color: #667085;\n  font-size: 13px;\n}\n.status-callout[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 14px;\n  margin-bottom: 14px;\n  font-weight: 500;\n}\n.status-processing[_ngcontent-%COMP%] {\n  background: #eff8ff;\n  border: 1px solid #b2ddff;\n  color: #175cd3;\n}\n.status-processing[_ngcontent-%COMP%]::before {\n  content: "";\n  display: inline-block;\n  width: 14px;\n  height: 14px;\n  margin-right: 8px;\n  border: 2px solid #d1e9ff;\n  border-top: 2px solid #175cd3;\n  border-radius: 50%;\n  vertical-align: middle;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n.status-processing[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.status-needs-review[_ngcontent-%COMP%] {\n  background: #fff7ed;\n  border: 1px solid #fed7aa;\n  color: #9a3412;\n}\n.status-failed[_ngcontent-%COMP%] {\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #991b1b;\n}\n.badge-row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin: 8px 0 18px;\n}\n.badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 700;\n}\n.badge-uploaded[_ngcontent-%COMP%] {\n  background: #eff8ff;\n  color: #175cd3;\n}\n.badge-processing[_ngcontent-%COMP%] {\n  background: #ecfdf3;\n  color: #027a48;\n}\n.badge-completed[_ngcontent-%COMP%] {\n  background: #ecfdf3;\n  color: #027a48;\n}\n.badge-failed[_ngcontent-%COMP%] {\n  background: #fef3f2;\n  color: #b42318;\n}\n.badge-needs-review[_ngcontent-%COMP%] {\n  background: #fff7ed;\n  color: #b54708;\n}\n.badge-unknown[_ngcontent-%COMP%] {\n  background: #f2f4f7;\n  color: #475467;\n}\n.badge-engine[_ngcontent-%COMP%] {\n  background: #f5f3ff;\n  color: #6941c6;\n}\n.info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.info-item[_ngcontent-%COMP%] {\n  padding: 14px;\n  background-color: #f8fafc;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n}\n.info-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 700;\n  margin-bottom: 6px;\n  color: #475467;\n  font-size: 13px;\n}\n.info-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #111827;\n  font-size: 14px;\n  word-break: break-word;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  border-radius: 8px;\n  text-decoration: none;\n  font-weight: 600;\n  border: 1px solid transparent;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background-color: #475467;\n  color: white;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background-color: #344054;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background-color: #175cd3;\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background-color: #1849a9;\n}\n.btn-outline[_ngcontent-%COMP%] {\n  border-color: #d0d5dd;\n  background: #fff;\n  color: #344054;\n}\n.btn-outline[_ngcontent-%COMP%]:hover {\n  background: #f9fafb;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 12px;\n}\n.alert-danger[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n  color: #991b1b;\n  border: 1px solid #fecaca;\n}\n.raw-text[_ngcontent-%COMP%], \n.validation-summary[_ngcontent-%COMP%], \n.warnings[_ngcontent-%COMP%] {\n  margin-top: 16px;\n  padding: 16px;\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n}\n.raw-text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.validation-summary[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.warnings[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n}\npre[_ngcontent-%COMP%] {\n  margin: 0;\n  white-space: pre-wrap;\n  word-break: break-word;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n  font-size: 13px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 6px;\n  padding: 12px;\n  max-height: 320px;\n  overflow: auto;\n}\n.warning-item[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px;\n  border: 1px solid #e5e7eb;\n  margin-bottom: 10px;\n}\n.warning-meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-bottom: 6px;\n}\n.warning-code[_ngcontent-%COMP%], \n.warning-severity[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  padding: 3px 8px;\n  font-size: 11px;\n  font-weight: 700;\n  background: #f3f4f6;\n  color: #111827;\n}\n.warning-critical[_ngcontent-%COMP%] {\n  border-color: #fecaca;\n  background: #fef2f2;\n}\n.warning-warning[_ngcontent-%COMP%] {\n  border-color: #fed7aa;\n  background: #fffbeb;\n}\n.warning-info[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n@media (max-width: 900px) {\n  .detail-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n/*# sourceMappingURL=document-detail.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassMetadata(DocumentDetailComponent, [{
    type: Component3,
    args: [{ selector: "app-document-detail", standalone: true, imports: [CommonModule3, RouterModule3], template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Loading document details...</div>

      <div *ngIf="!loading && loadError" class="not-found">
        <p>{{ loadError }}</p>
        <a routerLink="/documents" class="btn btn-secondary">Back to list</a>
      </div>

      <div *ngIf="!loading && document" class="detail-section">
        <div class="detail-layout">
          <aside class="preview-panel">
            <h3>Document preview</h3>
            <div class="preview-frame" *ngIf="isPdfPreview">
              <iframe [src]="safePreviewUrl" title="Document preview" (error)="onPreviewError()"></iframe>
            </div>
            <div class="preview-frame" *ngIf="isImagePreview">
              <img [src]="previewUrl" [alt]="document.originalFileName" (error)="onPreviewError()" />
            </div>
            <div class="preview-fallback" *ngIf="previewFailed || (!isPdfPreview && !isImagePreview)">
              <p>Preview is not available for this file type.</p>
              <div class="preview-actions">
                <a [href]="previewUrl" class="btn btn-outline" target="_blank" rel="noopener">Open file</a>
                <a [href]="previewUrl" class="btn btn-outline" download>Download file</a>
              </div>
            </div>
          </aside>

          <div class="main-content">
            <div class="header">
          <div>
            <h1>{{ document.originalFileName }}</h1>
            <p class="subtitle">Document ID: {{ document.id }}</p>
          </div>
          <a routerLink="/documents" class="btn btn-secondary">Back to list</a>
        </div>

        <div *ngIf="polling" class="status-callout status-processing">
          <strong>Processing</strong>
          <p>{{ processingProgressMessage }}</p>
        </div>

        <div *ngIf="isNeedsReview" class="status-callout status-needs-review">
          This document requires manual review before final approval.
        </div>

        <div *ngIf="isFailed" class="status-callout status-failed">
          <strong>Processing failed:</strong> {{ failureReason }}
        </div>

        <div class="badge-row">
          <span class="badge" [ngClass]="getStatusBadgeClass(document.status)">{{ document.status }}</span>
          <span class="badge badge-engine" *ngFor="let badge of engineBadges">{{ badge }}</span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label>File name</label>
            <p>{{ document.originalFileName }}</p>
          </div>
          <div class="info-item">
            <label>Document type</label>
            <p>{{ document.documentType }}</p>
          </div>
          <div class="info-item">
            <label>Requested document language</label>
            <p>{{ getRequestedLanguageLabel(document.documentLanguage) }}</p>
          </div>
          <div class="info-item">
            <label>Detected document language</label>
            <p>{{ getDetectedLanguageLabel() }}</p>
          </div>
          <div class="info-item">
            <label>Status</label>
            <p>{{ document.status }}</p>
          </div>
          <div class="info-item">
            <label>Uploaded date</label>
            <p>{{ formatDate(document.uploadedAtUtc) }}</p>
          </div>
          <div class="info-item">
            <label>Processed date</label>
            <p>{{ formatDate(document.processedAtUtc) }}</p>
          </div>
          <div class="info-item">
            <label>Engine used</label>
            <p>{{ getEngineUsedLabel() }}</p>
          </div>
          <div class="info-item">
            <label>Primary OCR engine used</label>
            <p>{{ result?.primaryOcrEngineUsed || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Fallback OCR engine used</label>
            <p>{{ result?.fallbackOcrEngineUsed || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Fallback used</label>
            <p>{{ result?.fallbackUsed ? 'Yes' : 'No' }}</p>
          </div>
          <div class="info-item">
            <label>Provider name</label>
            <p>{{ result?.providerName || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Model name</label>
            <p>{{ result?.modelName || '-' }}</p>
          </div>
          <div class="info-item">
            <label>Provider latency ms</label>
            <p>{{ result?.providerLatencyMs ?? '-' }}</p>
          </div>
          <div class="info-item">
            <label>Primary latency ms</label>
            <p>{{ result?.primaryLatencyMs ?? '-' }}</p>
          </div>
          <div class="info-item">
            <label>Fallback latency ms</label>
            <p>{{ result?.fallbackLatencyMs ?? '-' }}</p>
          </div>
          <div class="info-item">
            <label>Processing time</label>
            <p>{{ formatProcessingTime(result?.totalProcessingLatencyMs) }}</p>
          </div>
          <div class="info-item">
            <label>Estimated provider cost</label>
            <p>{{ formatEstimatedCost(result?.estimatedProviderCost) }}</p>
          </div>
          <div class="info-item">
            <label>Overall confidence</label>
            <p>{{ formatConfidence(result?.confidence) }}</p>
          </div>
        </div>

        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            *ngIf="isUploaded"
            [disabled]="actionLoading"
            (click)="processDocument()"
          >
            {{ actionLoading ? 'Processing...' : 'Process' }}
          </button>

          <button
            type="button"
            class="btn btn-primary"
            *ngIf="isFailed"
            [disabled]="actionLoading"
            (click)="processDocument()"
          >
            {{ actionLoading ? 'Reprocessing...' : 'Reprocess' }}
          </button>

          <a [routerLink]="['/documents', document.id, 'review']" class="btn btn-outline">Review/Edit extracted fields</a>
          <a [href]="jsonExportUrl" class="btn btn-outline" download>Download JSON</a>
          <a [href]="csvExportUrl" class="btn btn-outline" download>Download CSV</a>
          <button type="button" class="btn btn-outline" [disabled]="rawTextLoading" (click)="toggleRawText()">
            {{ rawTextVisible ? 'Hide raw OCR text' : 'View raw OCR text' }}
          </button>
        </div>

        <div *ngIf="actionError" class="alert alert-danger">{{ actionError }}</div>

        <div *ngIf="rawTextVisible" class="raw-text">
          <h3>Raw OCR text</h3>
          <p *ngIf="rawTextLoading">Loading raw OCR text...</p>
          <pre *ngIf="!rawTextLoading">{{ rawText || 'No raw OCR text available.' }}</pre>
        </div>

        <div *ngIf="result?.validationResult" class="validation-summary">
          <h3>Validation summary</h3>
          <p>{{ result.validationResult.summary }}</p>
        </div>

        <div *ngIf="(result?.bilingualWarnings?.length ?? 0) > 0" class="warnings">
          <h3>Validation warnings</h3>
          <div class="warning-item" *ngFor="let warning of (result?.bilingualWarnings ?? [])" [ngClass]="getWarningSeverityClass(warning)">
            <div class="warning-meta">
              <span class="warning-code">{{ warning.code }}</span>
              <span class="warning-severity">{{ warning.severity }}</span>
            </div>
            <p>{{ getWarningMessage(warning) }}</p>
            <p *ngIf="warning.fieldName" class="warning-field">Field: {{ warning.fieldName }}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  `, styles: ['/* angular:styles/component:css;dffa05f61173dfb411419969effb02901ff130c2f09aec99f03ccf905319079b;E:/Zaya/frontend/src/app/pages/document-detail/document-detail.component.ts */\n.container {\n  max-width: 1080px;\n  margin: 0 auto;\n  padding: 24px;\n}\n.loading,\n.not-found {\n  text-align: center;\n  padding: 40px;\n  color: #667085;\n  background: #fff;\n  border-radius: 10px;\n  border: 1px solid #eaecf0;\n}\n.detail-section {\n  background: white;\n  border-radius: 10px;\n  padding: 28px;\n  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);\n  border: 1px solid #eaecf0;\n}\n.detail-layout {\n  display: grid;\n  grid-template-columns: minmax(280px, 34%) minmax(0, 1fr);\n  gap: 18px;\n  align-items: start;\n}\n.preview-panel {\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n  padding: 12px;\n  position: sticky;\n  top: 16px;\n}\n.preview-frame {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  overflow: hidden;\n  background: #f8fafc;\n  min-height: 420px;\n}\n.preview-frame iframe,\n.preview-frame img {\n  width: 100%;\n  height: 100%;\n  min-height: 420px;\n  border: 0;\n  display: block;\n  object-fit: contain;\n}\n.preview-fallback {\n  border: 1px dashed #d0d5dd;\n  border-radius: 8px;\n  padding: 12px;\n  background: #f9fafb;\n}\n.preview-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: start;\n  gap: 12px;\n  margin-bottom: 16px;\n}\nh1 {\n  margin: 0;\n  font-size: 28px;\n  line-height: 1.2;\n}\n.subtitle {\n  margin: 6px 0 0;\n  color: #667085;\n  font-size: 13px;\n}\n.status-callout {\n  border-radius: 8px;\n  padding: 12px 14px;\n  margin-bottom: 14px;\n  font-weight: 500;\n}\n.status-processing {\n  background: #eff8ff;\n  border: 1px solid #b2ddff;\n  color: #175cd3;\n}\n.status-processing::before {\n  content: "";\n  display: inline-block;\n  width: 14px;\n  height: 14px;\n  margin-right: 8px;\n  border: 2px solid #d1e9ff;\n  border-top: 2px solid #175cd3;\n  border-radius: 50%;\n  vertical-align: middle;\n  animation: spin 1s linear infinite;\n}\n.status-processing p {\n  margin: 2px 0 0;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.status-needs-review {\n  background: #fff7ed;\n  border: 1px solid #fed7aa;\n  color: #9a3412;\n}\n.status-failed {\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #991b1b;\n}\n.badge-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin: 8px 0 18px;\n}\n.badge {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 700;\n}\n.badge-uploaded {\n  background: #eff8ff;\n  color: #175cd3;\n}\n.badge-processing {\n  background: #ecfdf3;\n  color: #027a48;\n}\n.badge-completed {\n  background: #ecfdf3;\n  color: #027a48;\n}\n.badge-failed {\n  background: #fef3f2;\n  color: #b42318;\n}\n.badge-needs-review {\n  background: #fff7ed;\n  color: #b54708;\n}\n.badge-unknown {\n  background: #f2f4f7;\n  color: #475467;\n}\n.badge-engine {\n  background: #f5f3ff;\n  color: #6941c6;\n}\n.info-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.info-item {\n  padding: 14px;\n  background-color: #f8fafc;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n}\n.info-item label {\n  display: block;\n  font-weight: 700;\n  margin-bottom: 6px;\n  color: #475467;\n  font-size: 13px;\n}\n.info-item p {\n  margin: 0;\n  color: #111827;\n  font-size: 14px;\n  word-break: break-word;\n}\n.actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.btn {\n  padding: 10px 14px;\n  border-radius: 8px;\n  text-decoration: none;\n  font-weight: 600;\n  border: 1px solid transparent;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n}\n.btn:disabled {\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n.btn-secondary {\n  background-color: #475467;\n  color: white;\n}\n.btn-secondary:hover {\n  background-color: #344054;\n}\n.btn-primary {\n  background-color: #175cd3;\n  color: white;\n}\n.btn-primary:hover:not(:disabled) {\n  background-color: #1849a9;\n}\n.btn-outline {\n  border-color: #d0d5dd;\n  background: #fff;\n  color: #344054;\n}\n.btn-outline:hover {\n  background: #f9fafb;\n}\n.alert {\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 12px;\n}\n.alert-danger {\n  background-color: #fef2f2;\n  color: #991b1b;\n  border: 1px solid #fecaca;\n}\n.raw-text,\n.validation-summary,\n.warnings {\n  margin-top: 16px;\n  padding: 16px;\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n}\n.raw-text h3,\n.validation-summary h3,\n.warnings h3 {\n  margin: 0 0 10px;\n}\npre {\n  margin: 0;\n  white-space: pre-wrap;\n  word-break: break-word;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n  font-size: 13px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 6px;\n  padding: 12px;\n  max-height: 320px;\n  overflow: auto;\n}\n.warning-item {\n  border-radius: 8px;\n  padding: 12px;\n  border: 1px solid #e5e7eb;\n  margin-bottom: 10px;\n}\n.warning-meta {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-bottom: 6px;\n}\n.warning-code,\n.warning-severity {\n  border-radius: 999px;\n  padding: 3px 8px;\n  font-size: 11px;\n  font-weight: 700;\n  background: #f3f4f6;\n  color: #111827;\n}\n.warning-critical {\n  border-color: #fecaca;\n  background: #fef2f2;\n}\n.warning-warning {\n  border-color: #fed7aa;\n  background: #fffbeb;\n}\n.warning-info {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n@media (max-width: 900px) {\n  .detail-layout {\n    grid-template-columns: 1fr;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n/*# sourceMappingURL=document-detail.component.css.map */\n'] }]
  }], () => [{ type: DocumentService }, { type: i23.ActivatedRoute }, { type: i33.DomSanitizer }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassDebugInfo(DocumentDetailComponent, { className: "DocumentDetailComponent", filePath: "app/pages/document-detail/document-detail.component.ts", lineNumber: 570 });
})();
(() => {
  const id = "app%2Fpages%2Fdocument-detail%2Fdocument-detail.component.ts%40DocumentDetailComponent";
  function DocumentDetailComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i05.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i05.\u0275\u0275replaceMetadata(DocumentDetailComponent, m.default, [i05, i42, i23, document_service_exports, i33], [CommonModule3, RouterModule3, Component3], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && DocumentDetailComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && DocumentDetailComponent_HmrLoad(d.timestamp)));
})();

// src/app/pages/document-review/document-review.component.ts
import { Component as Component4 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import { CommonModule as CommonModule4 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
import { RouterModule as RouterModule4 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import { ReactiveFormsModule, Validators } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_forms.js?v=57d19488";
import { catchError as catchError2, forkJoin, of as of2 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/rxjs.js?v=57d19488";
import * as i06 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import * as i24 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import * as i34 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_forms.js?v=57d19488";
import * as i43 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_platform-browser.js?v=57d19488";
import * as i5 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_common.js?v=57d19488";
var _c03 = (a0) => ["/documents", a0];
function DocumentReviewComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 4);
    i06.\u0275\u0275text(1, "Loading document review...");
    i06.\u0275\u0275elementEnd();
  }
}
function DocumentReviewComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 5)(1, "p");
    i06.\u0275\u0275text(2);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(3, "a", 6);
    i06.\u0275\u0275text(4, "Back to list");
    i06.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext();
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275textInterpolate(ctx_r0.loadError);
  }
}
function DocumentReviewComponent_div_3_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = i06.\u0275\u0275getCurrentView();
    i06.\u0275\u0275elementStart(0, "div", 60)(1, "iframe", 61);
    i06.\u0275\u0275listener("error", function DocumentReviewComponent_div_3_div_5_Template_iframe_error_1_listener() {
      i06.\u0275\u0275restoreView(_r3);
      const ctx_r0 = i06.\u0275\u0275nextContext(2);
      return i06.\u0275\u0275resetView(ctx_r0.onPreviewError());
    });
    i06.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("src", ctx_r0.safePreviewUrl, i06.\u0275\u0275sanitizeResourceUrl);
  }
}
function DocumentReviewComponent_div_3_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = i06.\u0275\u0275getCurrentView();
    i06.\u0275\u0275elementStart(0, "div", 60)(1, "img", 62);
    i06.\u0275\u0275listener("error", function DocumentReviewComponent_div_3_div_6_Template_img_error_1_listener() {
      i06.\u0275\u0275restoreView(_r4);
      const ctx_r0 = i06.\u0275\u0275nextContext(2);
      return i06.\u0275\u0275resetView(ctx_r0.onPreviewError());
    });
    i06.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("src", ctx_r0.previewUrl, i06.\u0275\u0275sanitizeUrl)("alt", ctx_r0.result.document.originalFileName);
  }
}
function DocumentReviewComponent_div_3_div_7_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 63)(1, "p");
    i06.\u0275\u0275text(2, "Preview is not available for this file type.");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(3, "div", 64)(4, "a", 65);
    i06.\u0275\u0275text(5, "Open file");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(6, "a", 18);
    i06.\u0275\u0275text(7, "Download file");
    i06.\u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275property("href", ctx_r0.previewUrl, i06.\u0275\u0275sanitizeUrl);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275property("href", ctx_r0.previewUrl, i06.\u0275\u0275sanitizeUrl);
  }
}
function DocumentReviewComponent_div_3_div_24_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 66)(1, "h3");
    i06.\u0275\u0275text(2, "Current validation status");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(3, "p")(4, "strong");
    i06.\u0275\u0275text(5);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275text(6);
    i06.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance(5);
    i06.\u0275\u0275textInterpolate(ctx_r0.result.validationResult.isValidated ? "Validated" : "Needs review");
    i06.\u0275\u0275advance();
    i06.\u0275\u0275textInterpolate1(" \u2014 ", ctx_r0.result.validationResult.summary, " ");
  }
}
function DocumentReviewComponent_div_3_div_25_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 66)(1, "h3");
    i06.\u0275\u0275text(2, "Current validation status");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(3, "p");
    i06.\u0275\u0275text(4, "No validation result is currently available.");
    i06.\u0275\u0275elementEnd()();
  }
}
function DocumentReviewComponent_div_3_p_31_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "p", 67);
    i06.\u0275\u0275text(1, "VendorName is required.");
    i06.\u0275\u0275elementEnd();
  }
}
function DocumentReviewComponent_div_3_option_56_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "option", 68);
    i06.\u0275\u0275text(1);
    i06.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r5 = ctx.$implicit;
    i06.\u0275\u0275property("value", option_r5.value);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275textInterpolate(option_r5.label);
  }
}
function DocumentReviewComponent_div_3_div_85_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 69);
    i06.\u0275\u0275text(1);
    i06.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275textInterpolate(ctx_r0.saveError);
  }
}
function DocumentReviewComponent_div_3_div_86_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 70);
    i06.\u0275\u0275text(1);
    i06.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275textInterpolate(ctx_r0.saveSuccess);
  }
}
function DocumentReviewComponent_div_3_div_87_div_3_p_8_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "p", 78);
    i06.\u0275\u0275text(1);
    i06.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const warning_r6 = i06.\u0275\u0275nextContext().$implicit;
    i06.\u0275\u0275advance();
    i06.\u0275\u0275textInterpolate1("Field: ", warning_r6.fieldName);
  }
}
function DocumentReviewComponent_div_3_div_87_div_3_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 73)(1, "div", 74)(2, "span", 75);
    i06.\u0275\u0275text(3);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(4, "span", 76);
    i06.\u0275\u0275text(5);
    i06.\u0275\u0275elementEnd()();
    i06.\u0275\u0275elementStart(6, "p");
    i06.\u0275\u0275text(7);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275template(8, DocumentReviewComponent_div_3_div_87_div_3_p_8_Template, 2, 1, "p", 77);
    i06.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const warning_r6 = ctx.$implicit;
    const ctx_r0 = i06.\u0275\u0275nextContext(3);
    i06.\u0275\u0275property("ngClass", ctx_r0.getWarningSeverityClass(warning_r6));
    i06.\u0275\u0275advance(3);
    i06.\u0275\u0275textInterpolate(warning_r6.code);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275textInterpolate(warning_r6.severity);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275textInterpolate(ctx_r0.getWarningMessage(warning_r6));
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", warning_r6.fieldName);
  }
}
function DocumentReviewComponent_div_3_div_87_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 71)(1, "h3");
    i06.\u0275\u0275text(2, "Bilingual warnings and errors");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275template(3, DocumentReviewComponent_div_3_div_87_div_3_Template, 9, 5, "div", 72);
    i06.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance(3);
    i06.\u0275\u0275property("ngForOf", ctx_r0.result.bilingualWarnings);
  }
}
function DocumentReviewComponent_div_3_div_91_Template(rf, ctx) {
  if (rf & 1) {
    i06.\u0275\u0275elementStart(0, "div", 79)(1, "pre");
    i06.\u0275\u0275text(2);
    i06.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext(2);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275textInterpolate(ctx_r0.result.rawText || "No raw OCR text available.");
  }
}
function DocumentReviewComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = i06.\u0275\u0275getCurrentView();
    i06.\u0275\u0275elementStart(0, "div", 7)(1, "div", 8)(2, "aside", 9)(3, "h3");
    i06.\u0275\u0275text(4, "Document preview");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275template(5, DocumentReviewComponent_div_3_div_5_Template, 2, 1, "div", 10)(6, DocumentReviewComponent_div_3_div_6_Template, 2, 2, "div", 10)(7, DocumentReviewComponent_div_3_div_7_Template, 8, 2, "div", 11);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(8, "div", 12)(9, "div", 13)(10, "div")(11, "h1");
    i06.\u0275\u0275text(12);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(13, "p", 14);
    i06.\u0275\u0275text(14);
    i06.\u0275\u0275elementEnd()();
    i06.\u0275\u0275elementStart(15, "a", 15);
    i06.\u0275\u0275text(16, "Back to detail");
    i06.\u0275\u0275elementEnd()();
    i06.\u0275\u0275elementStart(17, "div", 16)(18, "button", 17);
    i06.\u0275\u0275listener("click", function DocumentReviewComponent_div_3_Template_button_click_18_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.saveCorrections());
    });
    i06.\u0275\u0275text(19);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(20, "a", 18);
    i06.\u0275\u0275text(21, "Download JSON");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(22, "a", 18);
    i06.\u0275\u0275text(23, "Download CSV");
    i06.\u0275\u0275elementEnd()();
    i06.\u0275\u0275template(24, DocumentReviewComponent_div_3_div_24_Template, 7, 2, "div", 19)(25, DocumentReviewComponent_div_3_div_25_Template, 5, 0, "div", 19);
    i06.\u0275\u0275elementStart(26, "form", 20);
    i06.\u0275\u0275listener("ngSubmit", function DocumentReviewComponent_div_3_Template_form_ngSubmit_26_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.saveCorrections());
    });
    i06.\u0275\u0275elementStart(27, "div", 21)(28, "label", 22);
    i06.\u0275\u0275text(29, "VendorName");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275element(30, "input", 23);
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275template(31, DocumentReviewComponent_div_3_p_31_Template, 2, 0, "p", 24);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(32, "div", 25)(33, "label", 26);
    i06.\u0275\u0275text(34, "CustomerName");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275element(35, "input", 27);
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(36, "div", 25)(37, "label", 28);
    i06.\u0275\u0275text(38, "DocumentNumber");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275element(39, "input", 29);
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(40, "div", 25)(41, "label", 30);
    i06.\u0275\u0275text(42, "DocumentDate");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275element(43, "input", 31);
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(44, "div", 25)(45, "label", 32);
    i06.\u0275\u0275text(46, "DueDate");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275element(47, "input", 33);
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(48, "div", 25)(49, "label", 34);
    i06.\u0275\u0275text(50, "Currency");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275element(51, "input", 35);
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(52, "div", 25)(53, "label", 36);
    i06.\u0275\u0275text(54, "DetectedLanguage");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(55, "select", 37);
    i06.\u0275\u0275template(56, DocumentReviewComponent_div_3_option_56_Template, 2, 2, "option", 38);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(57, "div", 25)(58, "label", 39);
    i06.\u0275\u0275text(59, "Subtotal");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(60, "input", 40);
    i06.\u0275\u0275listener("blur", function DocumentReviewComponent_div_3_Template_input_blur_60_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.formatMoneyControl("subtotal"));
    });
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(61, "div", 25)(62, "label", 41);
    i06.\u0275\u0275text(63, "GST/TPS");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(64, "input", 42);
    i06.\u0275\u0275listener("blur", function DocumentReviewComponent_div_3_Template_input_blur_64_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.formatMoneyControl("gst"));
    });
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(65, "div", 25)(66, "label", 43);
    i06.\u0275\u0275text(67, "QST/TVQ");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(68, "input", 44);
    i06.\u0275\u0275listener("blur", function DocumentReviewComponent_div_3_Template_input_blur_68_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.formatMoneyControl("qst"));
    });
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(69, "div", 25)(70, "label", 45);
    i06.\u0275\u0275text(71, "HST/TVH");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(72, "input", 46);
    i06.\u0275\u0275listener("blur", function DocumentReviewComponent_div_3_Template_input_blur_72_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.formatMoneyControl("hst"));
    });
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(73, "div", 25)(74, "label", 47);
    i06.\u0275\u0275text(75, "PST/TVP");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(76, "input", 48);
    i06.\u0275\u0275listener("blur", function DocumentReviewComponent_div_3_Template_input_blur_76_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.formatMoneyControl("pst"));
    });
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(77, "div", 25)(78, "label", 49);
    i06.\u0275\u0275text(79, "Tip/Pourboire");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(80, "input", 50);
    i06.\u0275\u0275listener("blur", function DocumentReviewComponent_div_3_Template_input_blur_80_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.formatMoneyControl("tip"));
    });
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(81, "div", 25)(82, "label", 51);
    i06.\u0275\u0275text(83, "Total");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(84, "input", 52);
    i06.\u0275\u0275listener("blur", function DocumentReviewComponent_div_3_Template_input_blur_84_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.formatMoneyControl("total"));
    });
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275controlCreate();
    i06.\u0275\u0275elementEnd()();
    i06.\u0275\u0275template(85, DocumentReviewComponent_div_3_div_85_Template, 2, 1, "div", 53)(86, DocumentReviewComponent_div_3_div_86_Template, 2, 1, "div", 54)(87, DocumentReviewComponent_div_3_div_87_Template, 4, 1, "div", 55);
    i06.\u0275\u0275elementStart(88, "div", 56)(89, "button", 57);
    i06.\u0275\u0275listener("click", function DocumentReviewComponent_div_3_Template_button_click_89_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.rawPanelExpanded = !ctx_r0.rawPanelExpanded);
    });
    i06.\u0275\u0275text(90);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275template(91, DocumentReviewComponent_div_3_div_91_Template, 3, 1, "div", 58);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(92, "div", 59)(93, "button", 17);
    i06.\u0275\u0275listener("click", function DocumentReviewComponent_div_3_Template_button_click_93_listener() {
      i06.\u0275\u0275restoreView(_r2);
      const ctx_r0 = i06.\u0275\u0275nextContext();
      return i06.\u0275\u0275resetView(ctx_r0.saveCorrections());
    });
    i06.\u0275\u0275text(94);
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(95, "a", 15);
    i06.\u0275\u0275text(96, "Back to detail");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(97, "a", 18);
    i06.\u0275\u0275text(98, "Download JSON");
    i06.\u0275\u0275elementEnd();
    i06.\u0275\u0275elementStart(99, "a", 18);
    i06.\u0275\u0275text(100, "Download CSV");
    i06.\u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = i06.\u0275\u0275nextContext();
    i06.\u0275\u0275advance(5);
    i06.\u0275\u0275property("ngIf", ctx_r0.isPdfPreview);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", ctx_r0.isImagePreview);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", ctx_r0.previewFailed || !ctx_r0.isPdfPreview && !ctx_r0.isImagePreview);
    i06.\u0275\u0275advance(5);
    i06.\u0275\u0275textInterpolate1("Review ", ctx_r0.result.document.originalFileName);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275textInterpolate1("Document ID: ", ctx_r0.result.document.id);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("routerLink", i06.\u0275\u0275pureFunction1(25, _c03, ctx_r0.result.document.id));
    i06.\u0275\u0275advance(3);
    i06.\u0275\u0275property("disabled", ctx_r0.saving || ctx_r0.form.invalid);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275textInterpolate1(" ", ctx_r0.saving ? "Saving..." : "Save corrections", " ");
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("href", ctx_r0.jsonExportUrl, i06.\u0275\u0275sanitizeUrl);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275property("href", ctx_r0.csvExportUrl, i06.\u0275\u0275sanitizeUrl);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275property("ngIf", ctx_r0.result.validationResult);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", !ctx_r0.result.validationResult);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("formGroup", ctx_r0.form);
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", ctx_r0.form.controls.vendorName.touched && ctx_r0.form.controls.vendorName.invalid);
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngForOf", ctx_r0.languageOptions);
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance(4);
    i06.\u0275\u0275control();
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", ctx_r0.saveError);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", ctx_r0.saveSuccess);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", ctx_r0.result.bilingualWarnings.length > 0);
    i06.\u0275\u0275advance(3);
    i06.\u0275\u0275textInterpolate1(" ", ctx_r0.rawPanelExpanded ? "Hide raw OCR text" : "Show raw OCR text", " ");
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("ngIf", ctx_r0.rawPanelExpanded);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275property("disabled", ctx_r0.saving || ctx_r0.form.invalid);
    i06.\u0275\u0275advance();
    i06.\u0275\u0275textInterpolate1(" ", ctx_r0.saving ? "Saving..." : "Save corrections", " ");
    i06.\u0275\u0275advance();
    i06.\u0275\u0275property("routerLink", i06.\u0275\u0275pureFunction1(27, _c03, ctx_r0.result.document.id));
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275property("href", ctx_r0.jsonExportUrl, i06.\u0275\u0275sanitizeUrl);
    i06.\u0275\u0275advance(2);
    i06.\u0275\u0275property("href", ctx_r0.csvExportUrl, i06.\u0275\u0275sanitizeUrl);
  }
}
var DocumentReviewComponent = class _DocumentReviewComponent {
  documentService;
  route;
  fb;
  sanitizer;
  uiLanguage = "en";
  languageOptions = [
    { value: "Unknown", label: "Unknown" },
    { value: "EnglishCanada", label: "English Canada" },
    { value: "FrenchCanada", label: "Fran\xE7ais Canada" },
    { value: "BilingualCanada", label: "Bilingual Canada" }
  ];
  result = null;
  loading = true;
  saving = false;
  loadError = "";
  saveError = "";
  saveSuccess = "";
  rawPanelExpanded = false;
  jsonExportUrl = "";
  csvExportUrl = "";
  previewUrl = "";
  safePreviewUrl = null;
  isPdfPreview = false;
  isImagePreview = false;
  previewFailed = false;
  form;
  constructor(documentService, route, fb, sanitizer) {
    this.documentService = documentService;
    this.route = route;
    this.fb = fb;
    this.sanitizer = sanitizer;
    this.form = this.fb.group({
      vendorName: this.fb.nonNullable.control("", [Validators.required]),
      customerName: this.fb.nonNullable.control(""),
      documentNumber: this.fb.nonNullable.control(""),
      documentDate: this.fb.nonNullable.control(""),
      dueDate: this.fb.nonNullable.control(""),
      currency: this.fb.nonNullable.control("CAD", [Validators.required]),
      subtotal: this.fb.nonNullable.control(""),
      gst: this.fb.nonNullable.control(""),
      qst: this.fb.nonNullable.control(""),
      hst: this.fb.nonNullable.control(""),
      pst: this.fb.nonNullable.control(""),
      tip: this.fb.nonNullable.control(""),
      total: this.fb.nonNullable.control(""),
      detectedLanguage: this.fb.nonNullable.control("Unknown")
    });
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.loadReview(id);
      }
    });
  }
  loadReview(id) {
    this.loading = true;
    this.loadError = "";
    this.saveError = "";
    this.saveSuccess = "";
    this.previewUrl = "";
    this.safePreviewUrl = null;
    this.isPdfPreview = false;
    this.isImagePreview = false;
    this.previewFailed = false;
    forkJoin({
      result: this.documentService.getDocumentResult(id),
      rawText: this.documentService.getRawText(id).pipe(catchError2(() => of2({ rawText: "" })))
    }).subscribe({
      next: ({ result, rawText }) => {
        result.rawText = result.rawText || rawText.rawText || "";
        this.result = result;
        this.jsonExportUrl = this.documentService.getJsonExportUrl(result.document.id);
        this.csvExportUrl = this.documentService.getCsvExportUrl(result.document.id);
        this.previewUrl = this.documentService.getDocumentFileUrl(result.document.id);
        this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
        const contentType = (result.document.contentType || "").toLowerCase();
        this.isPdfPreview = contentType.includes("application/pdf");
        this.isImagePreview = contentType.startsWith("image/");
        this.previewFailed = false;
        this.patchFormFromResult(result);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = "Document result not found or could not be loaded.";
      }
    });
  }
  saveCorrections() {
    if (!this.result) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.saveError = "";
    this.saveSuccess = "";
    const request = this.buildUpdateRequest();
    this.documentService.updateExtractedFields(this.result.document.id, request).subscribe({
      next: (updatedResult) => {
        this.result = updatedResult;
        this.patchFormFromResult(updatedResult);
        this.saving = false;
        this.saveSuccess = "Corrections saved successfully. Validation result has been updated.";
      },
      error: (err) => {
        this.saving = false;
        this.saveError = this.getErrorMessage(err);
      }
    });
  }
  formatMoneyControl(controlName) {
    const control = this.form.controls[controlName];
    const parsed = this.parseMoney(control.value);
    if (parsed === null) {
      control.setValue(control.value.trim());
      return;
    }
    control.setValue(parsed.toFixed(2));
  }
  getWarningMessage(warning) {
    if (this.uiLanguage === "fr" && warning.messageFr) {
      return warning.messageFr;
    }
    return warning.messageEn;
  }
  getWarningSeverityClass(warning) {
    const severity = warning.severity.toLowerCase();
    if (severity.includes("error") || severity.includes("critical") || severity.includes("high")) {
      return "warning-critical";
    }
    if (severity.includes("warning") || severity.includes("medium")) {
      return "warning-warning";
    }
    return "warning-info";
  }
  onPreviewError() {
    this.previewFailed = true;
  }
  patchFormFromResult(result) {
    const fields = result.structuredExtractedFields;
    this.form.setValue({
      vendorName: fields?.vendorName ?? "",
      customerName: fields?.customerName ?? "",
      documentNumber: fields?.documentNumber ?? "",
      documentDate: this.toDateInputValue(fields?.documentDate),
      dueDate: this.toDateInputValue(fields?.dueDate),
      currency: fields?.currency ?? "CAD",
      subtotal: this.moneyToControlValue(fields?.subtotal),
      gst: this.moneyToControlValue(fields?.gst),
      qst: this.moneyToControlValue(fields?.qst),
      hst: this.moneyToControlValue(fields?.hst),
      pst: this.moneyToControlValue(fields?.pst),
      tip: this.moneyToControlValue(fields?.tip),
      total: this.moneyToControlValue(fields?.total),
      detectedLanguage: this.toDetectedLanguageValue(result.detectedDocumentLanguage)
    });
  }
  buildUpdateRequest() {
    const value = this.form.getRawValue();
    return {
      vendorName: this.toNullableTrimmed(value.vendorName),
      customerName: this.toNullableTrimmed(value.customerName),
      documentNumber: this.toNullableTrimmed(value.documentNumber),
      documentDate: this.toNullableTrimmed(value.documentDate),
      dueDate: this.toNullableTrimmed(value.dueDate),
      currency: this.toNullableTrimmed(value.currency)?.toUpperCase() ?? null,
      subtotal: this.parseMoney(value.subtotal),
      gst: this.parseMoney(value.gst),
      qst: this.parseMoney(value.qst),
      hst: this.parseMoney(value.hst),
      pst: this.parseMoney(value.pst),
      tip: this.parseMoney(value.tip),
      total: this.parseMoney(value.total),
      detectedLanguage: value.detectedLanguage
    };
  }
  toDateInputValue(value) {
    if (!value) {
      return "";
    }
    if (value.length >= 10) {
      return value.slice(0, 10);
    }
    return value;
  }
  moneyToControlValue(value) {
    if (typeof value !== "number") {
      return "";
    }
    return value.toFixed(2);
  }
  parseMoney(value) {
    const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
    if (!normalized) {
      return null;
    }
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      return null;
    }
    return Math.round(parsed * 100) / 100;
  }
  toNullableTrimmed(value) {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }
  toDetectedLanguageValue(value) {
    if (value === "EnglishCanada" || value === "FrenchCanada" || value === "BilingualCanada" || value === "Unknown") {
      return value;
    }
    return "Unknown";
  }
  getErrorMessage(err) {
    if (typeof err === "string" && err.trim().length > 0) {
      return err;
    }
    if (err && typeof err === "object") {
      const value = err;
      if (typeof value.error === "string" && value.error.trim().length > 0) {
        return value.error;
      }
      if (value.error && typeof value.error === "object") {
        const message = value.error.message;
        if (typeof message === "string" && message.trim().length > 0) {
          return message;
        }
      }
      if (typeof value.message === "string" && value.message.trim().length > 0) {
        return value.message;
      }
    }
    return "Failed to save corrections.";
  }
  static \u0275fac = function DocumentReviewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentReviewComponent)(i06.\u0275\u0275directiveInject(DocumentService), i06.\u0275\u0275directiveInject(i24.ActivatedRoute), i06.\u0275\u0275directiveInject(i34.FormBuilder), i06.\u0275\u0275directiveInject(i43.DomSanitizer));
  };
  static \u0275cmp = /* @__PURE__ */ i06.\u0275\u0275defineComponent({ type: _DocumentReviewComponent, selectors: [["app-document-review"]], decls: 4, vars: 3, consts: [[1, "container"], ["class", "loading", 4, "ngIf"], ["class", "not-found", 4, "ngIf"], ["class", "review-section", 4, "ngIf"], [1, "loading"], [1, "not-found"], ["routerLink", "/documents", 1, "btn", "btn-secondary"], [1, "review-section"], [1, "review-layout"], [1, "preview-panel"], ["class", "preview-frame", 4, "ngIf"], ["class", "preview-fallback", 4, "ngIf"], [1, "review-content"], [1, "header"], [1, "meta"], [1, "btn", "btn-secondary", 3, "routerLink"], [1, "actions", "top-actions"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["download", "", 1, "btn", "btn-outline", 3, "href"], ["class", "status-card", 4, "ngIf"], [1, "form-grid", 3, "ngSubmit", "formGroup"], [1, "field", "full-width"], ["for", "vendorName"], ["id", "vendorName", "type", "text", "formControlName", "vendorName"], ["class", "field-error", 4, "ngIf"], [1, "field"], ["for", "customerName"], ["id", "customerName", "type", "text", "formControlName", "customerName"], ["for", "documentNumber"], ["id", "documentNumber", "type", "text", "formControlName", "documentNumber"], ["for", "documentDate"], ["id", "documentDate", "type", "date", "formControlName", "documentDate"], ["for", "dueDate"], ["id", "dueDate", "type", "date", "formControlName", "dueDate"], ["for", "currency"], ["id", "currency", "type", "text", "formControlName", "currency", "maxlength", "3"], ["for", "detectedLanguage"], ["id", "detectedLanguage", "formControlName", "detectedLanguage"], [3, "value", 4, "ngFor", "ngForOf"], ["for", "subtotal"], ["id", "subtotal", "type", "text", "inputmode", "decimal", "formControlName", "subtotal", 3, "blur"], ["for", "gst"], ["id", "gst", "type", "text", "inputmode", "decimal", "formControlName", "gst", 3, "blur"], ["for", "qst"], ["id", "qst", "type", "text", "inputmode", "decimal", "formControlName", "qst", 3, "blur"], ["for", "hst"], ["id", "hst", "type", "text", "inputmode", "decimal", "formControlName", "hst", 3, "blur"], ["for", "pst"], ["id", "pst", "type", "text", "inputmode", "decimal", "formControlName", "pst", 3, "blur"], ["for", "tip"], ["id", "tip", "type", "text", "inputmode", "decimal", "formControlName", "tip", 3, "blur"], ["for", "total"], ["id", "total", "type", "text", "inputmode", "decimal", "formControlName", "total", 3, "blur"], ["class", "alert alert-danger", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["class", "warnings", 4, "ngIf"], [1, "raw-panel"], ["type", "button", 1, "btn", "btn-outline", 3, "click"], ["class", "raw-content", 4, "ngIf"], [1, "actions", "bottom-actions"], [1, "preview-frame"], ["title", "Document preview", 3, "error", "src"], [3, "error", "src", "alt"], [1, "preview-fallback"], [1, "preview-actions"], ["target", "_blank", "rel", "noopener", 1, "btn", "btn-outline", 3, "href"], [1, "status-card"], [1, "field-error"], [3, "value"], [1, "alert", "alert-danger"], [1, "alert", "alert-success"], [1, "warnings"], ["class", "warning-item", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "warning-item", 3, "ngClass"], [1, "warning-meta"], [1, "warning-code"], [1, "warning-severity"], ["class", "warning-field", 4, "ngIf"], [1, "warning-field"], [1, "raw-content"]], template: function DocumentReviewComponent_Template(rf, ctx) {
    if (rf & 1) {
      i06.\u0275\u0275elementStart(0, "div", 0);
      i06.\u0275\u0275template(1, DocumentReviewComponent_div_1_Template, 2, 0, "div", 1)(2, DocumentReviewComponent_div_2_Template, 5, 1, "div", 2)(3, DocumentReviewComponent_div_3_Template, 101, 29, "div", 3);
      i06.\u0275\u0275elementEnd();
    }
    if (rf & 2) {
      i06.\u0275\u0275advance();
      i06.\u0275\u0275property("ngIf", ctx.loading);
      i06.\u0275\u0275advance();
      i06.\u0275\u0275property("ngIf", !ctx.loading && ctx.loadError);
      i06.\u0275\u0275advance();
      i06.\u0275\u0275property("ngIf", !ctx.loading && ctx.result);
    }
  }, dependencies: [CommonModule4, i5.NgClass, i5.NgComponentOutlet, i5.NgForOf, i5.NgIf, i5.NgTemplateOutlet, i5.NgStyle, i5.NgSwitch, i5.NgSwitchCase, i5.NgSwitchDefault, i5.NgPlural, i5.NgPluralCase, RouterModule4, i24.RouterOutlet, i24.RouterLink, i24.RouterLinkActive, i24.\u0275EmptyOutletComponent, ReactiveFormsModule, i34.\u0275NgNoValidate, i34.NgSelectOption, i34.\u0275NgSelectMultipleOption, i34.DefaultValueAccessor, i34.NumberValueAccessor, i34.RangeValueAccessor, i34.CheckboxControlValueAccessor, i34.SelectControlValueAccessor, i34.SelectMultipleControlValueAccessor, i34.RadioControlValueAccessor, i34.NgControlStatus, i34.NgControlStatusGroup, i34.RequiredValidator, i34.MinLengthValidator, i34.MaxLengthValidator, i34.PatternValidator, i34.CheckboxRequiredValidator, i34.EmailValidator, i34.MinValidator, i34.MaxValidator, i34.FormControlDirective, i34.FormGroupDirective, i34.FormArrayDirective, i34.FormControlName, i34.FormGroupName, i34.FormArrayName, i5.AsyncPipe, i5.UpperCasePipe, i5.LowerCasePipe, i5.JsonPipe, i5.SlicePipe, i5.DecimalPipe, i5.PercentPipe, i5.TitleCasePipe, i5.CurrencyPipe, i5.DatePipe, i5.I18nPluralPipe, i5.I18nSelectPipe, i5.KeyValuePipe], styles: ['\n.container[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 24px;\n}\n.loading[_ngcontent-%COMP%], \n.not-found[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  border: 1px solid #eaecf0;\n  border-radius: 10px;\n  background: #fff;\n  color: #667085;\n}\n.review-section[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 10px;\n  padding: 26px;\n  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);\n  border: 1px solid #eaecf0;\n}\n.review-layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(280px, 34%) minmax(0, 1fr);\n  gap: 18px;\n  align-items: start;\n}\n.preview-panel[_ngcontent-%COMP%] {\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n  padding: 12px;\n  position: sticky;\n  top: 16px;\n}\n.preview-frame[_ngcontent-%COMP%] {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  overflow: hidden;\n  background: #f8fafc;\n  min-height: 520px;\n}\n.preview-frame[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%], \n.preview-frame[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  min-height: 520px;\n  border: 0;\n  display: block;\n  object-fit: contain;\n  background: #fff;\n}\n.preview-fallback[_ngcontent-%COMP%] {\n  border: 1px dashed #d0d5dd;\n  border-radius: 8px;\n  padding: 12px;\n  background: #f9fafb;\n}\n.preview-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: start;\n  gap: 14px;\n  margin-bottom: 14px;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 28px;\n  line-height: 1.2;\n}\n.meta[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  color: #667085;\n  font-size: 13px;\n}\n.status-card[_ngcontent-%COMP%] {\n  border: 1px solid #e4e7ec;\n  background: #f8fafc;\n  border-radius: 8px;\n  padding: 12px;\n  margin-bottom: 14px;\n}\n.status-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 16px;\n}\n.status-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 14px;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.top-actions[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.bottom-actions[_ngcontent-%COMP%] {\n  margin-top: 18px;\n  margin-bottom: 0;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  border-radius: 8px;\n  text-decoration: none;\n  font-weight: 600;\n  border: 1px solid transparent;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background-color: #175cd3;\n  color: #fff;\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background-color: #1849a9;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background-color: #475467;\n  color: #fff;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background-color: #344054;\n}\n.btn-outline[_ngcontent-%COMP%] {\n  border-color: #d0d5dd;\n  background: #fff;\n  color: #344054;\n}\n.btn-outline[_ngcontent-%COMP%]:hover {\n  background: #f9fafb;\n}\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.full-width[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\nlabel[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 700;\n  color: #475467;\n}\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #d0d5dd;\n  border-radius: 8px;\n  padding: 10px;\n  font-size: 14px;\n  color: #101828;\n  background: #fff;\n}\ninput[_ngcontent-%COMP%]:focus, \nselect[_ngcontent-%COMP%]:focus {\n  border-color: #175cd3;\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(23, 92, 211, 0.12);\n}\n.field-error[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #b42318;\n  font-size: 12px;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 12px;\n}\n.alert-danger[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n  color: #991b1b;\n  border: 1px solid #fecaca;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background-color: #ecfdf3;\n  color: #027a48;\n  border: 1px solid #abefc6;\n}\n.warnings[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  padding: 14px;\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n}\n.warnings[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n}\n.warning-item[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 10px;\n  border: 1px solid #e5e7eb;\n  margin-bottom: 8px;\n}\n.warning-meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-bottom: 4px;\n}\n.warning-code[_ngcontent-%COMP%], \n.warning-severity[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  padding: 3px 8px;\n  font-size: 11px;\n  font-weight: 700;\n  background: #f3f4f6;\n  color: #111827;\n}\n.warning-critical[_ngcontent-%COMP%] {\n  border-color: #fecaca;\n  background: #fef2f2;\n}\n.warning-warning[_ngcontent-%COMP%] {\n  border-color: #fed7aa;\n  background: #fffbeb;\n}\n.warning-info[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n.raw-panel[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  padding: 12px;\n  background: #fff;\n}\n.raw-content[_ngcontent-%COMP%] {\n  margin-top: 10px;\n}\npre[_ngcontent-%COMP%] {\n  margin: 0;\n  white-space: pre-wrap;\n  word-break: break-word;\n  max-height: 300px;\n  overflow: auto;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n  padding: 12px;\n  font-size: 13px;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n}\n@media (max-width: 900px) {\n  .review-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .preview-frame[_ngcontent-%COMP%], \n   .preview-frame[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%], \n   .preview-frame[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    min-height: 320px;\n  }\n  .header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n/*# sourceMappingURL=document-review.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i06.\u0275setClassMetadata(DocumentReviewComponent, [{
    type: Component4,
    args: [{ selector: "app-document-review", standalone: true, imports: [CommonModule4, RouterModule4, ReactiveFormsModule], template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Loading document review...</div>

      <div *ngIf="!loading && loadError" class="not-found">
        <p>{{ loadError }}</p>
        <a routerLink="/documents" class="btn btn-secondary">Back to list</a>
      </div>

      <div *ngIf="!loading && result" class="review-section">
        <div class="review-layout">
          <aside class="preview-panel">
            <h3>Document preview</h3>
            <div class="preview-frame" *ngIf="isPdfPreview">
              <iframe [src]="safePreviewUrl" title="Document preview" (error)="onPreviewError()"></iframe>
            </div>
            <div class="preview-frame" *ngIf="isImagePreview">
              <img [src]="previewUrl" [alt]="result.document.originalFileName" (error)="onPreviewError()" />
            </div>
            <div class="preview-fallback" *ngIf="previewFailed || (!isPdfPreview && !isImagePreview)">
              <p>Preview is not available for this file type.</p>
              <div class="preview-actions">
                <a [href]="previewUrl" class="btn btn-outline" target="_blank" rel="noopener">Open file</a>
                <a [href]="previewUrl" class="btn btn-outline" download>Download file</a>
              </div>
            </div>
          </aside>

          <div class="review-content">
            <div class="header">
          <div>
            <h1>Review {{ result.document.originalFileName }}</h1>
            <p class="meta">Document ID: {{ result.document.id }}</p>
          </div>
          <a [routerLink]="['/documents', result.document.id]" class="btn btn-secondary">Back to detail</a>
        </div>

        <div class="actions top-actions">
          <button type="button" class="btn btn-primary" [disabled]="saving || form.invalid" (click)="saveCorrections()">
            {{ saving ? 'Saving...' : 'Save corrections' }}
          </button>
          <a [href]="jsonExportUrl" class="btn btn-outline" download>Download JSON</a>
          <a [href]="csvExportUrl" class="btn btn-outline" download>Download CSV</a>
        </div>

        <div class="status-card" *ngIf="result.validationResult">
          <h3>Current validation status</h3>
          <p>
            <strong>{{ result.validationResult.isValidated ? 'Validated' : 'Needs review' }}</strong>
            \u2014 {{ result.validationResult.summary }}
          </p>
        </div>

        <div class="status-card" *ngIf="!result.validationResult">
          <h3>Current validation status</h3>
          <p>No validation result is currently available.</p>
        </div>

        <form [formGroup]="form" class="form-grid" (ngSubmit)="saveCorrections()">
          <div class="field full-width">
            <label for="vendorName">VendorName</label>
            <input id="vendorName" type="text" formControlName="vendorName" />
            <p *ngIf="form.controls.vendorName.touched && form.controls.vendorName.invalid" class="field-error">VendorName is required.</p>
          </div>

          <div class="field">
            <label for="customerName">CustomerName</label>
            <input id="customerName" type="text" formControlName="customerName" />
          </div>

          <div class="field">
            <label for="documentNumber">DocumentNumber</label>
            <input id="documentNumber" type="text" formControlName="documentNumber" />
          </div>

          <div class="field">
            <label for="documentDate">DocumentDate</label>
            <input id="documentDate" type="date" formControlName="documentDate" />
          </div>

          <div class="field">
            <label for="dueDate">DueDate</label>
            <input id="dueDate" type="date" formControlName="dueDate" />
          </div>

          <div class="field">
            <label for="currency">Currency</label>
            <input id="currency" type="text" formControlName="currency" maxlength="3" />
          </div>

          <div class="field">
            <label for="detectedLanguage">DetectedLanguage</label>
            <select id="detectedLanguage" formControlName="detectedLanguage">
              <option *ngFor="let option of languageOptions" [value]="option.value">{{ option.label }}</option>
            </select>
          </div>

          <div class="field">
            <label for="subtotal">Subtotal</label>
            <input id="subtotal" type="text" inputmode="decimal" formControlName="subtotal" (blur)="formatMoneyControl('subtotal')" />
          </div>

          <div class="field">
            <label for="gst">GST/TPS</label>
            <input id="gst" type="text" inputmode="decimal" formControlName="gst" (blur)="formatMoneyControl('gst')" />
          </div>

          <div class="field">
            <label for="qst">QST/TVQ</label>
            <input id="qst" type="text" inputmode="decimal" formControlName="qst" (blur)="formatMoneyControl('qst')" />
          </div>

          <div class="field">
            <label for="hst">HST/TVH</label>
            <input id="hst" type="text" inputmode="decimal" formControlName="hst" (blur)="formatMoneyControl('hst')" />
          </div>

          <div class="field">
            <label for="pst">PST/TVP</label>
            <input id="pst" type="text" inputmode="decimal" formControlName="pst" (blur)="formatMoneyControl('pst')" />
          </div>

          <div class="field">
            <label for="tip">Tip/Pourboire</label>
            <input id="tip" type="text" inputmode="decimal" formControlName="tip" (blur)="formatMoneyControl('tip')" />
          </div>

          <div class="field">
            <label for="total">Total</label>
            <input id="total" type="text" inputmode="decimal" formControlName="total" (blur)="formatMoneyControl('total')" />
          </div>
        </form>

        <div *ngIf="saveError" class="alert alert-danger">{{ saveError }}</div>
        <div *ngIf="saveSuccess" class="alert alert-success">{{ saveSuccess }}</div>

        <div class="warnings" *ngIf="result.bilingualWarnings.length > 0">
          <h3>Bilingual warnings and errors</h3>
          <div class="warning-item" *ngFor="let warning of result.bilingualWarnings" [ngClass]="getWarningSeverityClass(warning)">
            <div class="warning-meta">
              <span class="warning-code">{{ warning.code }}</span>
              <span class="warning-severity">{{ warning.severity }}</span>
            </div>
            <p>{{ getWarningMessage(warning) }}</p>
            <p *ngIf="warning.fieldName" class="warning-field">Field: {{ warning.fieldName }}</p>
          </div>
        </div>

        <div class="raw-panel">
          <button type="button" class="btn btn-outline" (click)="rawPanelExpanded = !rawPanelExpanded">
            {{ rawPanelExpanded ? 'Hide raw OCR text' : 'Show raw OCR text' }}
          </button>
          <div class="raw-content" *ngIf="rawPanelExpanded">
            <pre>{{ result.rawText || 'No raw OCR text available.' }}</pre>
          </div>
        </div>

        <div class="actions bottom-actions">
          <button type="button" class="btn btn-primary" [disabled]="saving || form.invalid" (click)="saveCorrections()">
            {{ saving ? 'Saving...' : 'Save corrections' }}
          </button>
          <a [routerLink]="['/documents', result.document.id]" class="btn btn-secondary">Back to detail</a>
          <a [href]="jsonExportUrl" class="btn btn-outline" download>Download JSON</a>
          <a [href]="csvExportUrl" class="btn btn-outline" download>Download CSV</a>
        </div>
          </div>
      </div>
    </div>
  `, styles: ['/* angular:styles/component:css;7cdde69616f56c16109f82dc29c101f4c1afaf20382452665eb47cd9be653560;E:/Zaya/frontend/src/app/pages/document-review/document-review.component.ts */\n.container {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 24px;\n}\n.loading,\n.not-found {\n  text-align: center;\n  padding: 40px;\n  border: 1px solid #eaecf0;\n  border-radius: 10px;\n  background: #fff;\n  color: #667085;\n}\n.review-section {\n  background: #fff;\n  border-radius: 10px;\n  padding: 26px;\n  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);\n  border: 1px solid #eaecf0;\n}\n.review-layout {\n  display: grid;\n  grid-template-columns: minmax(280px, 34%) minmax(0, 1fr);\n  gap: 18px;\n  align-items: start;\n}\n.preview-panel {\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n  padding: 12px;\n  position: sticky;\n  top: 16px;\n}\n.preview-frame {\n  border: 1px solid #e4e7ec;\n  border-radius: 8px;\n  overflow: hidden;\n  background: #f8fafc;\n  min-height: 520px;\n}\n.preview-frame iframe,\n.preview-frame img {\n  width: 100%;\n  height: 100%;\n  min-height: 520px;\n  border: 0;\n  display: block;\n  object-fit: contain;\n  background: #fff;\n}\n.preview-fallback {\n  border: 1px dashed #d0d5dd;\n  border-radius: 8px;\n  padding: 12px;\n  background: #f9fafb;\n}\n.preview-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: start;\n  gap: 14px;\n  margin-bottom: 14px;\n}\nh1 {\n  margin: 0;\n  font-size: 28px;\n  line-height: 1.2;\n}\n.meta {\n  margin: 6px 0 0;\n  color: #667085;\n  font-size: 13px;\n}\n.status-card {\n  border: 1px solid #e4e7ec;\n  background: #f8fafc;\n  border-radius: 8px;\n  padding: 12px;\n  margin-bottom: 14px;\n}\n.status-card h3 {\n  margin: 0 0 8px;\n  font-size: 16px;\n}\n.status-card p {\n  margin: 0;\n  font-size: 14px;\n}\n.actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.top-actions {\n  margin-bottom: 16px;\n}\n.bottom-actions {\n  margin-top: 18px;\n  margin-bottom: 0;\n}\n.btn {\n  padding: 10px 14px;\n  border-radius: 8px;\n  text-decoration: none;\n  font-weight: 600;\n  border: 1px solid transparent;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n}\n.btn:disabled {\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n.btn-primary {\n  background-color: #175cd3;\n  color: #fff;\n}\n.btn-primary:hover:not(:disabled) {\n  background-color: #1849a9;\n}\n.btn-secondary {\n  background-color: #475467;\n  color: #fff;\n}\n.btn-secondary:hover {\n  background-color: #344054;\n}\n.btn-outline {\n  border-color: #d0d5dd;\n  background: #fff;\n  color: #344054;\n}\n.btn-outline:hover {\n  background: #f9fafb;\n}\n.form-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.full-width {\n  grid-column: 1 / -1;\n}\nlabel {\n  font-size: 13px;\n  font-weight: 700;\n  color: #475467;\n}\ninput,\nselect {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #d0d5dd;\n  border-radius: 8px;\n  padding: 10px;\n  font-size: 14px;\n  color: #101828;\n  background: #fff;\n}\ninput:focus,\nselect:focus {\n  border-color: #175cd3;\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(23, 92, 211, 0.12);\n}\n.field-error {\n  margin: 0;\n  color: #b42318;\n  font-size: 12px;\n}\n.alert {\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 12px;\n}\n.alert-danger {\n  background-color: #fef2f2;\n  color: #991b1b;\n  border: 1px solid #fecaca;\n}\n.alert-success {\n  background-color: #ecfdf3;\n  color: #027a48;\n  border: 1px solid #abefc6;\n}\n.warnings {\n  margin-top: 8px;\n  padding: 14px;\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  background: #fff;\n}\n.warnings h3 {\n  margin: 0 0 10px;\n}\n.warning-item {\n  border-radius: 8px;\n  padding: 10px;\n  border: 1px solid #e5e7eb;\n  margin-bottom: 8px;\n}\n.warning-meta {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-bottom: 4px;\n}\n.warning-code,\n.warning-severity {\n  border-radius: 999px;\n  padding: 3px 8px;\n  font-size: 11px;\n  font-weight: 700;\n  background: #f3f4f6;\n  color: #111827;\n}\n.warning-critical {\n  border-color: #fecaca;\n  background: #fef2f2;\n}\n.warning-warning {\n  border-color: #fed7aa;\n  background: #fffbeb;\n}\n.warning-info {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n}\n.raw-panel {\n  margin-top: 14px;\n  border: 1px solid #eaecf0;\n  border-radius: 8px;\n  padding: 12px;\n  background: #fff;\n}\n.raw-content {\n  margin-top: 10px;\n}\npre {\n  margin: 0;\n  white-space: pre-wrap;\n  word-break: break-word;\n  max-height: 300px;\n  overflow: auto;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n  padding: 12px;\n  font-size: 13px;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n}\n@media (max-width: 900px) {\n  .review-layout {\n    grid-template-columns: 1fr;\n  }\n  .preview-frame,\n  .preview-frame iframe,\n  .preview-frame img {\n    min-height: 320px;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n/*# sourceMappingURL=document-review.component.css.map */\n'] }]
  }], () => [{ type: DocumentService }, { type: i24.ActivatedRoute }, { type: i34.FormBuilder }, { type: i43.DomSanitizer }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i06.\u0275setClassDebugInfo(DocumentReviewComponent, { className: "DocumentReviewComponent", filePath: "app/pages/document-review/document-review.component.ts", lineNumber: 541 });
})();
(() => {
  const id = "app%2Fpages%2Fdocument-review%2Fdocument-review.component.ts%40DocumentReviewComponent";
  function DocumentReviewComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i06.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i06.\u0275\u0275replaceMetadata(DocumentReviewComponent, m.default, [i06, i5, i24, i34, document_service_exports, i43], [CommonModule4, RouterModule4, ReactiveFormsModule, Component4], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && DocumentReviewComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && DocumentReviewComponent_HmrLoad(d.timestamp)));
})();

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "/documents", pathMatch: "full" },
  { path: "documents", component: DocumentsListComponent },
  { path: "documents/upload", component: DocumentUploadComponent },
  { path: "documents/:id", component: DocumentDetailComponent },
  { path: "documents/:id/review", component: DocumentReviewComponent },
  { path: "**", redirectTo: "documents" }
];

// src/app/app.config.ts
var localApiInterceptor = (request, next) => {
  if (!request.url.startsWith("/api/")) {
    return next(request);
  }
  const isLocalAngularDev = typeof window !== "undefined" && window.location.hostname === "localhost" && window.location.port === "4200";
  const targetUrl = isLocalAngularDev ? `http://localhost:5268${request.url}` : request.url;
  let headers = request.headers;
  if (isLocalAngularDev && !headers.has("X-API-Key")) {
    headers = headers.set("X-API-Key", "dev-local-api-key");
  }
  return next(request.clone({
    url: targetUrl,
    headers
  }));
};
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([localApiInterceptor])),
    provideRouter(routes)
  ]
};

// src/app/app.component.ts
import { Component as Component5 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
import { RouterOutlet as RouterOutlet5 } from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_router.js?v=57d19488";
import * as i07 from "/@fs/E:/Zaya/frontend/.angular/cache/22.0.0/frontend/vite/deps/@angular_core.js?v=57d19488";
var AppComponent = class _AppComponent {
  title = "frontend";
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i07.\u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 13, vars: 0, consts: [[1, "app-header"], [1, "app-brand"], [1, "app-nav"], ["routerLink", "/documents", "routerLinkActive", "active"], ["routerLink", "/documents/upload", "routerLinkActive", "active"], [1, "app-main"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      i07.\u0275\u0275elementStart(0, "header", 0)(1, "div", 1)(2, "h1");
      i07.\u0275\u0275text(3, "Financial OCR");
      i07.\u0275\u0275elementEnd();
      i07.\u0275\u0275elementStart(4, "p");
      i07.\u0275\u0275text(5, "Receipt and invoice review for Canadian documents");
      i07.\u0275\u0275elementEnd()();
      i07.\u0275\u0275elementStart(6, "nav", 2)(7, "a", 3);
      i07.\u0275\u0275text(8, "Documents");
      i07.\u0275\u0275elementEnd();
      i07.\u0275\u0275elementStart(9, "a", 4);
      i07.\u0275\u0275text(10, "Upload");
      i07.\u0275\u0275elementEnd()()();
      i07.\u0275\u0275elementStart(11, "main", 5);
      i07.\u0275\u0275element(12, "router-outlet");
      i07.\u0275\u0275elementEnd();
    }
  }, dependencies: [RouterOutlet5], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: #f4f6f8;\n  color: #232f3e;\n  font-family:\n    Inter,\n    system-ui,\n    sans-serif;\n}\n.app-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  padding: 20px 24px;\n  background: #fff;\n  border-bottom: 1px solid #e6ebf1;\n  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);\n}\n.app-brand[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.6rem;\n}\n.app-brand[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #576377;\n}\n.app-nav[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n}\n.app-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #334155;\n  text-decoration: none;\n  font-weight: 600;\n  padding: 10px 14px;\n  border-radius: 8px;\n  transition: background 0.2s ease;\n}\n.app-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n.app-nav[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #312e81;\n}\n.app-main[_ngcontent-%COMP%] {\n  padding: 24px;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i07.\u0275setClassMetadata(AppComponent, [{
    type: Component5,
    args: [{ selector: "app-root", standalone: true, imports: [RouterOutlet5], template: '<header class="app-header">\n  <div class="app-brand">\n    <h1>Financial OCR</h1>\n    <p>Receipt and invoice review for Canadian documents</p>\n  </div>\n  <nav class="app-nav">\n    <a routerLink="/documents" routerLinkActive="active">Documents</a>\n    <a routerLink="/documents/upload" routerLinkActive="active">Upload</a>\n  </nav>\n</header>\n\n<main class="app-main">\n  <router-outlet></router-outlet>\n</main>\n', styles: ["/* src/app/app.component.css */\n:host {\n  display: block;\n  min-height: 100vh;\n  background: #f4f6f8;\n  color: #232f3e;\n  font-family:\n    Inter,\n    system-ui,\n    sans-serif;\n}\n.app-header {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  padding: 20px 24px;\n  background: #fff;\n  border-bottom: 1px solid #e6ebf1;\n  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);\n}\n.app-brand h1 {\n  margin: 0;\n  font-size: 1.6rem;\n}\n.app-brand p {\n  margin: 4px 0 0;\n  color: #576377;\n}\n.app-nav {\n  display: flex;\n  gap: 16px;\n}\n.app-nav a {\n  color: #334155;\n  text-decoration: none;\n  font-weight: 600;\n  padding: 10px 14px;\n  border-radius: 8px;\n  transition: background 0.2s ease;\n}\n.app-nav a:hover,\n.app-nav a.active {\n  background: #eef2ff;\n  color: #312e81;\n}\n.app-main {\n  padding: 24px;\n}\n/*# sourceMappingURL=app.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i07.\u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "app/app.component.ts", lineNumber: 11 });
})();
(() => {
  const id = "app%2Fapp.component.ts%40AppComponent";
  function AppComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i07.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i07.\u0275\u0275replaceMetadata(AppComponent, m.default, [i07], [RouterOutlet5, Component5], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && AppComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && AppComponent_HmrLoad(d.timestamp)));
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIiwic3JjL2FwcC9hcHAuY29uZmlnLnRzIiwic3JjL2FwcC9wYWdlcy9kb2N1bWVudHMtbGlzdC9kb2N1bWVudHMtbGlzdC5jb21wb25lbnQudHMiLCJzcmMvYXBwL3NlcnZpY2VzL2RvY3VtZW50cy1hcGkuc2VydmljZS50cyIsInNyYy9hcHAvcGFnZXMvZG9jdW1lbnQtdXBsb2FkL2RvY3VtZW50LXVwbG9hZC5jb21wb25lbnQudHMiLCJzcmMvYXBwL3NlcnZpY2VzL2RvY3VtZW50LnNlcnZpY2UudHMiLCJzcmMvYXBwL3BhZ2VzL2RvY3VtZW50LWRldGFpbC9kb2N1bWVudC1kZXRhaWwuY29tcG9uZW50LnRzIiwic3JjL2FwcC9wYWdlcy9kb2N1bWVudC1yZXZpZXcvZG9jdW1lbnQtcmV2aWV3LmNvbXBvbmVudC50cyIsInNyYy9hcHAvYXBwLnJvdXRlcy50cyIsInNyYy9hcHAvYXBwLmNvbXBvbmVudC50cyIsInNyYy9hcHAvYXBwLmNvbXBvbmVudC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJvb3RzdHJhcEFwcGxpY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IGFwcENvbmZpZyB9IGZyb20gJy4vYXBwL2FwcC5jb25maWcnO1xyXG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC9hcHAuY29tcG9uZW50JztcclxuXHJcbmJvb3RzdHJhcEFwcGxpY2F0aW9uKEFwcENvbXBvbmVudCwgYXBwQ29uZmlnKVxyXG4gIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVycikpO1xyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbkNvbmZpZywgcHJvdmlkZVpvbmVDaGFuZ2VEZXRlY3Rpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yRm4sIHByb3ZpZGVIdHRwQ2xpZW50LCB3aXRoSW50ZXJjZXB0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBwcm92aWRlUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbmltcG9ydCB7IHJvdXRlcyB9IGZyb20gJy4vYXBwLnJvdXRlcyc7XHJcblxyXG5jb25zdCBsb2NhbEFwaUludGVyY2VwdG9yOiBIdHRwSW50ZXJjZXB0b3JGbiA9IChyZXF1ZXN0LCBuZXh0KSA9PiB7XHJcbiAgaWYgKCFyZXF1ZXN0LnVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XHJcbiAgICByZXR1cm4gbmV4dChyZXF1ZXN0KTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGlzTG9jYWxBbmd1bGFyRGV2ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcclxuICAgICYmIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCdcclxuICAgICYmIHdpbmRvdy5sb2NhdGlvbi5wb3J0ID09PSAnNDIwMCc7XHJcblxyXG4gIGNvbnN0IHRhcmdldFVybCA9IGlzTG9jYWxBbmd1bGFyRGV2ID8gYGh0dHA6Ly9sb2NhbGhvc3Q6NTI2OCR7cmVxdWVzdC51cmx9YCA6IHJlcXVlc3QudXJsO1xyXG4gIGxldCBoZWFkZXJzID0gcmVxdWVzdC5oZWFkZXJzO1xyXG5cclxuICBpZiAoaXNMb2NhbEFuZ3VsYXJEZXYgJiYgIWhlYWRlcnMuaGFzKCdYLUFQSS1LZXknKSkge1xyXG4gICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdYLUFQSS1LZXknLCAnZGV2LWxvY2FsLWFwaS1rZXknKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXh0KHJlcXVlc3QuY2xvbmUoe1xyXG4gICAgdXJsOiB0YXJnZXRVcmwsXHJcbiAgICBoZWFkZXJzXHJcbiAgfSkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGFwcENvbmZpZzogQXBwbGljYXRpb25Db25maWcgPSB7XHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBwcm92aWRlWm9uZUNoYW5nZURldGVjdGlvbih7IGV2ZW50Q29hbGVzY2luZzogdHJ1ZSB9KSxcclxuICAgIHByb3ZpZGVIdHRwQ2xpZW50KHdpdGhJbnRlcmNlcHRvcnMoW2xvY2FsQXBpSW50ZXJjZXB0b3JdKSksXHJcbiAgICBwcm92aWRlUm91dGVyKHJvdXRlcylcclxuICBdXHJcbn07XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IERvY3VtZW50c0FwaVNlcnZpY2UsIERvY3VtZW50TGlzdEl0ZW0gfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kb2N1bWVudHMtYXBpLnNlcnZpY2UnO1xuXG50eXBlIFN0YXR1c0JhZGdlQ2xhc3MgPSAnYmFkZ2UtdXBsb2FkZWQnIHwgJ2JhZGdlLXByb2Nlc3NpbmcnIHwgJ2JhZGdlLWNvbXBsZXRlZCcgfCAnYmFkZ2UtZmFpbGVkJyB8ICdiYWRnZS1uZWVkcy1yZXZpZXcnIHwgJ2JhZGdlLXVua25vd24nO1xudHlwZSBMYW5ndWFnZUJhZGdlQ2xhc3MgPSAnYmFkZ2UtbGFuZ3VhZ2UtZW4nIHwgJ2JhZGdlLWxhbmd1YWdlLWZyJyB8ICdiYWRnZS1sYW5ndWFnZS1iaWxpbmd1YWwnIHwgJ2JhZGdlLWxhbmd1YWdlLXVua25vd24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtZG9jdW1lbnRzLWxpc3QnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGVdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cbiAgICAgICAgPGgxPnt7IGxhYmVscy50aXRsZSB9fTwvaDE+XG4gICAgICAgIDxhIHJvdXRlckxpbms9XCIvZG9jdW1lbnRzL3VwbG9hZFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+e3sgbGFiZWxzLmFjdGlvbnMudXBsb2FkTmV3RG9jdW1lbnQgfX08L2E+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiAqbmdJZj1cImxvYWRpbmdcIiBjbGFzcz1cImxvYWRpbmctc3RhdGVcIj57eyBsYWJlbHMubG9hZGluZyB9fTwvZGl2PlxuXG4gICAgICA8ZGl2ICpuZ0lmPVwiIWxvYWRpbmcgJiYgZXJyb3JNZXNzYWdlXCIgY2xhc3M9XCJlcnJvci1zdGF0ZVwiPlxuICAgICAgICA8cD57eyBlcnJvck1lc3NhZ2UgfX08L3A+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiAoY2xpY2spPVwibG9hZERvY3VtZW50cygpXCI+e3sgbGFiZWxzLnJldHJ5IH19PC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiAqbmdJZj1cIiFsb2FkaW5nICYmICFlcnJvck1lc3NhZ2UgJiYgZG9jdW1lbnRzLmxlbmd0aCA9PT0gMFwiIGNsYXNzPVwiZW1wdHktc3RhdGVcIj5cbiAgICAgICAgPHA+e3sgbGFiZWxzLmVtcHR5IH19PC9wPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgKm5nSWY9XCIhbG9hZGluZyAmJiAhZXJyb3JNZXNzYWdlICYmIGRvY3VtZW50cy5sZW5ndGggPiAwXCIgY2xhc3M9XCJ0YWJsZS13cmFwcGVyXCI+XG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIDx0aD57eyBsYWJlbHMuY29sdW1ucy5vcmlnaW5hbEZpbGVOYW1lIH19PC90aD5cbiAgICAgICAgICAgICAgPHRoPnt7IGxhYmVscy5jb2x1bW5zLmRvY3VtZW50VHlwZSB9fTwvdGg+XG4gICAgICAgICAgICAgIDx0aD57eyBsYWJlbHMuY29sdW1ucy5kb2N1bWVudExhbmd1YWdlIH19PC90aD5cbiAgICAgICAgICAgICAgPHRoPnt7IGxhYmVscy5jb2x1bW5zLnByb2Nlc3NpbmdTdGF0dXMgfX08L3RoPlxuICAgICAgICAgICAgICA8dGg+e3sgbGFiZWxzLmNvbHVtbnMudXBsb2FkZWREYXRlIH19PC90aD5cbiAgICAgICAgICAgICAgPHRoPnt7IGxhYmVscy5jb2x1bW5zLnByb2Nlc3NlZERhdGUgfX08L3RoPlxuICAgICAgICAgICAgICA8dGg+e3sgbGFiZWxzLmNvbHVtbnMuYWN0aW9ucyB9fTwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgPHRyICpuZ0Zvcj1cImxldCBkb2N1bWVudCBvZiBkb2N1bWVudHNcIj5cbiAgICAgICAgICAgICAgPHRkPnt7IGRvY3VtZW50LmZpbGVOYW1lIH19PC90ZD5cbiAgICAgICAgICAgICAgPHRkPnt7IGRvY3VtZW50LmRvY3VtZW50VHlwZSB9fTwvdGQ+XG4gICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlXCIgW25nQ2xhc3NdPVwiZ2V0TGFuZ3VhZ2VCYWRnZUNsYXNzKGRvY3VtZW50LmRvY3VtZW50TGFuZ3VhZ2UpXCI+XG4gICAgICAgICAgICAgICAgICB7eyBnZXRMYW5ndWFnZUxhYmVsKGRvY3VtZW50LmRvY3VtZW50TGFuZ3VhZ2UpIH19XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZVwiIFtuZ0NsYXNzXT1cImdldFN0YXR1c0JhZGdlQ2xhc3MoZG9jdW1lbnQuc3RhdHVzKVwiPlxuICAgICAgICAgICAgICAgICAge3sgZ2V0U3RhdHVzTGFiZWwoZG9jdW1lbnQuc3RhdHVzKSB9fVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgPHRkPnt7IGZvcm1hdERhdGUoZG9jdW1lbnQudXBsb2FkZWRBdFV0YykgfX08L3RkPlxuICAgICAgICAgICAgICA8dGQ+e3sgZm9ybWF0RGF0ZShkb2N1bWVudC5wcm9jZXNzZWRBdFV0YykgfX08L3RkPlxuICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdy1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICA8YSBbcm91dGVyTGlua109XCJbJy9kb2N1bWVudHMnLCBkb2N1bWVudC5pZF1cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiPnt7IGxhYmVscy5hY3Rpb25zLnZpZXdEZXRhaWxzIH19PC9hPlxuICAgICAgICAgICAgICAgICAgPGEgcm91dGVyTGluaz1cIi9kb2N1bWVudHMvdXBsb2FkXCIgY2xhc3M9XCJidG4gYnRuLWxpbmtcIj57eyBsYWJlbHMuYWN0aW9ucy51cGxvYWROZXdEb2N1bWVudCB9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG4gICAgLmNvbnRhaW5lciB7XG4gICAgICBtYXgtd2lkdGg6IDEyMDBweDtcbiAgICAgIG1hcmdpbjogMCBhdXRvO1xuICAgICAgcGFkZGluZzogMjRweDtcbiAgICB9XG5cbiAgICAuaGVhZGVyIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgZ2FwOiAxNnB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcbiAgICB9XG5cbiAgICBoMSB7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBmb250LXNpemU6IDI4cHg7XG4gICAgICBmb250LXdlaWdodDogNjAwO1xuICAgIH1cblxuICAgIC5sb2FkaW5nLXN0YXRlLFxuICAgIC5lcnJvci1zdGF0ZSxcbiAgICAuZW1wdHktc3RhdGUge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U0ZTdlYztcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xuICAgICAgY29sb3I6ICM0NzU0Njc7XG4gICAgfVxuXG4gICAgLmVycm9yLXN0YXRlIHtcbiAgICAgIGJvcmRlci1jb2xvcjogI2ZkYTI5YjtcbiAgICAgIGNvbG9yOiAjYjQyMzE4O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICBnYXA6IDE2cHg7XG4gICAgfVxuXG4gICAgLmVycm9yLXN0YXRlIHAge1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgIC50YWJsZS13cmFwcGVyIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNGU3ZWM7XG4gICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgICB9XG5cbiAgICB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gICAgfVxuXG4gICAgdGhlYWQge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbiAgICB9XG5cbiAgICB0aCxcbiAgICB0ZCB7XG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgcGFkZGluZzogMTJweCAxNHB4O1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNGU3ZWM7XG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgIH1cblxuICAgIHRib2R5IHRyOmxhc3QtY2hpbGQgdGQge1xuICAgICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgICB9XG5cbiAgICAuYnRuIHtcbiAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAuYnRuLXByaW1hcnkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzI1NjNlYjtcbiAgICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgICAgcGFkZGluZzogMTBweCAxNnB4O1xuICAgIH1cblxuICAgIC5idG4tcHJpbWFyeTpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWQ0ZWQ4O1xuICAgIH1cblxuICAgIC5idG4tc2Vjb25kYXJ5IHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM0NzU0Njc7XG4gICAgICBjb2xvcjogI2ZmZmZmZjtcbiAgICAgIHBhZGRpbmc6IDhweCAxNHB4O1xuICAgIH1cblxuICAgIC5idG4tc2Vjb25kYXJ5OmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMzNDQwNTQ7XG4gICAgfVxuXG4gICAgLmJ0bi1saW5rIHtcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgY29sb3I6ICMxNzVjZDM7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgIC5yb3ctYWN0aW9ucyB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZ2FwOiAxMnB4O1xuICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgIH1cblxuICAgIC5iYWRnZSB7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcbiAgICAgIHBhZGRpbmc6IDRweCAxMHB4O1xuICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB9XG5cbiAgICAuYmFkZ2UtdXBsb2FkZWQge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2VmZjhmZjtcbiAgICAgIGNvbG9yOiAjMTc1Y2QzO1xuICAgIH1cblxuICAgIC5iYWRnZS1wcm9jZXNzaW5nIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlY2ZkZjM7XG4gICAgICBjb2xvcjogIzAyN2E0ODtcbiAgICB9XG5cbiAgICAuYmFkZ2UtY29tcGxldGVkIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlY2ZkZjM7XG4gICAgICBjb2xvcjogIzAyN2E0ODtcbiAgICB9XG5cbiAgICAuYmFkZ2UtZmFpbGVkIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWYzZjI7XG4gICAgICBjb2xvcjogI2I0MjMxODtcbiAgICB9XG5cbiAgICAuYmFkZ2UtbmVlZHMtcmV2aWV3IHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY3ZWQ7XG4gICAgICBjb2xvcjogI2I1NDcwODtcbiAgICB9XG5cbiAgICAuYmFkZ2UtdW5rbm93biB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjJmNGY3O1xuICAgICAgY29sb3I6ICM0NzU0Njc7XG4gICAgfVxuXG4gICAgLmJhZGdlLWxhbmd1YWdlLWVuIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlZmY4ZmY7XG4gICAgICBjb2xvcjogIzE3NWNkMztcbiAgICB9XG5cbiAgICAuYmFkZ2UtbGFuZ3VhZ2UtZnIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjNmZjtcbiAgICAgIGNvbG9yOiAjNjk0MWM2O1xuICAgIH1cblxuICAgIC5iYWRnZS1sYW5ndWFnZS1iaWxpbmd1YWwge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2VjZmRmMztcbiAgICAgIGNvbG9yOiAjMDI3YTQ4O1xuICAgIH1cblxuICAgIC5iYWRnZS1sYW5ndWFnZS11bmtub3duIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmMmY0Zjc7XG4gICAgICBjb2xvcjogIzQ3NTQ2NztcbiAgICB9XG4gIGBdXG59KVxuZXhwb3J0IGNsYXNzIERvY3VtZW50c0xpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBkb2N1bWVudHM6IERvY3VtZW50TGlzdEl0ZW1bXSA9IFtdO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIGVycm9yTWVzc2FnZSA9ICcnO1xuXG4gIHJlYWRvbmx5IGxhYmVscyA9IHtcbiAgICB0aXRsZTogJ0RvY3VtZW50cycsXG4gICAgbG9hZGluZzogJ0xvYWRpbmcgZG9jdW1lbnRzLi4uJyxcbiAgICBlbXB0eTogJ05vIGRvY3VtZW50cyBmb3VuZC4nLFxuICAgIHJldHJ5OiAnUmV0cnknLFxuICAgIGNvbHVtbnM6IHtcbiAgICAgIG9yaWdpbmFsRmlsZU5hbWU6ICdPcmlnaW5hbCBmaWxlIG5hbWUnLFxuICAgICAgZG9jdW1lbnRUeXBlOiAnRG9jdW1lbnQgdHlwZScsXG4gICAgICBkb2N1bWVudExhbmd1YWdlOiAnRG9jdW1lbnQgbGFuZ3VhZ2UnLFxuICAgICAgcHJvY2Vzc2luZ1N0YXR1czogJ1Byb2Nlc3Npbmcgc3RhdHVzJyxcbiAgICAgIHVwbG9hZGVkRGF0ZTogJ1VwbG9hZGVkIGRhdGUnLFxuICAgICAgcHJvY2Vzc2VkRGF0ZTogJ1Byb2Nlc3NlZCBkYXRlJyxcbiAgICAgIGFjdGlvbnM6ICdBY3Rpb25zJ1xuICAgIH0sXG4gICAgYWN0aW9uczoge1xuICAgICAgdmlld0RldGFpbHM6ICdWaWV3IGRldGFpbHMnLFxuICAgICAgdXBsb2FkTmV3RG9jdW1lbnQ6ICdVcGxvYWQgbmV3IGRvY3VtZW50J1xuICAgIH1cbiAgfSBhcyBjb25zdDtcblxuICBwcml2YXRlIHJlYWRvbmx5IHN0YXR1c0xhYmVsczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBVcGxvYWRlZDogJ1VwbG9hZGVkJyxcbiAgICBQcm9jZXNzaW5nOiAnUHJvY2Vzc2luZycsXG4gICAgQ29tcGxldGVkOiAnQ29tcGxldGVkJyxcbiAgICBGYWlsZWQ6ICdGYWlsZWQnLFxuICAgIE5lZWRzUmV2aWV3OiAnTmVlZHMgUmV2aWV3J1xuICB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgbGFuZ3VhZ2VMYWJlbHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgRW5nbGlzaENhbmFkYTogJ0VuZ2xpc2ggQ2FuYWRhJyxcbiAgICBGcmVuY2hDYW5hZGE6ICdGcmFuw6dhaXMgQ2FuYWRhJyxcbiAgICBCaWxpbmd1YWxDYW5hZGE6ICdCaWxpbmd1YWwgQ2FuYWRhJyxcbiAgICBVbmtub3duOiAnQXV0by9Vbmtub3duJ1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnRzQXBpU2VydmljZTogRG9jdW1lbnRzQXBpU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxvYWREb2N1bWVudHMoKTtcbiAgfVxuXG4gIGxvYWREb2N1bWVudHMoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmVycm9yTWVzc2FnZSA9ICcnO1xuXG4gICAgdGhpcy5kb2N1bWVudHNBcGlTZXJ2aWNlLmdldERvY3VtZW50cygpLnN1YnNjcmliZSh7XG4gICAgICBuZXh0OiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdGhpcy5kb2N1bWVudHMgPSByZXNwb25zZTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZXJyb3I6ICgpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gJ0ZhaWxlZCB0byBsb2FkIGRvY3VtZW50cy4gUGxlYXNlIHRyeSBhZ2Fpbi4nO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3RhdHVzTGFiZWwoc3RhdHVzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnN0YXR1c0xhYmVsc1tzdGF0dXNdID8/IHN0YXR1cztcbiAgfVxuXG4gIGdldExhbmd1YWdlTGFiZWwobGFuZ3VhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2VMYWJlbHNbbGFuZ3VhZ2VdID8/IHRoaXMubGFuZ3VhZ2VMYWJlbHNbJ1Vua25vd24nXTtcbiAgfVxuXG4gIGdldFN0YXR1c0JhZGdlQ2xhc3Moc3RhdHVzOiBzdHJpbmcpOiBTdGF0dXNCYWRnZUNsYXNzIHtcbiAgICBjb25zdCBiYWRnZUNsYXNzTWFwOiBSZWNvcmQ8c3RyaW5nLCBTdGF0dXNCYWRnZUNsYXNzPiA9IHtcbiAgICAgIFVwbG9hZGVkOiAnYmFkZ2UtdXBsb2FkZWQnLFxuICAgICAgUHJvY2Vzc2luZzogJ2JhZGdlLXByb2Nlc3NpbmcnLFxuICAgICAgQ29tcGxldGVkOiAnYmFkZ2UtY29tcGxldGVkJyxcbiAgICAgIEZhaWxlZDogJ2JhZGdlLWZhaWxlZCcsXG4gICAgICBOZWVkc1JldmlldzogJ2JhZGdlLW5lZWRzLXJldmlldydcbiAgICB9O1xuXG4gICAgcmV0dXJuIGJhZGdlQ2xhc3NNYXBbc3RhdHVzXSA/PyAnYmFkZ2UtdW5rbm93bic7XG4gIH1cblxuICBnZXRMYW5ndWFnZUJhZGdlQ2xhc3MobGFuZ3VhZ2U6IHN0cmluZyk6IExhbmd1YWdlQmFkZ2VDbGFzcyB7XG4gICAgY29uc3QgYmFkZ2VDbGFzc01hcDogUmVjb3JkPHN0cmluZywgTGFuZ3VhZ2VCYWRnZUNsYXNzPiA9IHtcbiAgICAgIEVuZ2xpc2hDYW5hZGE6ICdiYWRnZS1sYW5ndWFnZS1lbicsXG4gICAgICBGcmVuY2hDYW5hZGE6ICdiYWRnZS1sYW5ndWFnZS1mcicsXG4gICAgICBCaWxpbmd1YWxDYW5hZGE6ICdiYWRnZS1sYW5ndWFnZS1iaWxpbmd1YWwnLFxuICAgICAgVW5rbm93bjogJ2JhZGdlLWxhbmd1YWdlLXVua25vd24nXG4gICAgfTtcblxuICAgIHJldHVybiBiYWRnZUNsYXNzTWFwW2xhbmd1YWdlXSA/PyAnYmFkZ2UtbGFuZ3VhZ2UtdW5rbm93bic7XG4gIH1cblxuICBmb3JtYXREYXRlKHZhbHVlOiBzdHJpbmcgfCBudWxsKTogc3RyaW5nIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gJy0nO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSkudG9Mb2NhbGVTdHJpbmcoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IHR5cGUgRG9jdW1lbnRQcm9jZXNzaW5nU3RhdHVzID0gJ1VwbG9hZGVkJyB8ICdQcm9jZXNzaW5nJyB8ICdDb21wbGV0ZWQnIHwgJ0ZhaWxlZCcgfCAnTmVlZHNSZXZpZXcnIHwgJ1BlbmRpbmcnO1xuZXhwb3J0IHR5cGUgRG9jdW1lbnRMYW5ndWFnZUNvZGUgPSAnRW5nbGlzaENhbmFkYScgfCAnRnJlbmNoQ2FuYWRhJyB8ICdCaWxpbmd1YWxDYW5hZGEnIHwgJ1Vua25vd24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIERvY3VtZW50TGlzdEl0ZW0ge1xuICBpZDogc3RyaW5nO1xuICBmaWxlTmFtZTogc3RyaW5nO1xuICBkb2N1bWVudFR5cGU6IHN0cmluZztcbiAgZG9jdW1lbnRMYW5ndWFnZTogRG9jdW1lbnRMYW5ndWFnZUNvZGUgfCBzdHJpbmc7XG4gIHN0YXR1czogRG9jdW1lbnRQcm9jZXNzaW5nU3RhdHVzIHwgc3RyaW5nO1xuICB1cGxvYWRlZEF0VXRjOiBzdHJpbmc7XG4gIHByb2Nlc3NlZEF0VXRjOiBzdHJpbmcgfCBudWxsO1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIERvY3VtZW50c0FwaVNlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGFwaVVybCA9ICcvYXBpL2RvY3VtZW50cyc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBodHRwOiBIdHRwQ2xpZW50KSB7fVxuXG4gIGdldERvY3VtZW50cygpOiBPYnNlcnZhYmxlPERvY3VtZW50TGlzdEl0ZW1bXT4ge1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PERvY3VtZW50TGlzdEl0ZW1bXT4odGhpcy5hcGlVcmwpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEV2ZW50VHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgRG9jdW1lbnRTZXJ2aWNlLCBVcGxvYWREb2N1bWVudExhbmd1YWdlLCBVcGxvYWREb2N1bWVudFR5cGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kb2N1bWVudC5zZXJ2aWNlJztcblxuaW50ZXJmYWNlIExhYmVsT3B0aW9uPFRWYWx1ZSBleHRlbmRzIHN0cmluZz4ge1xuICB2YWx1ZTogVFZhbHVlO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG5jb25zdCBVUExPQURfTEFCRUxTID0ge1xuICB0aXRsZTogJ1VwbG9hZCBEb2N1bWVudCcsXG4gIGZpZWxkczoge1xuICAgIGRvY3VtZW50VHlwZTogJ0RvY3VtZW50IHR5cGUnLFxuICAgIGRvY3VtZW50TGFuZ3VhZ2U6ICdEb2N1bWVudCBsYW5ndWFnZScsXG4gICAgc2VsZWN0RmlsZTogJ1NlbGVjdCBmaWxlJyxcbiAgICBwcm9jZXNzQWZ0ZXJVcGxvYWQ6ICdBdXRvbWF0aWNhbGx5IHByb2Nlc3MgYWZ0ZXIgdXBsb2FkJ1xuICB9LFxuICBidXR0b25zOiB7XG4gICAgY2hvb3NlRmlsZTogJ0Nob29zZSBmaWxlJyxcbiAgICB1cGxvYWRPbmx5OiAnVXBsb2FkIG9ubHknLFxuICAgIHVwbG9hZEFuZFByb2Nlc3M6ICdVcGxvYWQgYW5kIHByb2Nlc3Mgbm93JyxcbiAgICBjYW5jZWw6ICdDYW5jZWwnXG4gIH0sXG4gIGZpbGU6IHtcbiAgICBub25lU2VsZWN0ZWQ6ICdObyBmaWxlIHNlbGVjdGVkJyxcbiAgICBpbnZhbGlkVHlwZTogJ1Vuc3VwcG9ydGVkIGZpbGUgdHlwZS4gQWxsb3dlZDogUERGLCBQTkcsIEpQRywgSlBFRywgV0VCUC4nLFxuICAgIHRvb0xhcmdlOiAnRmlsZSBzaXplIGV4Y2VlZHMgdGhlIG1heGltdW0gYWxsb3dlZCBzaXplIG9mIDEwIE1CLidcbiAgfSxcbiAgc3RhdHVzOiB7XG4gICAgdXBsb2FkaW5nOiAnVXBsb2FkaW5nLi4uJyxcbiAgICBwcm9jZXNzaW5nOiAnUHJvY2Vzc2luZyBkb2N1bWVudC4uLicsXG4gICAgdXBsb2FkU3VjY2VzczogJ1VwbG9hZCBzdWNjZXNzZnVsLiBSZWRpcmVjdGluZyB0byBkb2N1bWVudCBkZXRhaWxzLi4uJyxcbiAgICBwcm9jZXNzU3VjY2VzczogJ0RvY3VtZW50IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHkuIFJlZGlyZWN0aW5nIHRvIGRvY3VtZW50IGRldGFpbHMuLi4nXG4gIH0sXG4gIHZhbGlkYXRpb246IHtcbiAgICBmaWxlUmVxdWlyZWQ6ICdQbGVhc2Ugc2VsZWN0IGEgZmlsZSBiZWZvcmUgdXBsb2FkaW5nLidcbiAgfVxufSBhcyBjb25zdDtcblxuY29uc3QgRE9DVU1FTlRfVFlQRV9PUFRJT05TOiBMYWJlbE9wdGlvbjxVcGxvYWREb2N1bWVudFR5cGU+W10gPSBbXG4gIHsgdmFsdWU6ICdyZWNlaXB0JywgbGFiZWw6ICdSZWNlaXB0JyB9LFxuICB7IHZhbHVlOiAnaW52b2ljZScsIGxhYmVsOiAnSW52b2ljZScgfVxuXTtcblxuY29uc3QgRE9DVU1FTlRfTEFOR1VBR0VfT1BUSU9OUzogTGFiZWxPcHRpb248VXBsb2FkRG9jdW1lbnRMYW5ndWFnZT5bXSA9IFtcbiAgeyB2YWx1ZTogJ2F1dG8nLCBsYWJlbDogJ0F1dG8tZGV0ZWN0JyB9LFxuICB7IHZhbHVlOiAnZW4tQ0EnLCBsYWJlbDogJ0VuZ2xpc2ggQ2FuYWRhJyB9LFxuICB7IHZhbHVlOiAnZnItQ0EnLCBsYWJlbDogJ0ZyYW7Dp2FpcyBDYW5hZGEnIH0sXG4gIHsgdmFsdWU6ICdiaWxpbmd1YWwtQ0EnLCBsYWJlbDogJ0JpbGluZ3VhbCBDYW5hZGEnIH1cbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1kb2N1bWVudC11cGxvYWQnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwidXBsb2FkLXNlY3Rpb25cIj5cbiAgICAgICAgPGgxPnt7IGxhYmVscy50aXRsZSB9fTwvaDE+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICA8bGFiZWw+e3sgbGFiZWxzLmZpZWxkcy5kb2N1bWVudFR5cGUgfX08L2xhYmVsPlxuICAgICAgICAgIDxzZWxlY3QgWyhuZ01vZGVsKV09XCJkb2N1bWVudFR5cGVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxuICAgICAgICAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIGRvY3VtZW50VHlwZU9wdGlvbnNcIiBbdmFsdWVdPVwib3B0aW9uLnZhbHVlXCI+e3sgb3B0aW9uLmxhYmVsIH19PC9vcHRpb24+XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgPGxhYmVsPnt7IGxhYmVscy5maWVsZHMuZG9jdW1lbnRMYW5ndWFnZSB9fTwvbGFiZWw+XG4gICAgICAgICAgPHNlbGVjdCBbKG5nTW9kZWwpXT1cImRvY3VtZW50TGFuZ3VhZ2VcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxuICAgICAgICAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIGRvY3VtZW50TGFuZ3VhZ2VPcHRpb25zXCIgW3ZhbHVlXT1cIm9wdGlvbi52YWx1ZVwiPnt7IG9wdGlvbi5sYWJlbCB9fTwvb3B0aW9uPlxuICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgIDxsYWJlbD57eyBsYWJlbHMuZmllbGRzLnNlbGVjdEZpbGUgfX08L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLWlucHV0LXdyYXBwZXJcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgICNmaWxlSW5wdXRcbiAgICAgICAgICAgICAgKGNoYW5nZSk9XCJvbkZpbGVTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgYWNjZXB0PVwiLnBkZiwucG5nLC5qcGcsLmpwZWcsLndlYnBcIlxuICAgICAgICAgICAgICBjbGFzcz1cImZpbGUtaW5wdXRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJmaWxlSW5wdXQuY2xpY2soKVwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAge3sgbGFiZWxzLmJ1dHRvbnMuY2hvb3NlRmlsZSB9fVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZpbGUtbmFtZVwiPnt7IHNlbGVjdGVkRmlsZURpc3BsYXkgfHwgbGFiZWxzLmZpbGUubm9uZVNlbGVjdGVkIH19PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBjaGVja2JveC1yb3dcIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveC1sYWJlbFwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIFsobmdNb2RlbCldPVwicHJvY2Vzc0FmdGVyVXBsb2FkXCIgLz5cbiAgICAgICAgICAgIDxzcGFuPnt7IGxhYmVscy5maWVsZHMucHJvY2Vzc0FmdGVyVXBsb2FkIH19PC9zcGFuPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgKm5nSWY9XCJlcnJvclwiIGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCI+XG4gICAgICAgICAge3sgZXJyb3IgfX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiAqbmdJZj1cInN1Y2Nlc3NNZXNzYWdlXCIgY2xhc3M9XCJhbGVydCBhbGVydC1zdWNjZXNzXCI+XG4gICAgICAgICAge3sgc3VjY2Vzc01lc3NhZ2UgfX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiAqbmdJZj1cInVwbG9hZGluZyB8fCBwcm9jZXNzaW5nXCIgY2xhc3M9XCJ1cGxvYWRpbmdcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPjwvZGl2PlxuICAgICAgICAgIDxwPnt7IHByb2Nlc3NpbmcgPyBsYWJlbHMuc3RhdHVzLnByb2Nlc3NpbmcgOiBsYWJlbHMuc3RhdHVzLnVwbG9hZGluZyB9fTwvcD5cbiAgICAgICAgICA8cCAqbmdJZj1cInVwbG9hZGluZyAmJiB1cGxvYWRQcm9ncmVzcyA+IDBcIiBjbGFzcz1cInByb2dyZXNzXCI+e3sgdXBsb2FkUHJvZ3Jlc3MgfX0lPC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXJvd1wiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cInNlbGVjdGVkRmlsZXMubGVuZ3RoID09PSAwIHx8IHVwbG9hZGluZyB8fCBwcm9jZXNzaW5nXCJcbiAgICAgICAgICAgIChjbGljayk9XCJzdWJtaXQoZmFsc2UpXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1sZ1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3sgbGFiZWxzLmJ1dHRvbnMudXBsb2FkT25seSB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwic2VsZWN0ZWRGaWxlcy5sZW5ndGggPT09IDAgfHwgdXBsb2FkaW5nIHx8IHByb2Nlc3NpbmdcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInN1Ym1pdCh0cnVlKVwiXG4gICAgICAgICAgICBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tbGdcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt7IGxhYmVscy5idXR0b25zLnVwbG9hZEFuZFByb2Nlc3MgfX1cbiAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgIDxhIHJvdXRlckxpbms9XCIvZG9jdW1lbnRzXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tbGdcIj57eyBsYWJlbHMuYnV0dG9ucy5jYW5jZWwgfX08L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICAuY29udGFpbmVyIHtcbiAgICAgIG1heC13aWR0aDogNzAwcHg7XG4gICAgICBtYXJnaW46IDAgYXV0bztcbiAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgfVxuXG4gICAgLnVwbG9hZC1zZWN0aW9uIHtcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgcGFkZGluZzogNDBweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMSk7XG4gICAgfVxuXG4gICAgaDEge1xuICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcbiAgICB9XG5cbiAgICAuZm9ybS1ncm91cCB7XG4gICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICAgIH1cblxuICAgIGxhYmVsIHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICB9XG5cbiAgICAuZm9ybS1jb250cm9sLFxuICAgIC5idG4ge1xuICAgICAgcGFkZGluZzogMTBweCAxNXB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICB9XG5cbiAgICAuZm9ybS1jb250cm9sIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB9XG5cbiAgICAuZmlsZS1pbnB1dC13cmFwcGVyIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBnYXA6IDEwcHg7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgIC5maWxlLWlucHV0IHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuXG4gICAgLmZpbGUtbmFtZSB7XG4gICAgICBmbGV4OiAxO1xuICAgICAgY29sb3I6ICM2NjY7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIH1cblxuICAgIC5jaGVja2JveC1yb3cge1xuICAgICAgbWFyZ2luLXRvcDogLTRweDtcbiAgICB9XG5cbiAgICAuY2hlY2tib3gtbGFiZWwge1xuICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgZ2FwOiA4cHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cblxuICAgIC5idG4ge1xuICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAuYnRuLXNlY29uZGFyeSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNmM3NTdkO1xuICAgICAgY29sb3I6IHdoaXRlO1xuICAgIH1cblxuICAgIC5idG4tc2Vjb25kYXJ5OmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM1YTYyNjg7XG4gICAgfVxuXG4gICAgLmJ0bi1wcmltYXJ5IHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDdiZmY7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgfVxuXG4gICAgLmJ0bi1wcmltYXJ5OmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDU2YjM7XG4gICAgfVxuXG4gICAgLmJ0bi1wcmltYXJ5OmRpc2FibGVkIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgIH1cblxuICAgIC5idG4tbGcge1xuICAgICAgcGFkZGluZzogMTJweCAyNHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgIC5idXR0b24tcm93IHtcbiAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgYXV0bztcbiAgICAgIGdhcDogMTBweDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICAgIH1cblxuICAgIC5hbGVydCB7XG4gICAgICBwYWRkaW5nOiAxNXB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICB9XG5cbiAgICAuYWxlcnQtZGFuZ2VyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOGQ3ZGE7XG4gICAgICBjb2xvcjogIzcyMWMyNDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNmNWM2Y2I7XG4gICAgfVxuXG4gICAgLmFsZXJ0LXN1Y2Nlc3Mge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2QxZTdkZDtcbiAgICAgIGNvbG9yOiAjMGY1MTMyO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2JhZGJjYztcbiAgICB9XG5cbiAgICAudXBsb2FkaW5nIHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICAgIH1cblxuICAgIC5wcm9ncmVzcyB7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBmb250LXdlaWdodDogNjAwO1xuICAgIH1cblxuICAgIC5zcGlubmVyIHtcbiAgICAgIGJvcmRlcjogNHB4IHNvbGlkICNmM2YzZjM7XG4gICAgICBib3JkZXItdG9wOiA0cHggc29saWQgIzAwN2JmZjtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgYW5pbWF0aW9uOiBzcGluIDFzIGxpbmVhciBpbmZpbml0ZTtcbiAgICAgIG1hcmdpbjogMCBhdXRvIDEwcHg7XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBzcGluIHtcbiAgICAgIDAlIHsgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7IH1cbiAgICAgIDEwMCUgeyB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyB9XG4gICAgfVxuXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XG4gICAgICAuYnV0dG9uLXJvdyB7XG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICAgICAgfVxuICAgIH1cbiAgYF1cbn0pXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRVcGxvYWRDb21wb25lbnQge1xuICByZWFkb25seSBsYWJlbHMgPSBVUExPQURfTEFCRUxTO1xuICByZWFkb25seSBkb2N1bWVudFR5cGVPcHRpb25zID0gRE9DVU1FTlRfVFlQRV9PUFRJT05TO1xuICByZWFkb25seSBkb2N1bWVudExhbmd1YWdlT3B0aW9ucyA9IERPQ1VNRU5UX0xBTkdVQUdFX09QVElPTlM7XG5cbiAgcmVhZG9ubHkgbWF4U2VsZWN0YWJsZUZpbGVzID0gMTtcbiAgcmVhZG9ubHkgbWF4RmlsZVNpemVCeXRlcyA9IDEwICogMTAyNCAqIDEwMjQ7XG4gIHJlYWRvbmx5IGFsbG93ZWRNaW1lVHlwZXMgPSBbJ2FwcGxpY2F0aW9uL3BkZicsICdpbWFnZS9wbmcnLCAnaW1hZ2UvanBlZycsICdpbWFnZS93ZWJwJ107XG4gIHJlYWRvbmx5IGFsbG93ZWRFeHRlbnNpb25zID0gWydwZGYnLCAncG5nJywgJ2pwZycsICdqcGVnJywgJ3dlYnAnXTtcblxuICBzZWxlY3RlZEZpbGVzOiBGaWxlW10gPSBbXTtcbiAgc2VsZWN0ZWRGaWxlRGlzcGxheSA9ICcnO1xuICBkb2N1bWVudFR5cGU6IFVwbG9hZERvY3VtZW50VHlwZSA9ICdyZWNlaXB0JztcbiAgZG9jdW1lbnRMYW5ndWFnZTogVXBsb2FkRG9jdW1lbnRMYW5ndWFnZSA9ICdhdXRvJztcbiAgcHJvY2Vzc0FmdGVyVXBsb2FkID0gZmFsc2U7XG4gIHVwbG9hZGluZyA9IGZhbHNlO1xuICBwcm9jZXNzaW5nID0gZmFsc2U7XG4gIHVwbG9hZFByb2dyZXNzID0gMDtcbiAgZXJyb3IgPSAnJztcbiAgc3VjY2Vzc01lc3NhZ2UgPSAnJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50U2VydmljZTogRG9jdW1lbnRTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXJcbiAgKSB7fVxuXG4gIG9uRmlsZVNlbGVjdGVkKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldFNlbGVjdGVkRmlsZXMoaW5wdXQpO1xuXG4gICAgdGhpcy5lcnJvciA9ICcnO1xuICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2UgPSAnJztcbiAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcbiAgICB0aGlzLnNlbGVjdGVkRmlsZURpc3BsYXkgPSAnJztcblxuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gZmlsZXNbMF07XG4gICAgaWYgKCF0aGlzLmlzU3VwcG9ydGVkRmlsZVR5cGUoZmlsZSkpIHtcbiAgICAgIHRoaXMuZXJyb3IgPSB0aGlzLmxhYmVscy5maWxlLmludmFsaWRUeXBlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChmaWxlLnNpemUgPiB0aGlzLm1heEZpbGVTaXplQnl0ZXMpIHtcbiAgICAgIHRoaXMuZXJyb3IgPSB0aGlzLmxhYmVscy5maWxlLnRvb0xhcmdlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0ZWRGaWxlcyA9IFtmaWxlXTtcbiAgICB0aGlzLnNlbGVjdGVkRmlsZURpc3BsYXkgPSBgJHtmaWxlLm5hbWV9ICgke3RoaXMuZm9ybWF0RmlsZVNpemUoZmlsZS5zaXplKX0pYDtcbiAgfVxuXG4gIHN1Ym1pdChlbnF1ZXVlUHJvY2Vzc2luZzogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHVwbG9hZEZpbGUgPSB0aGlzLnNlbGVjdGVkRmlsZXNbMF07XG4gICAgaWYgKCF1cGxvYWRGaWxlKSB7XG4gICAgICB0aGlzLmVycm9yID0gdGhpcy5sYWJlbHMudmFsaWRhdGlvbi5maWxlUmVxdWlyZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgIHRoaXMudXBsb2FkUHJvZ3Jlc3MgPSAwO1xuICAgIHRoaXMuZXJyb3IgPSAnJztcbiAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlID0gJyc7XG5cbiAgICB0aGlzLmRvY3VtZW50U2VydmljZS51cGxvYWREb2N1bWVudCh1cGxvYWRGaWxlLCB0aGlzLmRvY3VtZW50VHlwZSwgdGhpcy5kb2N1bWVudExhbmd1YWdlLCBlbnF1ZXVlUHJvY2Vzc2luZykuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQ6IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gSHR0cEV2ZW50VHlwZS5VcGxvYWRQcm9ncmVzcykge1xuICAgICAgICAgIGlmIChldmVudC50b3RhbCAmJiBldmVudC50b3RhbCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMudXBsb2FkUHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKChldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCkgKiAxMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQudHlwZSAhPT0gSHR0cEV2ZW50VHlwZS5SZXNwb25zZSB8fCAhZXZlbnQuYm9keSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBsb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgdXBsb2FkUmVzcG9uc2UgPSBldmVudC5ib2R5O1xuICAgICAgICBjb25zdCBzaG91bGRQcm9jZXNzID0gZW5xdWV1ZVByb2Nlc3NpbmcgfHwgdGhpcy5wcm9jZXNzQWZ0ZXJVcGxvYWQ7XG5cbiAgICAgICAgaWYgKCFzaG91bGRQcm9jZXNzKSB7XG4gICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZSA9IHRoaXMubGFiZWxzLnN0YXR1cy51cGxvYWRTdWNjZXNzO1xuICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0RvY3VtZW50KHVwbG9hZFJlc3BvbnNlLmRvY3VtZW50SWQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlID0gdGhpcy5sYWJlbHMuc3RhdHVzLnByb2Nlc3NTdWNjZXNzO1xuICAgICAgICB0aGlzLm5hdmlnYXRlVG9Eb2N1bWVudCh1cGxvYWRSZXNwb25zZS5kb2N1bWVudElkKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnByb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lcnJvciA9IHRoaXMuZ2V0QmFja2VuZEVycm9yTWVzc2FnZShlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBuYXZpZ2F0ZVRvRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9kb2N1bWVudHMnLCBkb2N1bWVudElkXSk7XG4gICAgfSwgNzAwKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2VsZWN0ZWRGaWxlcyhpbnB1dDogSFRNTElucHV0RWxlbWVudCk6IEZpbGVbXSB7XG4gICAgY29uc3QgZmlsZUxpc3QgPSBpbnB1dC5maWxlcztcbiAgICBpZiAoIWZpbGVMaXN0IHx8IGZpbGVMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShmaWxlTGlzdCk7XG4gICAgcmV0dXJuIGZpbGVzLnNsaWNlKDAsIHRoaXMubWF4U2VsZWN0YWJsZUZpbGVzKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNTdXBwb3J0ZWRGaWxlVHlwZShmaWxlOiBGaWxlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZXh0ZW5zaW9uID0gdGhpcy5nZXRGaWxlRXh0ZW5zaW9uKGZpbGUubmFtZSk7XG4gICAgY29uc3QgZXh0ZW5zaW9uQWxsb3dlZCA9IGV4dGVuc2lvbiA/IHRoaXMuYWxsb3dlZEV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0ZW5zaW9uKSA6IGZhbHNlO1xuXG4gICAgaWYgKGV4dGVuc2lvbkFsbG93ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmFsbG93ZWRNaW1lVHlwZXMuaW5jbHVkZXMoZmlsZS50eXBlKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RmlsZUV4dGVuc2lvbihmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBsYXN0RG90ID0gZmlsZU5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICBpZiAobGFzdERvdCA8IDAgfHwgbGFzdERvdCA9PT0gZmlsZU5hbWUubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBmaWxlTmFtZS5zbGljZShsYXN0RG90ICsgMSkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0RmlsZVNpemUoYnl0ZXM6IG51bWJlcik6IHN0cmluZyB7XG4gICAgaWYgKGJ5dGVzIDwgMTAyNCkge1xuICAgICAgcmV0dXJuIGAke2J5dGVzfSBCYDtcbiAgICB9XG5cbiAgICBpZiAoYnl0ZXMgPCAxMDI0ICogMTAyNCkge1xuICAgICAgcmV0dXJuIGAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7KGJ5dGVzIC8gKDEwMjQgKiAxMDI0KSkudG9GaXhlZCgyKX0gTUJgO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCYWNrZW5kRXJyb3JNZXNzYWdlKGVycm9yOiB1bmtub3duKTogc3RyaW5nIHtcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSkge1xuICAgICAgcmV0dXJuICdVbmV4cGVjdGVkIGVycm9yIHdoaWxlIHVwbG9hZGluZyB0aGUgZG9jdW1lbnQuJztcbiAgICB9XG5cbiAgICBjb25zdCBwYXlsb2FkID0gZXJyb3IuZXJyb3I7XG5cbiAgICBpZiAodHlwZW9mIHBheWxvYWQgPT09ICdzdHJpbmcnICYmIHBheWxvYWQudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH1cblxuICAgIGlmIChwYXlsb2FkICYmIHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgbWVzc2FnZVZhbHVlID0gKHBheWxvYWQgYXMgeyBtZXNzYWdlPzogdW5rbm93biB9KS5tZXNzYWdlO1xuICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlVmFsdWUgPT09ICdzdHJpbmcnICYmIG1lc3NhZ2VWYWx1ZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZVZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlcnJvcnNWYWx1ZSA9IChwYXlsb2FkIGFzIHsgZXJyb3JzPzogdW5rbm93biB9KS5lcnJvcnM7XG4gICAgICBpZiAoZXJyb3JzVmFsdWUgJiYgdHlwZW9mIGVycm9yc1ZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWQgPSBPYmplY3QudmFsdWVzKGVycm9yc1ZhbHVlIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVxuICAgICAgICAgIC5mbGF0TWFwKChlbnRyeSkgPT4gQXJyYXkuaXNBcnJheShlbnRyeSkgPyBlbnRyeSA6IFtlbnRyeV0pXG4gICAgICAgICAgLmZpbHRlcigoZW50cnkpOiBlbnRyeSBpcyBzdHJpbmcgPT4gdHlwZW9mIGVudHJ5ID09PSAnc3RyaW5nJyAmJiBlbnRyeS50cmltKCkubGVuZ3RoID4gMCk7XG5cbiAgICAgICAgaWYgKGZsYXR0ZW5lZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXR0ZW5lZC5qb2luKCcgJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGVycm9yLm1lc3NhZ2UgPT09ICdzdHJpbmcnICYmIGVycm9yLm1lc3NhZ2UudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiAnVXBsb2FkIGZhaWxlZC4gUGxlYXNlIHZlcmlmeSB0aGUgZG9jdW1lbnQgYW5kIHRyeSBhZ2Fpbi4nO1xuICB9XG59XG4iLCJpbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCB0eXBlIFVwbG9hZERvY3VtZW50VHlwZSA9ICdyZWNlaXB0JyB8ICdpbnZvaWNlJztcbmV4cG9ydCB0eXBlIFVwbG9hZERvY3VtZW50TGFuZ3VhZ2UgPSAnYXV0bycgfCAnZW4tQ0EnIHwgJ2ZyLUNBJyB8ICdiaWxpbmd1YWwtQ0EnO1xuZXhwb3J0IHR5cGUgRGV0ZWN0ZWRMYW5ndWFnZVZhbHVlID0gJ1Vua25vd24nIHwgJ0VuZ2xpc2hDYW5hZGEnIHwgJ0ZyZW5jaENhbmFkYScgfCAnQmlsaW5ndWFsQ2FuYWRhJztcblxuZXhwb3J0IGludGVyZmFjZSBEb2N1bWVudERldGFpbER0byB7XG4gIGlkOiBzdHJpbmc7XG4gIG9yaWdpbmFsRmlsZU5hbWU6IHN0cmluZztcbiAgc3RvcmVkRmlsZU5hbWU6IHN0cmluZztcbiAgY29udGVudFR5cGU6IHN0cmluZztcbiAgZmlsZVNpemVCeXRlczogbnVtYmVyO1xuICBkb2N1bWVudFR5cGU6IHN0cmluZztcbiAgZG9jdW1lbnRMYW5ndWFnZTogc3RyaW5nO1xuICBzdGF0dXM6IHN0cmluZztcbiAgdXBsb2FkZWRBdFV0Yzogc3RyaW5nO1xuICBwcm9jZXNzZWRBdFV0Yz86IHN0cmluZyB8IG51bGw7XG59XG5cbmV4cG9ydCB0eXBlIERvY3VtZW50RHRvID0gRG9jdW1lbnREZXRhaWxEdG87XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdGlvbldhcm5pbmdEdG8ge1xuICBjb2RlOiBzdHJpbmc7XG4gIG1lc3NhZ2VFbjogc3RyaW5nO1xuICBtZXNzYWdlRnI6IHN0cmluZztcbiAgc2V2ZXJpdHk6IHN0cmluZztcbiAgZmllbGROYW1lPzogc3RyaW5nIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0aW9uUmVzdWx0U3VtbWFyeUR0byB7XG4gIGlzVmFsaWRhdGVkOiBib29sZWFuO1xuICBzdW1tYXJ5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXh0cmFjdGlvbkpvYlJlc3VsdER0byB7XG4gIGlkOiBzdHJpbmc7XG4gIHN0YXJ0ZWRBdFV0Yzogc3RyaW5nO1xuICBjb21wbGV0ZWRBdFV0Yz86IHN0cmluZyB8IG51bGw7XG4gIHN0YXR1czogc3RyaW5nO1xuICBlcnJvck1lc3NhZ2U/OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV4dHJhY3RlZEZpZWxkc0R0byB7XG4gIHZlbmRvck5hbWU6IHN0cmluZztcbiAgY3VzdG9tZXJOYW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgZG9jdW1lbnROdW1iZXI/OiBzdHJpbmcgfCBudWxsO1xuICBkb2N1bWVudERhdGU/OiBzdHJpbmcgfCBudWxsO1xuICBkdWVEYXRlPzogc3RyaW5nIHwgbnVsbDtcbiAgY3VycmVuY3k6IHN0cmluZztcbiAgc3VidG90YWw/OiBudW1iZXIgfCBudWxsO1xuICBnc3Q/OiBudW1iZXIgfCBudWxsO1xuICBxc3Q/OiBudW1iZXIgfCBudWxsO1xuICBoc3Q/OiBudW1iZXIgfCBudWxsO1xuICBwc3Q/OiBudW1iZXIgfCBudWxsO1xuICB0aXA/OiBudW1iZXIgfCBudWxsO1xuICB0b3RhbD86IG51bWJlciB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlRXh0cmFjdGVkRmllbGRzUmVxdWVzdER0byB7XG4gIHZlbmRvck5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBjdXN0b21lck5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBkb2N1bWVudE51bWJlcj86IHN0cmluZyB8IG51bGw7XG4gIGRvY3VtZW50RGF0ZT86IHN0cmluZyB8IG51bGw7XG4gIGR1ZURhdGU/OiBzdHJpbmcgfCBudWxsO1xuICBjdXJyZW5jeT86IHN0cmluZyB8IG51bGw7XG4gIHN1YnRvdGFsPzogbnVtYmVyIHwgbnVsbDtcbiAgZ3N0PzogbnVtYmVyIHwgbnVsbDtcbiAgcXN0PzogbnVtYmVyIHwgbnVsbDtcbiAgaHN0PzogbnVtYmVyIHwgbnVsbDtcbiAgcHN0PzogbnVtYmVyIHwgbnVsbDtcbiAgdGlwPzogbnVtYmVyIHwgbnVsbDtcbiAgdG90YWw/OiBudW1iZXIgfCBudWxsO1xuICBkZXRlY3RlZExhbmd1YWdlPzogRGV0ZWN0ZWRMYW5ndWFnZVZhbHVlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERvY3VtZW50UmVzdWx0RHRvIHtcbiAgZG9jdW1lbnQ6IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIG9yaWdpbmFsRmlsZU5hbWU6IHN0cmluZztcbiAgICBzdG9yZWRGaWxlTmFtZTogc3RyaW5nO1xuICAgIGNvbnRlbnRUeXBlOiBzdHJpbmc7XG4gICAgZG9jdW1lbnRUeXBlOiBzdHJpbmc7XG4gICAgc3RhdHVzOiBzdHJpbmc7XG4gICAgdXBsb2FkZWRBdFV0Yzogc3RyaW5nO1xuICAgIHByb2Nlc3NlZEF0VXRjPzogc3RyaW5nIHwgbnVsbDtcbiAgfTtcbiAgcmVxdWVzdGVkRG9jdW1lbnRMYW5ndWFnZTogc3RyaW5nO1xuICBkZXRlY3RlZERvY3VtZW50TGFuZ3VhZ2U6IHN0cmluZztcbiAgbGF0ZXN0RXh0cmFjdGlvbkpvYj86IEV4dHJhY3Rpb25Kb2JSZXN1bHREdG8gfCBudWxsO1xuICByYXdUZXh0OiBzdHJpbmc7XG4gIHN0cnVjdHVyZWRFeHRyYWN0ZWRGaWVsZHM/OiBFeHRyYWN0ZWRGaWVsZHNEdG8gfCBudWxsO1xuICBsaW5lSXRlbXM6IEFycmF5PFJlY29yZDxzdHJpbmcsIHVua25vd24+PjtcbiAgdmFsaWRhdGlvblJlc3VsdD86IFZhbGlkYXRpb25SZXN1bHRTdW1tYXJ5RHRvIHwgbnVsbDtcbiAgYmlsaW5ndWFsV2FybmluZ3M6IFZhbGlkYXRpb25XYXJuaW5nRHRvW107XG4gIGNvbmZpZGVuY2U/OiBudW1iZXIgfCBudWxsO1xuICBwcmltYXJ5T2NyRW5naW5lVXNlZDogc3RyaW5nO1xuICBmYWxsYmFja09jckVuZ2luZVVzZWQ/OiBzdHJpbmcgfCBudWxsO1xuICBmYWxsYmFja1VzZWQ6IGJvb2xlYW47XG4gIHByb3ZpZGVyTmFtZT86IHN0cmluZyB8IG51bGw7XG4gIG1vZGVsTmFtZT86IHN0cmluZyB8IG51bGw7XG4gIHByaW1hcnlMYXRlbmN5TXM6IG51bWJlcjtcbiAgZmFsbGJhY2tMYXRlbmN5TXM/OiBudW1iZXIgfCBudWxsO1xuICBwcm92aWRlckxhdGVuY3lNcz86IG51bWJlciB8IG51bGw7XG4gIHRvdGFsUHJvY2Vzc2luZ0xhdGVuY3lNczogbnVtYmVyO1xuICBlc3RpbWF0ZWRQcm92aWRlckNvc3Q/OiBudW1iZXIgfCBudWxsO1xuICBwYWdlQ291bnQ/OiBudW1iZXIgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERvY3VtZW50UmF3VGV4dER0byB7XG4gIHJhd1RleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGxvYWREb2N1bWVudFJlc3BvbnNlRHRvIHtcbiAgZG9jdW1lbnRJZDogc3RyaW5nO1xuICBvcmlnaW5hbEZpbGVOYW1lOiBzdHJpbmc7XG4gIGRvY3VtZW50VHlwZTogc3RyaW5nO1xuICBkb2N1bWVudExhbmd1YWdlOiBzdHJpbmc7XG4gIHN0YXR1czogc3RyaW5nO1xuICB1cGxvYWRlZEF0VXRjOiBzdHJpbmc7XG59XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRTZXJ2aWNlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBhcGlVcmwgPSAnL2FwaS9kb2N1bWVudHMnO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaHR0cDogSHR0cENsaWVudCkge31cblxuICBnZXRBbGxEb2N1bWVudHMoKTogT2JzZXJ2YWJsZTxEb2N1bWVudER0b1tdPiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8RG9jdW1lbnREdG9bXT4odGhpcy5hcGlVcmwpO1xuICB9XG5cbiAgZ2V0RG9jdW1lbnQoaWQ6IHN0cmluZyk6IE9ic2VydmFibGU8RG9jdW1lbnREZXRhaWxEdG8+IHtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxEb2N1bWVudERldGFpbER0bz4oYCR7dGhpcy5hcGlVcmx9LyR7aWR9YCk7XG4gIH1cblxuICBnZXREb2N1bWVudFJlc3VsdChpZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxEb2N1bWVudFJlc3VsdER0bz4ge1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PERvY3VtZW50UmVzdWx0RHRvPihgJHt0aGlzLmFwaVVybH0vJHtpZH0vcmVzdWx0YCk7XG4gIH1cblxuICBnZXRSYXdUZXh0KGlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPERvY3VtZW50UmF3VGV4dER0bz4ge1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PERvY3VtZW50UmF3VGV4dER0bz4oYCR7dGhpcy5hcGlVcmx9LyR7aWR9L3Jhdy10ZXh0YCk7XG4gIH1cblxuICBnZXREb2N1bWVudEZpbGVVcmwoaWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuYXBpVXJsfS8ke2lkfS9maWxlYDtcbiAgfVxuXG4gIHVwZGF0ZUV4dHJhY3RlZEZpZWxkcyhpZDogc3RyaW5nLCByZXF1ZXN0OiBVcGRhdGVFeHRyYWN0ZWRGaWVsZHNSZXF1ZXN0RHRvKTogT2JzZXJ2YWJsZTxEb2N1bWVudFJlc3VsdER0bz4ge1xuICAgIHJldHVybiB0aGlzLmh0dHAucHV0PERvY3VtZW50UmVzdWx0RHRvPihgJHt0aGlzLmFwaVVybH0vJHtpZH0vZXh0cmFjdGVkLWZpZWxkc2AsIHJlcXVlc3QpO1xuICB9XG5cbiAgdXBsb2FkRG9jdW1lbnQoZmlsZTogRmlsZSwgZG9jdW1lbnRUeXBlOiBVcGxvYWREb2N1bWVudFR5cGUsIGRvY3VtZW50TGFuZ3VhZ2U6IFVwbG9hZERvY3VtZW50TGFuZ3VhZ2UsIGVucXVldWVQcm9jZXNzaW5nID0gZmFsc2UpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxVcGxvYWREb2N1bWVudFJlc3BvbnNlRHRvPj4ge1xuICAgIGNvbnN0IGZvcm1EYXRhID0gdGhpcy5jcmVhdGVVcGxvYWRGb3JtRGF0YShbZmlsZV0sIGRvY3VtZW50VHlwZSwgZG9jdW1lbnRMYW5ndWFnZSwgZW5xdWV1ZVByb2Nlc3NpbmcpO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PFVwbG9hZERvY3VtZW50UmVzcG9uc2VEdG8+KGAke3RoaXMuYXBpVXJsfS91cGxvYWRgLCBmb3JtRGF0YSwge1xuICAgICAgb2JzZXJ2ZTogJ2V2ZW50cycsXG4gICAgICByZXBvcnRQcm9ncmVzczogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVVcGxvYWRGb3JtRGF0YShmaWxlczogcmVhZG9ubHkgRmlsZVtdLCBkb2N1bWVudFR5cGU6IFVwbG9hZERvY3VtZW50VHlwZSwgZG9jdW1lbnRMYW5ndWFnZTogVXBsb2FkRG9jdW1lbnRMYW5ndWFnZSwgZW5xdWV1ZVByb2Nlc3Npbmc6IGJvb2xlYW4pOiBGb3JtRGF0YSB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBjb25zdCBmaWxlID0gZmlsZXNbMF07XG5cbiAgICBpZiAoZmlsZSkge1xuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG4gICAgfVxuXG4gICAgZm9ybURhdGEuYXBwZW5kKCdkb2N1bWVudFR5cGUnLCBkb2N1bWVudFR5cGUpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnZG9jdW1lbnRMYW5ndWFnZScsIGRvY3VtZW50TGFuZ3VhZ2UpO1xuICAgIGlmIChlbnF1ZXVlUHJvY2Vzc2luZykge1xuICAgICAgZm9ybURhdGEuYXBwZW5kKCdlbnF1ZXVlUHJvY2Vzc2luZycsICd0cnVlJyk7XG4gICAgfVxuICAgIHJldHVybiBmb3JtRGF0YTtcbiAgfVxuXG4gIHByb2Nlc3NEb2N1bWVudChpZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxEb2N1bWVudERldGFpbER0bz4ge1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxEb2N1bWVudERldGFpbER0bz4oYCR7dGhpcy5hcGlVcmx9LyR7aWR9L3Byb2Nlc3NgLCB7fSwgeyBvYnNlcnZlOiAnYm9keScgfSk7XG4gIH1cblxuICBnZXRKc29uRXhwb3J0VXJsKGlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLmFwaVVybH0vJHtpZH0vZXhwb3J0L2pzb25gO1xuICB9XG5cbiAgZ2V0Q3N2RXhwb3J0VXJsKGlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLmFwaVVybH0vJHtpZH0vZXhwb3J0L2NzdmA7XG4gIH1cblxuICBkZWxldGVEb2N1bWVudChpZDogc3RyaW5nKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGU8dm9pZD4oYCR7dGhpcy5hcGlVcmx9LyR7aWR9YCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIGNhdGNoRXJyb3IsIG9mLCBzd2l0Y2hNYXAsIHRpbWVyLCB0aW1lb3V0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBEb2N1bWVudERldGFpbER0bywgRG9jdW1lbnRSZXN1bHREdG8sIERvY3VtZW50U2VydmljZSwgVmFsaWRhdGlvbldhcm5pbmdEdG8gfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kb2N1bWVudC5zZXJ2aWNlJztcblxudHlwZSBVaUxhbmd1YWdlID0gJ2VuJyB8ICdmcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1kb2N1bWVudC1kZXRhaWwnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGVdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJsb2FkaW5nXCI+TG9hZGluZyBkb2N1bWVudCBkZXRhaWxzLi4uPC9kaXY+XG5cbiAgICAgIDxkaXYgKm5nSWY9XCIhbG9hZGluZyAmJiBsb2FkRXJyb3JcIiBjbGFzcz1cIm5vdC1mb3VuZFwiPlxuICAgICAgICA8cD57eyBsb2FkRXJyb3IgfX08L3A+XG4gICAgICAgIDxhIHJvdXRlckxpbms9XCIvZG9jdW1lbnRzXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiPkJhY2sgdG8gbGlzdDwvYT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2ICpuZ0lmPVwiIWxvYWRpbmcgJiYgZG9jdW1lbnRcIiBjbGFzcz1cImRldGFpbC1zZWN0aW9uXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkZXRhaWwtbGF5b3V0XCI+XG4gICAgICAgICAgPGFzaWRlIGNsYXNzPVwicHJldmlldy1wYW5lbFwiPlxuICAgICAgICAgICAgPGgzPkRvY3VtZW50IHByZXZpZXc8L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXctZnJhbWVcIiAqbmdJZj1cImlzUGRmUHJldmlld1wiPlxuICAgICAgICAgICAgICA8aWZyYW1lIFtzcmNdPVwic2FmZVByZXZpZXdVcmxcIiB0aXRsZT1cIkRvY3VtZW50IHByZXZpZXdcIiAoZXJyb3IpPVwib25QcmV2aWV3RXJyb3IoKVwiPjwvaWZyYW1lPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJldmlldy1mcmFtZVwiICpuZ0lmPVwiaXNJbWFnZVByZXZpZXdcIj5cbiAgICAgICAgICAgICAgPGltZyBbc3JjXT1cInByZXZpZXdVcmxcIiBbYWx0XT1cImRvY3VtZW50Lm9yaWdpbmFsRmlsZU5hbWVcIiAoZXJyb3IpPVwib25QcmV2aWV3RXJyb3IoKVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmV2aWV3LWZhbGxiYWNrXCIgKm5nSWY9XCJwcmV2aWV3RmFpbGVkIHx8ICghaXNQZGZQcmV2aWV3ICYmICFpc0ltYWdlUHJldmlldylcIj5cbiAgICAgICAgICAgICAgPHA+UHJldmlldyBpcyBub3QgYXZhaWxhYmxlIGZvciB0aGlzIGZpbGUgdHlwZS48L3A+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmV2aWV3LWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICA8YSBbaHJlZl09XCJwcmV2aWV3VXJsXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lclwiPk9wZW4gZmlsZTwvYT5cbiAgICAgICAgICAgICAgICA8YSBbaHJlZl09XCJwcmV2aWV3VXJsXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIiBkb3dubG9hZD5Eb3dubG9hZCBmaWxlPC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvYXNpZGU+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibWFpbi1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxoMT57eyBkb2N1bWVudC5vcmlnaW5hbEZpbGVOYW1lIH19PC9oMT5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwic3VidGl0bGVcIj5Eb2N1bWVudCBJRDoge3sgZG9jdW1lbnQuaWQgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGEgcm91dGVyTGluaz1cIi9kb2N1bWVudHNcIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCI+QmFjayB0byBsaXN0PC9hPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2ICpuZ0lmPVwicG9sbGluZ1wiIGNsYXNzPVwic3RhdHVzLWNhbGxvdXQgc3RhdHVzLXByb2Nlc3NpbmdcIj5cbiAgICAgICAgICA8c3Ryb25nPlByb2Nlc3Npbmc8L3N0cm9uZz5cbiAgICAgICAgICA8cD57eyBwcm9jZXNzaW5nUHJvZ3Jlc3NNZXNzYWdlIH19PC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2ICpuZ0lmPVwiaXNOZWVkc1Jldmlld1wiIGNsYXNzPVwic3RhdHVzLWNhbGxvdXQgc3RhdHVzLW5lZWRzLXJldmlld1wiPlxuICAgICAgICAgIFRoaXMgZG9jdW1lbnQgcmVxdWlyZXMgbWFudWFsIHJldmlldyBiZWZvcmUgZmluYWwgYXBwcm92YWwuXG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgKm5nSWY9XCJpc0ZhaWxlZFwiIGNsYXNzPVwic3RhdHVzLWNhbGxvdXQgc3RhdHVzLWZhaWxlZFwiPlxuICAgICAgICAgIDxzdHJvbmc+UHJvY2Vzc2luZyBmYWlsZWQ6PC9zdHJvbmc+IHt7IGZhaWx1cmVSZWFzb24gfX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJhZGdlLXJvd1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2VcIiBbbmdDbGFzc109XCJnZXRTdGF0dXNCYWRnZUNsYXNzKGRvY3VtZW50LnN0YXR1cylcIj57eyBkb2N1bWVudC5zdGF0dXMgfX08L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1lbmdpbmVcIiAqbmdGb3I9XCJsZXQgYmFkZ2Ugb2YgZW5naW5lQmFkZ2VzXCI+e3sgYmFkZ2UgfX08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLWdyaWRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+RmlsZSBuYW1lPC9sYWJlbD5cbiAgICAgICAgICAgIDxwPnt7IGRvY3VtZW50Lm9yaWdpbmFsRmlsZU5hbWUgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImluZm8taXRlbVwiPlxuICAgICAgICAgICAgPGxhYmVsPkRvY3VtZW50IHR5cGU8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgZG9jdW1lbnQuZG9jdW1lbnRUeXBlIH19PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLWl0ZW1cIj5cbiAgICAgICAgICAgIDxsYWJlbD5SZXF1ZXN0ZWQgZG9jdW1lbnQgbGFuZ3VhZ2U8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgZ2V0UmVxdWVzdGVkTGFuZ3VhZ2VMYWJlbChkb2N1bWVudC5kb2N1bWVudExhbmd1YWdlKSB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+RGV0ZWN0ZWQgZG9jdW1lbnQgbGFuZ3VhZ2U8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgZ2V0RGV0ZWN0ZWRMYW5ndWFnZUxhYmVsKCkgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImluZm8taXRlbVwiPlxuICAgICAgICAgICAgPGxhYmVsPlN0YXR1czwvbGFiZWw+XG4gICAgICAgICAgICA8cD57eyBkb2N1bWVudC5zdGF0dXMgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImluZm8taXRlbVwiPlxuICAgICAgICAgICAgPGxhYmVsPlVwbG9hZGVkIGRhdGU8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgZm9ybWF0RGF0ZShkb2N1bWVudC51cGxvYWRlZEF0VXRjKSB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+UHJvY2Vzc2VkIGRhdGU8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgZm9ybWF0RGF0ZShkb2N1bWVudC5wcm9jZXNzZWRBdFV0YykgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImluZm8taXRlbVwiPlxuICAgICAgICAgICAgPGxhYmVsPkVuZ2luZSB1c2VkPC9sYWJlbD5cbiAgICAgICAgICAgIDxwPnt7IGdldEVuZ2luZVVzZWRMYWJlbCgpIH19PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLWl0ZW1cIj5cbiAgICAgICAgICAgIDxsYWJlbD5QcmltYXJ5IE9DUiBlbmdpbmUgdXNlZDwvbGFiZWw+XG4gICAgICAgICAgICA8cD57eyByZXN1bHQ/LnByaW1hcnlPY3JFbmdpbmVVc2VkIHx8ICctJyB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+RmFsbGJhY2sgT0NSIGVuZ2luZSB1c2VkPC9sYWJlbD5cbiAgICAgICAgICAgIDxwPnt7IHJlc3VsdD8uZmFsbGJhY2tPY3JFbmdpbmVVc2VkIHx8ICctJyB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+RmFsbGJhY2sgdXNlZDwvbGFiZWw+XG4gICAgICAgICAgICA8cD57eyByZXN1bHQ/LmZhbGxiYWNrVXNlZCA/ICdZZXMnIDogJ05vJyB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+UHJvdmlkZXIgbmFtZTwvbGFiZWw+XG4gICAgICAgICAgICA8cD57eyByZXN1bHQ/LnByb3ZpZGVyTmFtZSB8fCAnLScgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImluZm8taXRlbVwiPlxuICAgICAgICAgICAgPGxhYmVsPk1vZGVsIG5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgcmVzdWx0Py5tb2RlbE5hbWUgfHwgJy0nIH19PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLWl0ZW1cIj5cbiAgICAgICAgICAgIDxsYWJlbD5Qcm92aWRlciBsYXRlbmN5IG1zPC9sYWJlbD5cbiAgICAgICAgICAgIDxwPnt7IHJlc3VsdD8ucHJvdmlkZXJMYXRlbmN5TXMgPz8gJy0nIH19PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmZvLWl0ZW1cIj5cbiAgICAgICAgICAgIDxsYWJlbD5QcmltYXJ5IGxhdGVuY3kgbXM8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgcmVzdWx0Py5wcmltYXJ5TGF0ZW5jeU1zID8/ICctJyB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+RmFsbGJhY2sgbGF0ZW5jeSBtczwvbGFiZWw+XG4gICAgICAgICAgICA8cD57eyByZXN1bHQ/LmZhbGxiYWNrTGF0ZW5jeU1zID8/ICctJyB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+UHJvY2Vzc2luZyB0aW1lPC9sYWJlbD5cbiAgICAgICAgICAgIDxwPnt7IGZvcm1hdFByb2Nlc3NpbmdUaW1lKHJlc3VsdD8udG90YWxQcm9jZXNzaW5nTGF0ZW5jeU1zKSB9fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1pdGVtXCI+XG4gICAgICAgICAgICA8bGFiZWw+RXN0aW1hdGVkIHByb3ZpZGVyIGNvc3Q8L2xhYmVsPlxuICAgICAgICAgICAgPHA+e3sgZm9ybWF0RXN0aW1hdGVkQ29zdChyZXN1bHQ/LmVzdGltYXRlZFByb3ZpZGVyQ29zdCkgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImluZm8taXRlbVwiPlxuICAgICAgICAgICAgPGxhYmVsPk92ZXJhbGwgY29uZmlkZW5jZTwvbGFiZWw+XG4gICAgICAgICAgICA8cD57eyBmb3JtYXRDb25maWRlbmNlKHJlc3VsdD8uY29uZmlkZW5jZSkgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAqbmdJZj1cImlzVXBsb2FkZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImFjdGlvbkxvYWRpbmdcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInByb2Nlc3NEb2N1bWVudCgpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7eyBhY3Rpb25Mb2FkaW5nID8gJ1Byb2Nlc3NpbmcuLi4nIDogJ1Byb2Nlc3MnIH19XG4gICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICpuZ0lmPVwiaXNGYWlsZWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImFjdGlvbkxvYWRpbmdcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInByb2Nlc3NEb2N1bWVudCgpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7eyBhY3Rpb25Mb2FkaW5nID8gJ1JlcHJvY2Vzc2luZy4uLicgOiAnUmVwcm9jZXNzJyB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgPGEgW3JvdXRlckxpbmtdPVwiWycvZG9jdW1lbnRzJywgZG9jdW1lbnQuaWQsICdyZXZpZXcnXVwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lXCI+UmV2aWV3L0VkaXQgZXh0cmFjdGVkIGZpZWxkczwvYT5cbiAgICAgICAgICA8YSBbaHJlZl09XCJqc29uRXhwb3J0VXJsXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIiBkb3dubG9hZD5Eb3dubG9hZCBKU09OPC9hPlxuICAgICAgICAgIDxhIFtocmVmXT1cImNzdkV4cG9ydFVybFwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lXCIgZG93bmxvYWQ+RG93bmxvYWQgQ1NWPC9hPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lXCIgW2Rpc2FibGVkXT1cInJhd1RleHRMb2FkaW5nXCIgKGNsaWNrKT1cInRvZ2dsZVJhd1RleHQoKVwiPlxuICAgICAgICAgICAge3sgcmF3VGV4dFZpc2libGUgPyAnSGlkZSByYXcgT0NSIHRleHQnIDogJ1ZpZXcgcmF3IE9DUiB0ZXh0JyB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2ICpuZ0lmPVwiYWN0aW9uRXJyb3JcIiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiPnt7IGFjdGlvbkVycm9yIH19PC9kaXY+XG5cbiAgICAgICAgPGRpdiAqbmdJZj1cInJhd1RleHRWaXNpYmxlXCIgY2xhc3M9XCJyYXctdGV4dFwiPlxuICAgICAgICAgIDxoMz5SYXcgT0NSIHRleHQ8L2gzPlxuICAgICAgICAgIDxwICpuZ0lmPVwicmF3VGV4dExvYWRpbmdcIj5Mb2FkaW5nIHJhdyBPQ1IgdGV4dC4uLjwvcD5cbiAgICAgICAgICA8cHJlICpuZ0lmPVwiIXJhd1RleHRMb2FkaW5nXCI+e3sgcmF3VGV4dCB8fCAnTm8gcmF3IE9DUiB0ZXh0IGF2YWlsYWJsZS4nIH19PC9wcmU+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgKm5nSWY9XCJyZXN1bHQ/LnZhbGlkYXRpb25SZXN1bHRcIiBjbGFzcz1cInZhbGlkYXRpb24tc3VtbWFyeVwiPlxuICAgICAgICAgIDxoMz5WYWxpZGF0aW9uIHN1bW1hcnk8L2gzPlxuICAgICAgICAgIDxwPnt7IHJlc3VsdC52YWxpZGF0aW9uUmVzdWx0LnN1bW1hcnkgfX08L3A+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgKm5nSWY9XCIocmVzdWx0Py5iaWxpbmd1YWxXYXJuaW5ncz8ubGVuZ3RoID8/IDApID4gMFwiIGNsYXNzPVwid2FybmluZ3NcIj5cbiAgICAgICAgICA8aDM+VmFsaWRhdGlvbiB3YXJuaW5nczwvaDM+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIndhcm5pbmctaXRlbVwiICpuZ0Zvcj1cImxldCB3YXJuaW5nIG9mIChyZXN1bHQ/LmJpbGluZ3VhbFdhcm5pbmdzID8/IFtdKVwiIFtuZ0NsYXNzXT1cImdldFdhcm5pbmdTZXZlcml0eUNsYXNzKHdhcm5pbmcpXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2FybmluZy1tZXRhXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwid2FybmluZy1jb2RlXCI+e3sgd2FybmluZy5jb2RlIH19PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIndhcm5pbmctc2V2ZXJpdHlcIj57eyB3YXJuaW5nLnNldmVyaXR5IH19PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cD57eyBnZXRXYXJuaW5nTWVzc2FnZSh3YXJuaW5nKSB9fTwvcD5cbiAgICAgICAgICAgIDxwICpuZ0lmPVwid2FybmluZy5maWVsZE5hbWVcIiBjbGFzcz1cIndhcm5pbmctZmllbGRcIj5GaWVsZDoge3sgd2FybmluZy5maWVsZE5hbWUgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG4gICAgLmNvbnRhaW5lciB7XG4gICAgICBtYXgtd2lkdGg6IDEwODBweDtcbiAgICAgIG1hcmdpbjogMCBhdXRvO1xuICAgICAgcGFkZGluZzogMjRweDtcbiAgICB9XG5cbiAgICAubG9hZGluZyxcbiAgICAubm90LWZvdW5kIHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIHBhZGRpbmc6IDQwcHg7XG4gICAgICBjb2xvcjogIzY2NzA4NTtcbiAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2VhZWNmMDtcbiAgICB9XG5cbiAgICAuZGV0YWlsLXNlY3Rpb24ge1xuICAgICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgcGFkZGluZzogMjhweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAzMHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjZWFlY2YwO1xuICAgIH1cblxuICAgIC5kZXRhaWwtbGF5b3V0IHtcbiAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IG1pbm1heCgyODBweCwgMzQlKSBtaW5tYXgoMCwgMWZyKTtcbiAgICAgIGdhcDogMThweDtcbiAgICAgIGFsaWduLWl0ZW1zOiBzdGFydDtcbiAgICB9XG5cbiAgICAucHJldmlldy1wYW5lbCB7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjZWFlY2YwO1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICBwb3NpdGlvbjogc3RpY2t5O1xuICAgICAgdG9wOiAxNnB4O1xuICAgIH1cblxuICAgIC5wcmV2aWV3LWZyYW1lIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNGU3ZWM7XG4gICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgYmFja2dyb3VuZDogI2Y4ZmFmYztcbiAgICAgIG1pbi1oZWlnaHQ6IDQyMHB4O1xuICAgIH1cblxuICAgIC5wcmV2aWV3LWZyYW1lIGlmcmFtZSxcbiAgICAucHJldmlldy1mcmFtZSBpbWcge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBtaW4taGVpZ2h0OiA0MjBweDtcbiAgICAgIGJvcmRlcjogMDtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgb2JqZWN0LWZpdDogY29udGFpbjtcbiAgICB9XG5cbiAgICAucHJldmlldy1mYWxsYmFjayB7XG4gICAgICBib3JkZXI6IDFweCBkYXNoZWQgI2QwZDVkZDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICBiYWNrZ3JvdW5kOiAjZjlmYWZiO1xuICAgIH1cblxuICAgIC5wcmV2aWV3LWFjdGlvbnMge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIC5oZWFkZXIge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgIGFsaWduLWl0ZW1zOiBzdGFydDtcbiAgICAgIGdhcDogMTJweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gICAgfVxuXG4gICAgaDEge1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgZm9udC1zaXplOiAyOHB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgICB9XG5cbiAgICAuc3VidGl0bGUge1xuICAgICAgbWFyZ2luOiA2cHggMCAwO1xuICAgICAgY29sb3I6ICM2NjcwODU7XG4gICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgfVxuXG4gICAgLnN0YXR1cy1jYWxsb3V0IHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHBhZGRpbmc6IDEycHggMTRweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDE0cHg7XG4gICAgICBmb250LXdlaWdodDogNTAwO1xuICAgIH1cblxuICAgIC5zdGF0dXMtcHJvY2Vzc2luZyB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZWZmOGZmO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2IyZGRmZjtcbiAgICAgIGNvbG9yOiAjMTc1Y2QzO1xuICAgIH1cblxuICAgIC5zdGF0dXMtcHJvY2Vzc2luZzo6YmVmb3JlIHtcbiAgICAgIGNvbnRlbnQ6ICcnO1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgd2lkdGg6IDE0cHg7XG4gICAgICBoZWlnaHQ6IDE0cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDhweDtcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkICNkMWU5ZmY7XG4gICAgICBib3JkZXItdG9wOiAycHggc29saWQgIzE3NWNkMztcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xuICAgIH1cblxuICAgIC5zdGF0dXMtcHJvY2Vzc2luZyBwIHtcbiAgICAgIG1hcmdpbjogMnB4IDAgMDtcbiAgICB9XG5cbiAgICBAa2V5ZnJhbWVzIHNwaW4ge1xuICAgICAgMCUgeyB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTsgfVxuICAgICAgMTAwJSB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cbiAgICB9XG5cbiAgICAuc3RhdHVzLW5lZWRzLXJldmlldyB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZmZmN2VkO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2ZlZDdhYTtcbiAgICAgIGNvbG9yOiAjOWEzNDEyO1xuICAgIH1cblxuICAgIC5zdGF0dXMtZmFpbGVkIHtcbiAgICAgIGJhY2tncm91bmQ6ICNmZWYyZjI7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjZmVjYWNhO1xuICAgICAgY29sb3I6ICM5OTFiMWI7XG4gICAgfVxuXG4gICAgLmJhZGdlLXJvdyB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgICAgZ2FwOiA4cHg7XG4gICAgICBtYXJnaW46IDhweCAwIDE4cHg7XG4gICAgfVxuXG4gICAgLmJhZGdlIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xuICAgICAgcGFkZGluZzogNHB4IDEwcHg7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICBmb250LXdlaWdodDogNzAwO1xuICAgIH1cblxuICAgIC5iYWRnZS11cGxvYWRlZCB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZWZmOGZmO1xuICAgICAgY29sb3I6ICMxNzVjZDM7XG4gICAgfVxuXG4gICAgLmJhZGdlLXByb2Nlc3Npbmcge1xuICAgICAgYmFja2dyb3VuZDogI2VjZmRmMztcbiAgICAgIGNvbG9yOiAjMDI3YTQ4O1xuICAgIH1cblxuICAgIC5iYWRnZS1jb21wbGV0ZWQge1xuICAgICAgYmFja2dyb3VuZDogI2VjZmRmMztcbiAgICAgIGNvbG9yOiAjMDI3YTQ4O1xuICAgIH1cblxuICAgIC5iYWRnZS1mYWlsZWQge1xuICAgICAgYmFja2dyb3VuZDogI2ZlZjNmMjtcbiAgICAgIGNvbG9yOiAjYjQyMzE4O1xuICAgIH1cblxuICAgIC5iYWRnZS1uZWVkcy1yZXZpZXcge1xuICAgICAgYmFja2dyb3VuZDogI2ZmZjdlZDtcbiAgICAgIGNvbG9yOiAjYjU0NzA4O1xuICAgIH1cblxuICAgIC5iYWRnZS11bmtub3duIHtcbiAgICAgIGJhY2tncm91bmQ6ICNmMmY0Zjc7XG4gICAgICBjb2xvcjogIzQ3NTQ2NztcbiAgICB9XG5cbiAgICAuYmFkZ2UtZW5naW5lIHtcbiAgICAgIGJhY2tncm91bmQ6ICNmNWYzZmY7XG4gICAgICBjb2xvcjogIzY5NDFjNjtcbiAgICB9XG5cbiAgICAuaW5mby1ncmlkIHtcbiAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIyMHB4LCAxZnIpKTtcbiAgICAgIGdhcDogMTJweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgfVxuXG4gICAgLmluZm8taXRlbSB7XG4gICAgICBwYWRkaW5nOiAxNHB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZmFmYztcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMmU4ZjA7XG4gICAgfVxuXG4gICAgLmluZm8taXRlbSBsYWJlbCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICBtYXJnaW4tYm90dG9tOiA2cHg7XG4gICAgICBjb2xvcjogIzQ3NTQ2NztcbiAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICB9XG5cbiAgICAuaW5mby1pdGVtIHAge1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgY29sb3I6ICMxMTE4Mjc7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICAgIH1cblxuICAgIC5hY3Rpb25zIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgICBnYXA6IDEwcHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxNHB4O1xuICAgIH1cblxuICAgIC5idG4ge1xuICAgICAgcGFkZGluZzogMTBweCAxNHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgfVxuXG4gICAgLmJ0bjpkaXNhYmxlZCB7XG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgb3BhY2l0eTogMC43O1xuICAgIH1cblxuICAgIC5idG4tc2Vjb25kYXJ5IHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM0NzU0Njc7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgfVxuXG4gICAgLmJ0bi1zZWNvbmRhcnk6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzM0NDA1NDtcbiAgICB9XG5cbiAgICAuYnRuLXByaW1hcnkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzE3NWNkMztcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG5cbiAgICAuYnRuLXByaW1hcnk6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzE4NDlhOTtcbiAgICB9XG5cbiAgICAuYnRuLW91dGxpbmUge1xuICAgICAgYm9yZGVyLWNvbG9yOiAjZDBkNWRkO1xuICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgIGNvbG9yOiAjMzQ0MDU0O1xuICAgIH1cblxuICAgIC5idG4tb3V0bGluZTpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZjlmYWZiO1xuICAgIH1cblxuICAgIC5hbGVydCB7XG4gICAgICBwYWRkaW5nOiAxMnB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgICB9XG5cbiAgICAuYWxlcnQtZGFuZ2VyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWYyZjI7XG4gICAgICBjb2xvcjogIzk5MWIxYjtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNmZWNhY2E7XG4gICAgfVxuXG4gICAgLnJhdy10ZXh0LFxuICAgIC52YWxpZGF0aW9uLXN1bW1hcnksXG4gICAgLndhcm5pbmdzIHtcbiAgICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgICBwYWRkaW5nOiAxNnB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2VhZWNmMDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgfVxuXG4gICAgLnJhdy10ZXh0IGgzLFxuICAgIC52YWxpZGF0aW9uLXN1bW1hcnkgaDMsXG4gICAgLndhcm5pbmdzIGgzIHtcbiAgICAgIG1hcmdpbjogMCAwIDEwcHg7XG4gICAgfVxuXG4gICAgcHJlIHtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbiAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG4gICAgICBmb250LWZhbWlseTogdWktbW9ub3NwYWNlLCBTRk1vbm8tUmVndWxhciwgTWVubG8sIE1vbmFjbywgQ29uc29sYXMsICdMaWJlcmF0aW9uIE1vbm8nLCAnQ291cmllciBOZXcnLCBtb25vc3BhY2U7XG4gICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICBiYWNrZ3JvdW5kOiAjZjhmYWZjO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2UyZThmMDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICBtYXgtaGVpZ2h0OiAzMjBweDtcbiAgICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIH1cblxuICAgIC53YXJuaW5nLWl0ZW0ge1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgcGFkZGluZzogMTJweDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgIH1cblxuICAgIC53YXJuaW5nLW1ldGEge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGdhcDogOHB4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcbiAgICB9XG5cbiAgICAud2FybmluZy1jb2RlLFxuICAgIC53YXJuaW5nLXNldmVyaXR5IHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xuICAgICAgcGFkZGluZzogM3B4IDhweDtcbiAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICBiYWNrZ3JvdW5kOiAjZjNmNGY2O1xuICAgICAgY29sb3I6ICMxMTE4Mjc7XG4gICAgfVxuXG4gICAgLndhcm5pbmctY3JpdGljYWwge1xuICAgICAgYm9yZGVyLWNvbG9yOiAjZmVjYWNhO1xuICAgICAgYmFja2dyb3VuZDogI2ZlZjJmMjtcbiAgICB9XG5cbiAgICAud2FybmluZy13YXJuaW5nIHtcbiAgICAgIGJvcmRlci1jb2xvcjogI2ZlZDdhYTtcbiAgICAgIGJhY2tncm91bmQ6ICNmZmZiZWI7XG4gICAgfVxuXG4gICAgLndhcm5pbmctaW5mbyB7XG4gICAgICBib3JkZXItY29sb3I6ICNiZmRiZmU7XG4gICAgICBiYWNrZ3JvdW5kOiAjZWZmNmZmO1xuICAgIH1cblxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA5MDBweCkge1xuICAgICAgLmRldGFpbC1sYXlvdXQge1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcbiAgICAgIH1cblxuICAgICAgLmhlYWRlciB7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgfVxuICAgIH1cbiAgYF1cbn0pXG5leHBvcnQgY2xhc3MgRG9jdW1lbnREZXRhaWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIGRvY3VtZW50OiBEb2N1bWVudERldGFpbER0byB8IG51bGwgPSBudWxsO1xuICByZXN1bHQ6IERvY3VtZW50UmVzdWx0RHRvIHwgbnVsbCA9IG51bGw7XG4gIGxvYWRpbmcgPSB0cnVlO1xuICBhY3Rpb25Mb2FkaW5nID0gZmFsc2U7XG4gIHJhd1RleHRWaXNpYmxlID0gZmFsc2U7XG4gIHJhd1RleHRMb2FkaW5nID0gZmFsc2U7XG4gIHJhd1RleHQgPSAnJztcbiAgbG9hZEVycm9yID0gJyc7XG4gIGFjdGlvbkVycm9yID0gJyc7XG4gIHVpTGFuZ3VhZ2U6IFVpTGFuZ3VhZ2UgPSAnZW4nO1xuICBqc29uRXhwb3J0VXJsID0gJyc7XG4gIGNzdkV4cG9ydFVybCA9ICcnO1xuICBlbmdpbmVCYWRnZXM6IHN0cmluZ1tdID0gW107XG4gIHByZXZpZXdVcmwgPSAnJztcbiAgc2FmZVByZXZpZXdVcmw6IFNhZmVSZXNvdXJjZVVybCB8IG51bGwgPSBudWxsO1xuICBpc1BkZlByZXZpZXcgPSBmYWxzZTtcbiAgaXNJbWFnZVByZXZpZXcgPSBmYWxzZTtcbiAgcHJldmlld0ZhaWxlZCA9IGZhbHNlO1xuICBwb2xsaW5nID0gZmFsc2U7XG4gIHByb2Nlc3NpbmdQcm9ncmVzc01lc3NhZ2UgPSAnJztcbiAgcHJpdmF0ZSByb3V0ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3RhdHVzUG9sbGluZ1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBkb2N1bWVudFNlcnZpY2U6IERvY3VtZW50U2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNhbml0aXplcjogRG9tU2FuaXRpemVyXG4gICkge31cblxuICBnZXQgaXNVcGxvYWRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudD8uc3RhdHVzID09PSAnVXBsb2FkZWQnO1xuICB9XG5cbiAgZ2V0IGlzRmFpbGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50Py5zdGF0dXMgPT09ICdGYWlsZWQnO1xuICB9XG5cbiAgZ2V0IGlzTmVlZHNSZXZpZXcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnQ/LnN0YXR1cyA9PT0gJ05lZWRzUmV2aWV3JztcbiAgfVxuXG4gIGdldCBmYWlsdXJlUmVhc29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0Py5sYXRlc3RFeHRyYWN0aW9uSm9iPy5lcnJvck1lc3NhZ2UgfHwgJ05vIGZhaWx1cmUgZGV0YWlscyB3ZXJlIHByb3ZpZGVkIGJ5IHRoZSBiYWNrZW5kLic7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlU3Vic2NyaXB0aW9uID0gdGhpcy5yb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gcGFyYW1zWydpZCddO1xuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuc3RvcFN0YXR1c1BvbGxpbmcoKTtcbiAgICAgICAgdGhpcy5sb2FkRG9jdW1lbnQoaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZVN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN0b3BTdGF0dXNQb2xsaW5nKCk7XG4gIH1cblxuICBsb2FkRG9jdW1lbnQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc3RvcFN0YXR1c1BvbGxpbmcoKTtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMubG9hZEVycm9yID0gJyc7XG4gICAgdGhpcy5hY3Rpb25FcnJvciA9ICcnO1xuICAgIHRoaXMucmF3VGV4dFZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLnJhd1RleHQgPSAnJztcbiAgICB0aGlzLnByZXZpZXdVcmwgPSAnJztcbiAgICB0aGlzLnNhZmVQcmV2aWV3VXJsID0gbnVsbDtcbiAgICB0aGlzLmlzUGRmUHJldmlldyA9IGZhbHNlO1xuICAgIHRoaXMuaXNJbWFnZVByZXZpZXcgPSBmYWxzZTtcbiAgICB0aGlzLnByZXZpZXdGYWlsZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmdldERvY3VtZW50KGlkKS5waXBlKHRpbWVvdXQoMTUwMDApKS5zdWJzY3JpYmUoe1xuICAgICAgbmV4dDogKGRvY3VtZW50KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgICAgICAgIHRoaXMuanNvbkV4cG9ydFVybCA9IHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmdldEpzb25FeHBvcnRVcmwoZG9jdW1lbnQuaWQpO1xuICAgICAgICAgIHRoaXMuY3N2RXhwb3J0VXJsID0gdGhpcy5kb2N1bWVudFNlcnZpY2UuZ2V0Q3N2RXhwb3J0VXJsKGRvY3VtZW50LmlkKTtcbiAgICAgICAgICB0aGlzLnByZXZpZXdVcmwgPSB0aGlzLmRvY3VtZW50U2VydmljZS5nZXREb2N1bWVudEZpbGVVcmwoZG9jdW1lbnQuaWQpO1xuICAgICAgICAgIHRoaXMuc2FmZVByZXZpZXdVcmwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwodGhpcy5wcmV2aWV3VXJsKTtcbiAgICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IChkb2N1bWVudC5jb250ZW50VHlwZSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB0aGlzLmlzUGRmUHJldmlldyA9IGNvbnRlbnRUeXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9wZGYnKTtcbiAgICAgICAgICB0aGlzLmlzSW1hZ2VQcmV2aWV3ID0gY29udGVudFR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJyk7XG4gICAgICAgICAgdGhpcy5wcmV2aWV3RmFpbGVkID0gZmFsc2U7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRoaXMuZG9jdW1lbnQgPSBudWxsO1xuICAgICAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmxvYWRFcnJvciA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudFNlcnZpY2UuZ2V0RG9jdW1lbnRSZXN1bHQoaWQpLnBpcGUodGltZW91dCgxNTAwMCksIGNhdGNoRXJyb3IoKCkgPT4gb2YobnVsbCkpKS5zdWJzY3JpYmUoe1xuICAgICAgICAgIG5leHQ6IChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRSZXN1bHQgPSB0aGlzLm5vcm1hbGl6ZVJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBub3JtYWxpemVkUmVzdWx0O1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVCYWRnZXMgPSB0aGlzLmJ1aWxkRW5naW5lQmFkZ2VzKG5vcm1hbGl6ZWRSZXN1bHQpO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbmdpbmVCYWRnZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5kb2N1bWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9hZEVycm9yID0gdGhpcy5nZXRFcnJvck1lc3NhZ2UoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3NEb2N1bWVudCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZG9jdW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGlvbkxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuYWN0aW9uRXJyb3IgPSAnJztcbiAgICB0aGlzLnBvbGxpbmcgPSB0cnVlO1xuICAgIHRoaXMucHJvY2Vzc2luZ1Byb2dyZXNzTWVzc2FnZSA9ICdTdWJtaXR0aW5nIHByb2Nlc3MgcmVxdWVzdC4uLic7XG5cbiAgICBjb25zdCBkb2N1bWVudElkID0gdGhpcy5kb2N1bWVudC5pZDtcbiAgICB0aGlzLmRvY3VtZW50LnN0YXR1cyA9ICdQcm9jZXNzaW5nJztcblxuICAgIHRoaXMuZG9jdW1lbnRTZXJ2aWNlLnByb2Nlc3NEb2N1bWVudChkb2N1bWVudElkKS5zdWJzY3JpYmUoe1xuICAgICAgbmV4dDogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRvY3VtZW50ID0gcmVzcG9uc2U7XG4gICAgICAgIHRoaXMuc3RhcnRTdGF0dXNQb2xsaW5nKGRvY3VtZW50SWQpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aW9uTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nUHJvZ3Jlc3NNZXNzYWdlID0gJyc7XG4gICAgICAgIHRoaXMuYWN0aW9uRXJyb3IgPSB0aGlzLmdldEVycm9yTWVzc2FnZShlcnIpO1xuICAgICAgICB0aGlzLmxvYWREb2N1bWVudChkb2N1bWVudElkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZVJhd1RleHQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRvY3VtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmF3VGV4dFZpc2libGUpIHtcbiAgICAgIHRoaXMucmF3VGV4dFZpc2libGUgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJhd1RleHRWaXNpYmxlID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLnJhd1RleHQubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmF3VGV4dExvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmdldFJhd1RleHQodGhpcy5kb2N1bWVudC5pZCkuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQ6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnJhd1RleHQgPSByZXNwb25zZS5yYXdUZXh0O1xuICAgICAgICB0aGlzLnJhd1RleHRMb2FkaW5nID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5yYXdUZXh0TG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJhd1RleHQgPSB0aGlzLmdldEVycm9yTWVzc2FnZShlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25QcmV2aWV3RXJyb3IoKTogdm9pZCB7XG4gICAgdGhpcy5wcmV2aWV3RmFpbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGdldFJlcXVlc3RlZExhbmd1YWdlTGFiZWwodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgbWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgVW5rbm93bjogJ0F1dG8tZGV0ZWN0JyxcbiAgICAgIEVuZ2xpc2hDYW5hZGE6ICdFbmdsaXNoIENhbmFkYScsXG4gICAgICBGcmVuY2hDYW5hZGE6ICdGcmFuw6dhaXMgQ2FuYWRhJyxcbiAgICAgIEJpbGluZ3VhbENhbmFkYTogJ0JpbGluZ3VhbCBDYW5hZGEnXG4gICAgfTtcblxuICAgIHJldHVybiBtYXBbdmFsdWVdID8/IHZhbHVlO1xuICB9XG5cbiAgZ2V0RGV0ZWN0ZWRMYW5ndWFnZUxhYmVsKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnJlc3VsdCB8fCAhdGhpcy5yZXN1bHQuZGV0ZWN0ZWREb2N1bWVudExhbmd1YWdlKSB7XG4gICAgICByZXR1cm4gJy0nO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldFJlcXVlc3RlZExhbmd1YWdlTGFiZWwodGhpcy5yZXN1bHQuZGV0ZWN0ZWREb2N1bWVudExhbmd1YWdlKTtcbiAgfVxuXG4gIGZvcm1hdERhdGUodmFsdWU/OiBzdHJpbmcgfCBudWxsKTogc3RyaW5nIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gJy0nO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSkudG9Mb2NhbGVTdHJpbmcoKTtcbiAgfVxuXG4gIGZvcm1hdENvbmZpZGVuY2UodmFsdWU/OiBudW1iZXIgfCBudWxsKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuICctJztcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7KHZhbHVlICogMTAwKS50b0ZpeGVkKDEpfSVgO1xuICB9XG5cbiAgZm9ybWF0UHJvY2Vzc2luZ1RpbWUodmFsdWU/OiBudW1iZXIgfCBudWxsKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuICctJztcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7dmFsdWV9IG1zYDtcbiAgfVxuXG4gIGZvcm1hdEVzdGltYXRlZENvc3QodmFsdWU/OiBudW1iZXIgfCBudWxsKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuICctJztcbiAgICB9XG5cbiAgICByZXR1cm4gYCQke3ZhbHVlLnRvRml4ZWQoNCl9YDtcbiAgfVxuXG4gIGdldEVuZ2luZVVzZWRMYWJlbCgpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5yZXN1bHQpIHtcbiAgICAgIHJldHVybiAnLSc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzdWx0LmZhbGxiYWNrVXNlZCAmJiB0aGlzLnJlc3VsdC5mYWxsYmFja09jckVuZ2luZVVzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5mYWxsYmFja09jckVuZ2luZVVzZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVzdWx0LnByaW1hcnlPY3JFbmdpbmVVc2VkIHx8ICctJztcbiAgfVxuXG4gIGdldFdhcm5pbmdNZXNzYWdlKHdhcm5pbmc6IFZhbGlkYXRpb25XYXJuaW5nRHRvKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy51aUxhbmd1YWdlID09PSAnZnInICYmIHdhcm5pbmcubWVzc2FnZUZyKSB7XG4gICAgICByZXR1cm4gd2FybmluZy5tZXNzYWdlRnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdhcm5pbmcubWVzc2FnZUVuO1xuICB9XG5cbiAgZ2V0V2FybmluZ1NldmVyaXR5Q2xhc3Mod2FybmluZzogVmFsaWRhdGlvbldhcm5pbmdEdG8pOiBzdHJpbmcge1xuICAgIGNvbnN0IHZhbHVlID0gd2FybmluZy5zZXZlcml0eS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKHZhbHVlLmluY2x1ZGVzKCdjcml0aWNhbCcpIHx8IHZhbHVlLmluY2x1ZGVzKCdlcnJvcicpIHx8IHZhbHVlLmluY2x1ZGVzKCdoaWdoJykpIHtcbiAgICAgIHJldHVybiAnd2FybmluZy1jcml0aWNhbCc7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlLmluY2x1ZGVzKCd3YXJuJykgfHwgdmFsdWUuaW5jbHVkZXMoJ21lZGl1bScpKSB7XG4gICAgICByZXR1cm4gJ3dhcm5pbmctd2FybmluZyc7XG4gICAgfVxuXG4gICAgcmV0dXJuICd3YXJuaW5nLWluZm8nO1xuICB9XG5cbiAgZ2V0U3RhdHVzQmFkZ2VDbGFzcyhzdGF0dXM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgbWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgVXBsb2FkZWQ6ICdiYWRnZS11cGxvYWRlZCcsXG4gICAgICBQcm9jZXNzaW5nOiAnYmFkZ2UtcHJvY2Vzc2luZycsXG4gICAgICBDb21wbGV0ZWQ6ICdiYWRnZS1jb21wbGV0ZWQnLFxuICAgICAgRmFpbGVkOiAnYmFkZ2UtZmFpbGVkJyxcbiAgICAgIE5lZWRzUmV2aWV3OiAnYmFkZ2UtbmVlZHMtcmV2aWV3J1xuICAgIH07XG5cbiAgICByZXR1cm4gbWFwW3N0YXR1c10gPz8gJ2JhZGdlLXVua25vd24nO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFN0YXR1c1BvbGxpbmcoZG9jdW1lbnRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zdG9wU3RhdHVzUG9sbGluZygpO1xuICAgIHRoaXMucG9sbGluZyA9IHRydWU7XG4gICAgdGhpcy5wcm9jZXNzaW5nUHJvZ3Jlc3NNZXNzYWdlID0gJ0NoZWNraW5nIHByb2Nlc3Npbmcgc3RhdHVzIGV2ZXJ5IDIgc2Vjb25kcy4uLic7XG5cbiAgICB0aGlzLnN0YXR1c1BvbGxpbmdTdWJzY3JpcHRpb24gPSB0aW1lcigwLCAyMDAwKS5waXBlKFxuICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmdldERvY3VtZW50KGRvY3VtZW50SWQpKVxuICAgICkuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQ6IChkb2N1bWVudCkgPT4ge1xuICAgICAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LnN0YXR1cyA9PT0gJ0NvbXBsZXRlZCcgfHwgZG9jdW1lbnQuc3RhdHVzID09PSAnTmVlZHNSZXZpZXcnIHx8IGRvY3VtZW50LnN0YXR1cyA9PT0gJ0ZhaWxlZCcpIHtcbiAgICAgICAgICB0aGlzLnN0b3BTdGF0dXNQb2xsaW5nKCk7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nUHJvZ3Jlc3NNZXNzYWdlID0gJyc7XG5cbiAgICAgICAgICB0aGlzLmRvY3VtZW50U2VydmljZS5nZXREb2N1bWVudFJlc3VsdChkb2N1bWVudElkKS5waXBlKGNhdGNoRXJyb3IoKCkgPT4gb2YobnVsbCkpKS5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgbmV4dDogKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkUmVzdWx0ID0gdGhpcy5ub3JtYWxpemVSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBub3JtYWxpemVkUmVzdWx0O1xuICAgICAgICAgICAgICB0aGlzLmVuZ2luZUJhZGdlcyA9IHRoaXMuYnVpbGRFbmdpbmVCYWRnZXMobm9ybWFsaXplZFJlc3VsdCk7XG4gICAgICAgICAgICAgIGlmIChkb2N1bWVudC5zdGF0dXMgPT09ICdGYWlsZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25FcnJvciA9IHRoaXMuZmFpbHVyZVJlYXNvbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChkb2N1bWVudC5zdGF0dXMgPT09ICdGYWlsZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25FcnJvciA9IHRoaXMuZmFpbHVyZVJlYXNvbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5zdG9wU3RhdHVzUG9sbGluZygpO1xuICAgICAgICB0aGlzLnByb2Nlc3NpbmdQcm9ncmVzc01lc3NhZ2UgPSAnJztcbiAgICAgICAgdGhpcy5hY3Rpb25FcnJvciA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN0b3BTdGF0dXNQb2xsaW5nKCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdHVzUG9sbGluZ1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN0YXR1c1BvbGxpbmdTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIHRoaXMucG9sbGluZyA9IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVSZXN1bHQocmVzdWx0OiBEb2N1bWVudFJlc3VsdER0byB8IG51bGwpOiBEb2N1bWVudFJlc3VsdER0byB8IG51bGwge1xuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ucmVzdWx0LFxuICAgICAgYmlsaW5ndWFsV2FybmluZ3M6IEFycmF5LmlzQXJyYXkocmVzdWx0LmJpbGluZ3VhbFdhcm5pbmdzKSA/IHJlc3VsdC5iaWxpbmd1YWxXYXJuaW5ncyA6IFtdLFxuICAgICAgbGluZUl0ZW1zOiBBcnJheS5pc0FycmF5KHJlc3VsdC5saW5lSXRlbXMpID8gcmVzdWx0LmxpbmVJdGVtcyA6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRFbmdpbmVCYWRnZXMocmVzdWx0OiBEb2N1bWVudFJlc3VsdER0byB8IG51bGwpOiBzdHJpbmdbXSB7XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBiYWRnZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBwcmltYXJ5ID0gKHJlc3VsdC5wcmltYXJ5T2NyRW5naW5lVXNlZCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBmYWxsYmFjayA9IChyZXN1bHQuZmFsbGJhY2tPY3JFbmdpbmVVc2VkIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IG1vZGVsID0gKHJlc3VsdC5tb2RlbE5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAocHJpbWFyeS5pbmNsdWRlcygncGRmJykgfHwgcHJpbWFyeS5pbmNsdWRlcygnbmF0aXZlJykpIHtcbiAgICAgIGJhZGdlcy5hZGQoJ05hdGl2ZSBQREYgVGV4dCcpO1xuICAgIH1cblxuICAgIGlmIChwcmltYXJ5LmluY2x1ZGVzKCd0ZXNzZXJhY3QnKSB8fCBmYWxsYmFjay5pbmNsdWRlcygndGVzc2VyYWN0JykpIHtcbiAgICAgIGJhZGdlcy5hZGQoJ1Rlc3NlcmFjdCcpO1xuICAgIH1cblxuICAgIGlmIChwcmltYXJ5LmluY2x1ZGVzKCdnZW1pbmknKSB8fCBmYWxsYmFjay5pbmNsdWRlcygnZ2VtaW5pJykgfHwgbW9kZWwuaW5jbHVkZXMoJ2dlbWluaScpKSB7XG4gICAgICBiYWRnZXMuYWRkKCdHZW1pbmkgRmxhc2ggTGl0ZScpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHQuZmFsbGJhY2tVc2VkKSB7XG4gICAgICBiYWRnZXMuYWRkKCdWaXNpb24gRmFsbGJhY2snKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShiYWRnZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFcnJvck1lc3NhZ2UoZXJyOiB1bmtub3duKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGVyciA9PT0gJ3N0cmluZycgJiYgZXJyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cblxuICAgIGlmIChlcnIgJiYgdHlwZW9mIGVyciA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IGUgPSBlcnIgYXMgeyBlcnJvcj86IHVua25vd247IG1lc3NhZ2U/OiBzdHJpbmcgfTtcbiAgICAgIGlmICh0eXBlb2YgZS5lcnJvciA9PT0gJ3N0cmluZycgJiYgZS5lcnJvci50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gZS5lcnJvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGUuZXJyb3IgJiYgdHlwZW9mIGUuZXJyb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAoZS5lcnJvciBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pLm1lc3NhZ2U7XG4gICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgbWVzc2FnZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZS5tZXNzYWdlID09PSAnc3RyaW5nJyAmJiBlLm1lc3NhZ2UudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGUubWVzc2FnZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJ09wZXJhdGlvbiBmYWlsZWQuIFBsZWFzZSB0cnkgYWdhaW4uJztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgUmVhY3RpdmVGb3Jtc01vZHVsZSwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGZvcmtKb2luLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgRGV0ZWN0ZWRMYW5ndWFnZVZhbHVlLFxuICBEb2N1bWVudFJlc3VsdER0byxcbiAgRG9jdW1lbnRTZXJ2aWNlLFxuICBVcGRhdGVFeHRyYWN0ZWRGaWVsZHNSZXF1ZXN0RHRvLFxuICBWYWxpZGF0aW9uV2FybmluZ0R0b1xufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kb2N1bWVudC5zZXJ2aWNlJztcblxudHlwZSBVaUxhbmd1YWdlID0gJ2VuJyB8ICdmcic7XG5cbnR5cGUgUmV2aWV3Rm9ybUdyb3VwID0gRm9ybUdyb3VwPHtcbiAgdmVuZG9yTmFtZTogRm9ybUNvbnRyb2w8c3RyaW5nPjtcbiAgY3VzdG9tZXJOYW1lOiBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICBkb2N1bWVudE51bWJlcjogRm9ybUNvbnRyb2w8c3RyaW5nPjtcbiAgZG9jdW1lbnREYXRlOiBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICBkdWVEYXRlOiBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICBjdXJyZW5jeTogRm9ybUNvbnRyb2w8c3RyaW5nPjtcbiAgc3VidG90YWw6IEZvcm1Db250cm9sPHN0cmluZz47XG4gIGdzdDogRm9ybUNvbnRyb2w8c3RyaW5nPjtcbiAgcXN0OiBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICBoc3Q6IEZvcm1Db250cm9sPHN0cmluZz47XG4gIHBzdDogRm9ybUNvbnRyb2w8c3RyaW5nPjtcbiAgdGlwOiBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICB0b3RhbDogRm9ybUNvbnRyb2w8c3RyaW5nPjtcbiAgZGV0ZWN0ZWRMYW5ndWFnZTogRm9ybUNvbnRyb2w8RGV0ZWN0ZWRMYW5ndWFnZVZhbHVlPjtcbn0+O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtZG9jdW1lbnQtcmV2aWV3JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUm91dGVyTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2ICpuZ0lmPVwibG9hZGluZ1wiIGNsYXNzPVwibG9hZGluZ1wiPkxvYWRpbmcgZG9jdW1lbnQgcmV2aWV3Li4uPC9kaXY+XG5cbiAgICAgIDxkaXYgKm5nSWY9XCIhbG9hZGluZyAmJiBsb2FkRXJyb3JcIiBjbGFzcz1cIm5vdC1mb3VuZFwiPlxuICAgICAgICA8cD57eyBsb2FkRXJyb3IgfX08L3A+XG4gICAgICAgIDxhIHJvdXRlckxpbms9XCIvZG9jdW1lbnRzXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiPkJhY2sgdG8gbGlzdDwvYT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2ICpuZ0lmPVwiIWxvYWRpbmcgJiYgcmVzdWx0XCIgY2xhc3M9XCJyZXZpZXctc2VjdGlvblwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicmV2aWV3LWxheW91dFwiPlxuICAgICAgICAgIDxhc2lkZSBjbGFzcz1cInByZXZpZXctcGFuZWxcIj5cbiAgICAgICAgICAgIDxoMz5Eb2N1bWVudCBwcmV2aWV3PC9oMz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmV2aWV3LWZyYW1lXCIgKm5nSWY9XCJpc1BkZlByZXZpZXdcIj5cbiAgICAgICAgICAgICAgPGlmcmFtZSBbc3JjXT1cInNhZmVQcmV2aWV3VXJsXCIgdGl0bGU9XCJEb2N1bWVudCBwcmV2aWV3XCIgKGVycm9yKT1cIm9uUHJldmlld0Vycm9yKClcIj48L2lmcmFtZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXctZnJhbWVcIiAqbmdJZj1cImlzSW1hZ2VQcmV2aWV3XCI+XG4gICAgICAgICAgICAgIDxpbWcgW3NyY109XCJwcmV2aWV3VXJsXCIgW2FsdF09XCJyZXN1bHQuZG9jdW1lbnQub3JpZ2luYWxGaWxlTmFtZVwiIChlcnJvcik9XCJvblByZXZpZXdFcnJvcigpXCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXctZmFsbGJhY2tcIiAqbmdJZj1cInByZXZpZXdGYWlsZWQgfHwgKCFpc1BkZlByZXZpZXcgJiYgIWlzSW1hZ2VQcmV2aWV3KVwiPlxuICAgICAgICAgICAgICA8cD5QcmV2aWV3IGlzIG5vdCBhdmFpbGFibGUgZm9yIHRoaXMgZmlsZSB0eXBlLjwvcD5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZXZpZXctYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgIDxhIFtocmVmXT1cInByZXZpZXdVcmxcIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyXCI+T3BlbiBmaWxlPC9hPlxuICAgICAgICAgICAgICAgIDxhIFtocmVmXT1cInByZXZpZXdVcmxcIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZVwiIGRvd25sb2FkPkRvd25sb2FkIGZpbGU8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9hc2lkZT5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZXZpZXctY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aDE+UmV2aWV3IHt7IHJlc3VsdC5kb2N1bWVudC5vcmlnaW5hbEZpbGVOYW1lIH19PC9oMT5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwibWV0YVwiPkRvY3VtZW50IElEOiB7eyByZXN1bHQuZG9jdW1lbnQuaWQgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGEgW3JvdXRlckxpbmtdPVwiWycvZG9jdW1lbnRzJywgcmVzdWx0LmRvY3VtZW50LmlkXVwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIj5CYWNrIHRvIGRldGFpbDwvYT5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnMgdG9wLWFjdGlvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIFtkaXNhYmxlZF09XCJzYXZpbmcgfHwgZm9ybS5pbnZhbGlkXCIgKGNsaWNrKT1cInNhdmVDb3JyZWN0aW9ucygpXCI+XG4gICAgICAgICAgICB7eyBzYXZpbmcgPyAnU2F2aW5nLi4uJyA6ICdTYXZlIGNvcnJlY3Rpb25zJyB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxhIFtocmVmXT1cImpzb25FeHBvcnRVcmxcIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZVwiIGRvd25sb2FkPkRvd25sb2FkIEpTT048L2E+XG4gICAgICAgICAgPGEgW2hyZWZdPVwiY3N2RXhwb3J0VXJsXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIiBkb3dubG9hZD5Eb3dubG9hZCBDU1Y8L2E+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0dXMtY2FyZFwiICpuZ0lmPVwicmVzdWx0LnZhbGlkYXRpb25SZXN1bHRcIj5cbiAgICAgICAgICA8aDM+Q3VycmVudCB2YWxpZGF0aW9uIHN0YXR1czwvaDM+XG4gICAgICAgICAgPHA+XG4gICAgICAgICAgICA8c3Ryb25nPnt7IHJlc3VsdC52YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWRhdGVkID8gJ1ZhbGlkYXRlZCcgOiAnTmVlZHMgcmV2aWV3JyB9fTwvc3Ryb25nPlxuICAgICAgICAgICAg4oCUIHt7IHJlc3VsdC52YWxpZGF0aW9uUmVzdWx0LnN1bW1hcnkgfX1cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0dXMtY2FyZFwiICpuZ0lmPVwiIXJlc3VsdC52YWxpZGF0aW9uUmVzdWx0XCI+XG4gICAgICAgICAgPGgzPkN1cnJlbnQgdmFsaWRhdGlvbiBzdGF0dXM8L2gzPlxuICAgICAgICAgIDxwPk5vIHZhbGlkYXRpb24gcmVzdWx0IGlzIGN1cnJlbnRseSBhdmFpbGFibGUuPC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiBjbGFzcz1cImZvcm0tZ3JpZFwiIChuZ1N1Ym1pdCk9XCJzYXZlQ29ycmVjdGlvbnMoKVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZCBmdWxsLXdpZHRoXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidmVuZG9yTmFtZVwiPlZlbmRvck5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwidmVuZG9yTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgZm9ybUNvbnRyb2xOYW1lPVwidmVuZG9yTmFtZVwiIC8+XG4gICAgICAgICAgICA8cCAqbmdJZj1cImZvcm0uY29udHJvbHMudmVuZG9yTmFtZS50b3VjaGVkICYmIGZvcm0uY29udHJvbHMudmVuZG9yTmFtZS5pbnZhbGlkXCIgY2xhc3M9XCJmaWVsZC1lcnJvclwiPlZlbmRvck5hbWUgaXMgcmVxdWlyZWQuPC9wPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3VzdG9tZXJOYW1lXCI+Q3VzdG9tZXJOYW1lPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImN1c3RvbWVyTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgZm9ybUNvbnRyb2xOYW1lPVwiY3VzdG9tZXJOYW1lXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImRvY3VtZW50TnVtYmVyXCI+RG9jdW1lbnROdW1iZXI8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiZG9jdW1lbnROdW1iZXJcIiB0eXBlPVwidGV4dFwiIGZvcm1Db250cm9sTmFtZT1cImRvY3VtZW50TnVtYmVyXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImRvY3VtZW50RGF0ZVwiPkRvY3VtZW50RGF0ZTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJkb2N1bWVudERhdGVcIiB0eXBlPVwiZGF0ZVwiIGZvcm1Db250cm9sTmFtZT1cImRvY3VtZW50RGF0ZVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkdWVEYXRlXCI+RHVlRGF0ZTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJkdWVEYXRlXCIgdHlwZT1cImRhdGVcIiBmb3JtQ29udHJvbE5hbWU9XCJkdWVEYXRlXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImN1cnJlbmN5XCI+Q3VycmVuY3k8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY3VycmVuY3lcIiB0eXBlPVwidGV4dFwiIGZvcm1Db250cm9sTmFtZT1cImN1cnJlbmN5XCIgbWF4bGVuZ3RoPVwiM1wiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkZXRlY3RlZExhbmd1YWdlXCI+RGV0ZWN0ZWRMYW5ndWFnZTwvbGFiZWw+XG4gICAgICAgICAgICA8c2VsZWN0IGlkPVwiZGV0ZWN0ZWRMYW5ndWFnZVwiIGZvcm1Db250cm9sTmFtZT1cImRldGVjdGVkTGFuZ3VhZ2VcIj5cbiAgICAgICAgICAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIGxhbmd1YWdlT3B0aW9uc1wiIFt2YWx1ZV09XCJvcHRpb24udmFsdWVcIj57eyBvcHRpb24ubGFiZWwgfX08L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwic3VidG90YWxcIj5TdWJ0b3RhbDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJzdWJ0b3RhbFwiIHR5cGU9XCJ0ZXh0XCIgaW5wdXRtb2RlPVwiZGVjaW1hbFwiIGZvcm1Db250cm9sTmFtZT1cInN1YnRvdGFsXCIgKGJsdXIpPVwiZm9ybWF0TW9uZXlDb250cm9sKCdzdWJ0b3RhbCcpXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImdzdFwiPkdTVC9UUFM8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiZ3N0XCIgdHlwZT1cInRleHRcIiBpbnB1dG1vZGU9XCJkZWNpbWFsXCIgZm9ybUNvbnRyb2xOYW1lPVwiZ3N0XCIgKGJsdXIpPVwiZm9ybWF0TW9uZXlDb250cm9sKCdnc3QnKVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJxc3RcIj5RU1QvVFZRPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInFzdFwiIHR5cGU9XCJ0ZXh0XCIgaW5wdXRtb2RlPVwiZGVjaW1hbFwiIGZvcm1Db250cm9sTmFtZT1cInFzdFwiIChibHVyKT1cImZvcm1hdE1vbmV5Q29udHJvbCgncXN0JylcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiaHN0XCI+SFNUL1RWSDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJoc3RcIiB0eXBlPVwidGV4dFwiIGlucHV0bW9kZT1cImRlY2ltYWxcIiBmb3JtQ29udHJvbE5hbWU9XCJoc3RcIiAoYmx1cik9XCJmb3JtYXRNb25leUNvbnRyb2woJ2hzdCcpXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBzdFwiPlBTVC9UVlA8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicHN0XCIgdHlwZT1cInRleHRcIiBpbnB1dG1vZGU9XCJkZWNpbWFsXCIgZm9ybUNvbnRyb2xOYW1lPVwicHN0XCIgKGJsdXIpPVwiZm9ybWF0TW9uZXlDb250cm9sKCdwc3QnKVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0aXBcIj5UaXAvUG91cmJvaXJlPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInRpcFwiIHR5cGU9XCJ0ZXh0XCIgaW5wdXRtb2RlPVwiZGVjaW1hbFwiIGZvcm1Db250cm9sTmFtZT1cInRpcFwiIChibHVyKT1cImZvcm1hdE1vbmV5Q29udHJvbCgndGlwJylcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidG90YWxcIj5Ub3RhbDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJ0b3RhbFwiIHR5cGU9XCJ0ZXh0XCIgaW5wdXRtb2RlPVwiZGVjaW1hbFwiIGZvcm1Db250cm9sTmFtZT1cInRvdGFsXCIgKGJsdXIpPVwiZm9ybWF0TW9uZXlDb250cm9sKCd0b3RhbCcpXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb3JtPlxuXG4gICAgICAgIDxkaXYgKm5nSWY9XCJzYXZlRXJyb3JcIiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiPnt7IHNhdmVFcnJvciB9fTwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2F2ZVN1Y2Nlc3NcIiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIj57eyBzYXZlU3VjY2VzcyB9fTwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3YXJuaW5nc1wiICpuZ0lmPVwicmVzdWx0LmJpbGluZ3VhbFdhcm5pbmdzLmxlbmd0aCA+IDBcIj5cbiAgICAgICAgICA8aDM+QmlsaW5ndWFsIHdhcm5pbmdzIGFuZCBlcnJvcnM8L2gzPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3YXJuaW5nLWl0ZW1cIiAqbmdGb3I9XCJsZXQgd2FybmluZyBvZiByZXN1bHQuYmlsaW5ndWFsV2FybmluZ3NcIiBbbmdDbGFzc109XCJnZXRXYXJuaW5nU2V2ZXJpdHlDbGFzcyh3YXJuaW5nKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndhcm5pbmctbWV0YVwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIndhcm5pbmctY29kZVwiPnt7IHdhcm5pbmcuY29kZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ3YXJuaW5nLXNldmVyaXR5XCI+e3sgd2FybmluZy5zZXZlcml0eSB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHA+e3sgZ2V0V2FybmluZ01lc3NhZ2Uod2FybmluZykgfX08L3A+XG4gICAgICAgICAgICA8cCAqbmdJZj1cIndhcm5pbmcuZmllbGROYW1lXCIgY2xhc3M9XCJ3YXJuaW5nLWZpZWxkXCI+RmllbGQ6IHt7IHdhcm5pbmcuZmllbGROYW1lIH19PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwicmF3LXBhbmVsXCI+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIiAoY2xpY2spPVwicmF3UGFuZWxFeHBhbmRlZCA9ICFyYXdQYW5lbEV4cGFuZGVkXCI+XG4gICAgICAgICAgICB7eyByYXdQYW5lbEV4cGFuZGVkID8gJ0hpZGUgcmF3IE9DUiB0ZXh0JyA6ICdTaG93IHJhdyBPQ1IgdGV4dCcgfX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmF3LWNvbnRlbnRcIiAqbmdJZj1cInJhd1BhbmVsRXhwYW5kZWRcIj5cbiAgICAgICAgICAgIDxwcmU+e3sgcmVzdWx0LnJhd1RleHQgfHwgJ05vIHJhdyBPQ1IgdGV4dCBhdmFpbGFibGUuJyB9fTwvcHJlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9ucyBib3R0b20tYWN0aW9uc1wiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgW2Rpc2FibGVkXT1cInNhdmluZyB8fCBmb3JtLmludmFsaWRcIiAoY2xpY2spPVwic2F2ZUNvcnJlY3Rpb25zKClcIj5cbiAgICAgICAgICAgIHt7IHNhdmluZyA/ICdTYXZpbmcuLi4nIDogJ1NhdmUgY29ycmVjdGlvbnMnIH19XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGEgW3JvdXRlckxpbmtdPVwiWycvZG9jdW1lbnRzJywgcmVzdWx0LmRvY3VtZW50LmlkXVwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIj5CYWNrIHRvIGRldGFpbDwvYT5cbiAgICAgICAgICA8YSBbaHJlZl09XCJqc29uRXhwb3J0VXJsXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIiBkb3dubG9hZD5Eb3dubG9hZCBKU09OPC9hPlxuICAgICAgICAgIDxhIFtocmVmXT1cImNzdkV4cG9ydFVybFwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lXCIgZG93bmxvYWQ+RG93bmxvYWQgQ1NWPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG4gICAgLmNvbnRhaW5lciB7XG4gICAgICBtYXgtd2lkdGg6IDExMDBweDtcbiAgICAgIG1hcmdpbjogMCBhdXRvO1xuICAgICAgcGFkZGluZzogMjRweDtcbiAgICB9XG5cbiAgICAubG9hZGluZyxcbiAgICAubm90LWZvdW5kIHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIHBhZGRpbmc6IDQwcHg7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjZWFlY2YwO1xuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICBjb2xvcjogIzY2NzA4NTtcbiAgICB9XG5cbiAgICAucmV2aWV3LXNlY3Rpb24ge1xuICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICBwYWRkaW5nOiAyNnB4O1xuICAgICAgYm94LXNoYWRvdzogMCAxMnB4IDMycHggcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlYWVjZjA7XG4gICAgfVxuXG4gICAgLnJldmlldy1sYXlvdXQge1xuICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDI4MHB4LCAzNCUpIG1pbm1heCgwLCAxZnIpO1xuICAgICAgZ2FwOiAxOHB4O1xuICAgICAgYWxpZ24taXRlbXM6IHN0YXJ0O1xuICAgIH1cblxuICAgIC5wcmV2aWV3LXBhbmVsIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlYWVjZjA7XG4gICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgcGFkZGluZzogMTJweDtcbiAgICAgIHBvc2l0aW9uOiBzdGlja3k7XG4gICAgICB0b3A6IDE2cHg7XG4gICAgfVxuXG4gICAgLnByZXZpZXctZnJhbWUge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U0ZTdlYztcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICBiYWNrZ3JvdW5kOiAjZjhmYWZjO1xuICAgICAgbWluLWhlaWdodDogNTIwcHg7XG4gICAgfVxuXG4gICAgLnByZXZpZXctZnJhbWUgaWZyYW1lLFxuICAgIC5wcmV2aWV3LWZyYW1lIGltZyB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIG1pbi1oZWlnaHQ6IDUyMHB4O1xuICAgICAgYm9yZGVyOiAwO1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBvYmplY3QtZml0OiBjb250YWluO1xuICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICB9XG5cbiAgICAucHJldmlldy1mYWxsYmFjayB7XG4gICAgICBib3JkZXI6IDFweCBkYXNoZWQgI2QwZDVkZDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICBiYWNrZ3JvdW5kOiAjZjlmYWZiO1xuICAgIH1cblxuICAgIC5wcmV2aWV3LWFjdGlvbnMge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIC5oZWFkZXIge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgIGFsaWduLWl0ZW1zOiBzdGFydDtcbiAgICAgIGdhcDogMTRweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDE0cHg7XG4gICAgfVxuXG4gICAgaDEge1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgZm9udC1zaXplOiAyOHB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgICB9XG5cbiAgICAubWV0YSB7XG4gICAgICBtYXJnaW46IDZweCAwIDA7XG4gICAgICBjb2xvcjogIzY2NzA4NTtcbiAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICB9XG5cbiAgICAuc3RhdHVzLWNhcmQge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U0ZTdlYztcbiAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XG4gICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICBwYWRkaW5nOiAxMnB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTRweDtcbiAgICB9XG5cbiAgICAuc3RhdHVzLWNhcmQgaDMge1xuICAgICAgbWFyZ2luOiAwIDAgOHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgIH1cblxuICAgIC5zdGF0dXMtY2FyZCBwIHtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICB9XG5cbiAgICAuYWN0aW9ucyB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgICAgZ2FwOiAxMHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTRweDtcbiAgICB9XG5cbiAgICAudG9wLWFjdGlvbnMge1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgICB9XG5cbiAgICAuYm90dG9tLWFjdGlvbnMge1xuICAgICAgbWFyZ2luLXRvcDogMThweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgfVxuXG4gICAgLmJ0biB7XG4gICAgICBwYWRkaW5nOiAxMHB4IDE0cHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICB9XG5cbiAgICAuYnRuOmRpc2FibGVkIHtcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICBvcGFjaXR5OiAwLjc7XG4gICAgfVxuXG4gICAgLmJ0bi1wcmltYXJ5IHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMxNzVjZDM7XG4gICAgICBjb2xvcjogI2ZmZjtcbiAgICB9XG5cbiAgICAuYnRuLXByaW1hcnk6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzE4NDlhOTtcbiAgICB9XG5cbiAgICAuYnRuLXNlY29uZGFyeSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDc1NDY3O1xuICAgICAgY29sb3I6ICNmZmY7XG4gICAgfVxuXG4gICAgLmJ0bi1zZWNvbmRhcnk6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzM0NDA1NDtcbiAgICB9XG5cbiAgICAuYnRuLW91dGxpbmUge1xuICAgICAgYm9yZGVyLWNvbG9yOiAjZDBkNWRkO1xuICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgIGNvbG9yOiAjMzQ0MDU0O1xuICAgIH1cblxuICAgIC5idG4tb3V0bGluZTpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZjlmYWZiO1xuICAgIH1cblxuICAgIC5mb3JtLWdyaWQge1xuICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjIwcHgsIDFmcikpO1xuICAgICAgZ2FwOiAxMnB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgICB9XG5cbiAgICAuZmllbGQge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBnYXA6IDZweDtcbiAgICB9XG5cbiAgICAuZnVsbC13aWR0aCB7XG4gICAgICBncmlkLWNvbHVtbjogMSAvIC0xO1xuICAgIH1cblxuICAgIGxhYmVsIHtcbiAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICBjb2xvcjogIzQ3NTQ2NztcbiAgICB9XG5cbiAgICBpbnB1dCxcbiAgICBzZWxlY3Qge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2QwZDVkZDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBjb2xvcjogIzEwMTgyODtcbiAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgfVxuXG4gICAgaW5wdXQ6Zm9jdXMsXG4gICAgc2VsZWN0OmZvY3VzIHtcbiAgICAgIGJvcmRlci1jb2xvcjogIzE3NWNkMztcbiAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSgyMywgOTIsIDIxMSwgMC4xMik7XG4gICAgfVxuXG4gICAgLmZpZWxkLWVycm9yIHtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIGNvbG9yOiAjYjQyMzE4O1xuICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgIH1cblxuICAgIC5hbGVydCB7XG4gICAgICBwYWRkaW5nOiAxMnB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgICB9XG5cbiAgICAuYWxlcnQtZGFuZ2VyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWYyZjI7XG4gICAgICBjb2xvcjogIzk5MWIxYjtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNmZWNhY2E7XG4gICAgfVxuXG4gICAgLmFsZXJ0LXN1Y2Nlc3Mge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2VjZmRmMztcbiAgICAgIGNvbG9yOiAjMDI3YTQ4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2FiZWZjNjtcbiAgICB9XG5cbiAgICAud2FybmluZ3Mge1xuICAgICAgbWFyZ2luLXRvcDogOHB4O1xuICAgICAgcGFkZGluZzogMTRweDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlYWVjZjA7XG4gICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIH1cblxuICAgIC53YXJuaW5ncyBoMyB7XG4gICAgICBtYXJnaW46IDAgMCAxMHB4O1xuICAgIH1cblxuICAgIC53YXJuaW5nLWl0ZW0ge1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gICAgfVxuXG4gICAgLndhcm5pbmctbWV0YSB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZ2FwOiA4cHg7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgbWFyZ2luLWJvdHRvbTogNHB4O1xuICAgIH1cblxuICAgIC53YXJuaW5nLWNvZGUsXG4gICAgLndhcm5pbmctc2V2ZXJpdHkge1xuICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XG4gICAgICBwYWRkaW5nOiAzcHggOHB4O1xuICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgIGJhY2tncm91bmQ6ICNmM2Y0ZjY7XG4gICAgICBjb2xvcjogIzExMTgyNztcbiAgICB9XG5cbiAgICAud2FybmluZy1jcml0aWNhbCB7XG4gICAgICBib3JkZXItY29sb3I6ICNmZWNhY2E7XG4gICAgICBiYWNrZ3JvdW5kOiAjZmVmMmYyO1xuICAgIH1cblxuICAgIC53YXJuaW5nLXdhcm5pbmcge1xuICAgICAgYm9yZGVyLWNvbG9yOiAjZmVkN2FhO1xuICAgICAgYmFja2dyb3VuZDogI2ZmZmJlYjtcbiAgICB9XG5cbiAgICAud2FybmluZy1pbmZvIHtcbiAgICAgIGJvcmRlci1jb2xvcjogI2JmZGJmZTtcbiAgICAgIGJhY2tncm91bmQ6ICNlZmY2ZmY7XG4gICAgfVxuXG4gICAgLnJhdy1wYW5lbCB7XG4gICAgICBtYXJnaW4tdG9wOiAxNHB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2VhZWNmMDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIH1cblxuICAgIC5yYXctY29udGVudCB7XG4gICAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICAgIH1cblxuICAgIHByZSB7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICAgICAgbWF4LWhlaWdodDogMzAwcHg7XG4gICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjZTJlOGYwO1xuICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgcGFkZGluZzogMTJweDtcbiAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgIGZvbnQtZmFtaWx5OiB1aS1tb25vc3BhY2UsIFNGTW9uby1SZWd1bGFyLCBNZW5sbywgTW9uYWNvLCBDb25zb2xhcywgJ0xpYmVyYXRpb24gTW9ubycsICdDb3VyaWVyIE5ldycsIG1vbm9zcGFjZTtcbiAgICB9XG5cbiAgICBAbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHtcbiAgICAgIC5yZXZpZXctbGF5b3V0IHtcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gICAgICB9XG5cbiAgICAgIC5wcmV2aWV3LWZyYW1lLFxuICAgICAgLnByZXZpZXctZnJhbWUgaWZyYW1lLFxuICAgICAgLnByZXZpZXctZnJhbWUgaW1nIHtcbiAgICAgICAgbWluLWhlaWdodDogMzIwcHg7XG4gICAgICB9XG5cbiAgICAgIC5oZWFkZXIge1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgIH1cbiAgICB9XG4gIGBdXG59KVxuZXhwb3J0IGNsYXNzIERvY3VtZW50UmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgcmVhZG9ubHkgdWlMYW5ndWFnZTogVWlMYW5ndWFnZSA9ICdlbic7XG4gIHJlYWRvbmx5IGxhbmd1YWdlT3B0aW9uczogQXJyYXk8eyB2YWx1ZTogRGV0ZWN0ZWRMYW5ndWFnZVZhbHVlOyBsYWJlbDogc3RyaW5nIH0+ID0gW1xuICAgIHsgdmFsdWU6ICdVbmtub3duJywgbGFiZWw6ICdVbmtub3duJyB9LFxuICAgIHsgdmFsdWU6ICdFbmdsaXNoQ2FuYWRhJywgbGFiZWw6ICdFbmdsaXNoIENhbmFkYScgfSxcbiAgICB7IHZhbHVlOiAnRnJlbmNoQ2FuYWRhJywgbGFiZWw6ICdGcmFuw6dhaXMgQ2FuYWRhJyB9LFxuICAgIHsgdmFsdWU6ICdCaWxpbmd1YWxDYW5hZGEnLCBsYWJlbDogJ0JpbGluZ3VhbCBDYW5hZGEnIH1cbiAgXTtcblxuICByZXN1bHQ6IERvY3VtZW50UmVzdWx0RHRvIHwgbnVsbCA9IG51bGw7XG4gIGxvYWRpbmcgPSB0cnVlO1xuICBzYXZpbmcgPSBmYWxzZTtcbiAgbG9hZEVycm9yID0gJyc7XG4gIHNhdmVFcnJvciA9ICcnO1xuICBzYXZlU3VjY2VzcyA9ICcnO1xuICByYXdQYW5lbEV4cGFuZGVkID0gZmFsc2U7XG4gIGpzb25FeHBvcnRVcmwgPSAnJztcbiAgY3N2RXhwb3J0VXJsID0gJyc7XG4gIHByZXZpZXdVcmwgPSAnJztcbiAgc2FmZVByZXZpZXdVcmw6IFNhZmVSZXNvdXJjZVVybCB8IG51bGwgPSBudWxsO1xuICBpc1BkZlByZXZpZXcgPSBmYWxzZTtcbiAgaXNJbWFnZVByZXZpZXcgPSBmYWxzZTtcbiAgcHJldmlld0ZhaWxlZCA9IGZhbHNlO1xuXG4gIHJlYWRvbmx5IGZvcm06IFJldmlld0Zvcm1Hcm91cDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50U2VydmljZTogRG9jdW1lbnRTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmI6IEZvcm1CdWlsZGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXJcbiAgKSB7XG4gICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICB2ZW5kb3JOYW1lOiB0aGlzLmZiLm5vbk51bGxhYmxlLmNvbnRyb2woJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXSksXG4gICAgICBjdXN0b21lck5hbWU6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICBkb2N1bWVudE51bWJlcjogdGhpcy5mYi5ub25OdWxsYWJsZS5jb250cm9sKCcnKSxcbiAgICAgIGRvY3VtZW50RGF0ZTogdGhpcy5mYi5ub25OdWxsYWJsZS5jb250cm9sKCcnKSxcbiAgICAgIGR1ZURhdGU6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICBjdXJyZW5jeTogdGhpcy5mYi5ub25OdWxsYWJsZS5jb250cm9sKCdDQUQnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZF0pLFxuICAgICAgc3VidG90YWw6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICBnc3Q6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICBxc3Q6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICBoc3Q6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICBwc3Q6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICB0aXA6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbCgnJyksXG4gICAgICB0b3RhbDogdGhpcy5mYi5ub25OdWxsYWJsZS5jb250cm9sKCcnKSxcbiAgICAgIGRldGVjdGVkTGFuZ3VhZ2U6IHRoaXMuZmIubm9uTnVsbGFibGUuY29udHJvbDxEZXRlY3RlZExhbmd1YWdlVmFsdWU+KCdVbmtub3duJylcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMucm91dGUucGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHBhcmFtc1snaWQnXTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICB0aGlzLmxvYWRSZXZpZXcoaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbG9hZFJldmlldyhpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxvYWRFcnJvciA9ICcnO1xuICAgIHRoaXMuc2F2ZUVycm9yID0gJyc7XG4gICAgdGhpcy5zYXZlU3VjY2VzcyA9ICcnO1xuICAgIHRoaXMucHJldmlld1VybCA9ICcnO1xuICAgIHRoaXMuc2FmZVByZXZpZXdVcmwgPSBudWxsO1xuICAgIHRoaXMuaXNQZGZQcmV2aWV3ID0gZmFsc2U7XG4gICAgdGhpcy5pc0ltYWdlUHJldmlldyA9IGZhbHNlO1xuICAgIHRoaXMucHJldmlld0ZhaWxlZCA9IGZhbHNlO1xuXG4gICAgZm9ya0pvaW4oe1xuICAgICAgcmVzdWx0OiB0aGlzLmRvY3VtZW50U2VydmljZS5nZXREb2N1bWVudFJlc3VsdChpZCksXG4gICAgICByYXdUZXh0OiB0aGlzLmRvY3VtZW50U2VydmljZS5nZXRSYXdUZXh0KGlkKS5waXBlKGNhdGNoRXJyb3IoKCkgPT4gb2YoeyByYXdUZXh0OiAnJyB9KSkpXG4gICAgfSkuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQ6ICh7IHJlc3VsdCwgcmF3VGV4dCB9KSA9PiB7XG4gICAgICAgIHJlc3VsdC5yYXdUZXh0ID0gcmVzdWx0LnJhd1RleHQgfHwgcmF3VGV4dC5yYXdUZXh0IHx8ICcnO1xuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgdGhpcy5qc29uRXhwb3J0VXJsID0gdGhpcy5kb2N1bWVudFNlcnZpY2UuZ2V0SnNvbkV4cG9ydFVybChyZXN1bHQuZG9jdW1lbnQuaWQpO1xuICAgICAgICB0aGlzLmNzdkV4cG9ydFVybCA9IHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmdldENzdkV4cG9ydFVybChyZXN1bHQuZG9jdW1lbnQuaWQpO1xuICAgICAgICB0aGlzLnByZXZpZXdVcmwgPSB0aGlzLmRvY3VtZW50U2VydmljZS5nZXREb2N1bWVudEZpbGVVcmwocmVzdWx0LmRvY3VtZW50LmlkKTtcbiAgICAgICAgdGhpcy5zYWZlUHJldmlld1VybCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCh0aGlzLnByZXZpZXdVcmwpO1xuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IChyZXN1bHQuZG9jdW1lbnQuY29udGVudFR5cGUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHRoaXMuaXNQZGZQcmV2aWV3ID0gY29udGVudFR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3BkZicpO1xuICAgICAgICB0aGlzLmlzSW1hZ2VQcmV2aWV3ID0gY29udGVudFR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJyk7XG4gICAgICAgIHRoaXMucHJldmlld0ZhaWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBhdGNoRm9ybUZyb21SZXN1bHQocmVzdWx0KTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZXJyb3I6ICgpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9hZEVycm9yID0gJ0RvY3VtZW50IHJlc3VsdCBub3QgZm91bmQgb3IgY291bGQgbm90IGJlIGxvYWRlZC4nO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2F2ZUNvcnJlY3Rpb25zKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5yZXN1bHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb3JtLmludmFsaWQpIHtcbiAgICAgIHRoaXMuZm9ybS5tYXJrQWxsQXNUb3VjaGVkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zYXZpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2F2ZUVycm9yID0gJyc7XG4gICAgdGhpcy5zYXZlU3VjY2VzcyA9ICcnO1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuYnVpbGRVcGRhdGVSZXF1ZXN0KCk7XG4gICAgdGhpcy5kb2N1bWVudFNlcnZpY2UudXBkYXRlRXh0cmFjdGVkRmllbGRzKHRoaXMucmVzdWx0LmRvY3VtZW50LmlkLCByZXF1ZXN0KS5zdWJzY3JpYmUoe1xuICAgICAgbmV4dDogKHVwZGF0ZWRSZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy5yZXN1bHQgPSB1cGRhdGVkUmVzdWx0O1xuICAgICAgICB0aGlzLnBhdGNoRm9ybUZyb21SZXN1bHQodXBkYXRlZFJlc3VsdCk7XG4gICAgICAgIHRoaXMuc2F2aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2F2ZVN1Y2Nlc3MgPSAnQ29ycmVjdGlvbnMgc2F2ZWQgc3VjY2Vzc2Z1bGx5LiBWYWxpZGF0aW9uIHJlc3VsdCBoYXMgYmVlbiB1cGRhdGVkLic7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5zYXZpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zYXZlRXJyb3IgPSB0aGlzLmdldEVycm9yTWVzc2FnZShlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZm9ybWF0TW9uZXlDb250cm9sKGNvbnRyb2xOYW1lOiAnc3VidG90YWwnIHwgJ2dzdCcgfCAncXN0JyB8ICdoc3QnIHwgJ3BzdCcgfCAndGlwJyB8ICd0b3RhbCcpOiB2b2lkIHtcbiAgICBjb25zdCBjb250cm9sID0gdGhpcy5mb3JtLmNvbnRyb2xzW2NvbnRyb2xOYW1lXTtcbiAgICBjb25zdCBwYXJzZWQgPSB0aGlzLnBhcnNlTW9uZXkoY29udHJvbC52YWx1ZSk7XG5cbiAgICBpZiAocGFyc2VkID09PSBudWxsKSB7XG4gICAgICBjb250cm9sLnNldFZhbHVlKGNvbnRyb2wudmFsdWUudHJpbSgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb250cm9sLnNldFZhbHVlKHBhcnNlZC50b0ZpeGVkKDIpKTtcbiAgfVxuXG4gIGdldFdhcm5pbmdNZXNzYWdlKHdhcm5pbmc6IFZhbGlkYXRpb25XYXJuaW5nRHRvKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy51aUxhbmd1YWdlID09PSAnZnInICYmIHdhcm5pbmcubWVzc2FnZUZyKSB7XG4gICAgICByZXR1cm4gd2FybmluZy5tZXNzYWdlRnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdhcm5pbmcubWVzc2FnZUVuO1xuICB9XG5cbiAgZ2V0V2FybmluZ1NldmVyaXR5Q2xhc3Mod2FybmluZzogVmFsaWRhdGlvbldhcm5pbmdEdG8pOiBzdHJpbmcge1xuICAgIGNvbnN0IHNldmVyaXR5ID0gd2FybmluZy5zZXZlcml0eS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKHNldmVyaXR5LmluY2x1ZGVzKCdlcnJvcicpIHx8IHNldmVyaXR5LmluY2x1ZGVzKCdjcml0aWNhbCcpIHx8IHNldmVyaXR5LmluY2x1ZGVzKCdoaWdoJykpIHtcbiAgICAgIHJldHVybiAnd2FybmluZy1jcml0aWNhbCc7XG4gICAgfVxuXG4gICAgaWYgKHNldmVyaXR5LmluY2x1ZGVzKCd3YXJuaW5nJykgfHwgc2V2ZXJpdHkuaW5jbHVkZXMoJ21lZGl1bScpKSB7XG4gICAgICByZXR1cm4gJ3dhcm5pbmctd2FybmluZyc7XG4gICAgfVxuXG4gICAgcmV0dXJuICd3YXJuaW5nLWluZm8nO1xuICB9XG5cbiAgb25QcmV2aWV3RXJyb3IoKTogdm9pZCB7XG4gICAgdGhpcy5wcmV2aWV3RmFpbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcGF0Y2hGb3JtRnJvbVJlc3VsdChyZXN1bHQ6IERvY3VtZW50UmVzdWx0RHRvKTogdm9pZCB7XG4gICAgY29uc3QgZmllbGRzID0gcmVzdWx0LnN0cnVjdHVyZWRFeHRyYWN0ZWRGaWVsZHM7XG5cbiAgICB0aGlzLmZvcm0uc2V0VmFsdWUoe1xuICAgICAgdmVuZG9yTmFtZTogZmllbGRzPy52ZW5kb3JOYW1lID8/ICcnLFxuICAgICAgY3VzdG9tZXJOYW1lOiBmaWVsZHM/LmN1c3RvbWVyTmFtZSA/PyAnJyxcbiAgICAgIGRvY3VtZW50TnVtYmVyOiBmaWVsZHM/LmRvY3VtZW50TnVtYmVyID8/ICcnLFxuICAgICAgZG9jdW1lbnREYXRlOiB0aGlzLnRvRGF0ZUlucHV0VmFsdWUoZmllbGRzPy5kb2N1bWVudERhdGUpLFxuICAgICAgZHVlRGF0ZTogdGhpcy50b0RhdGVJbnB1dFZhbHVlKGZpZWxkcz8uZHVlRGF0ZSksXG4gICAgICBjdXJyZW5jeTogZmllbGRzPy5jdXJyZW5jeSA/PyAnQ0FEJyxcbiAgICAgIHN1YnRvdGFsOiB0aGlzLm1vbmV5VG9Db250cm9sVmFsdWUoZmllbGRzPy5zdWJ0b3RhbCksXG4gICAgICBnc3Q6IHRoaXMubW9uZXlUb0NvbnRyb2xWYWx1ZShmaWVsZHM/LmdzdCksXG4gICAgICBxc3Q6IHRoaXMubW9uZXlUb0NvbnRyb2xWYWx1ZShmaWVsZHM/LnFzdCksXG4gICAgICBoc3Q6IHRoaXMubW9uZXlUb0NvbnRyb2xWYWx1ZShmaWVsZHM/LmhzdCksXG4gICAgICBwc3Q6IHRoaXMubW9uZXlUb0NvbnRyb2xWYWx1ZShmaWVsZHM/LnBzdCksXG4gICAgICB0aXA6IHRoaXMubW9uZXlUb0NvbnRyb2xWYWx1ZShmaWVsZHM/LnRpcCksXG4gICAgICB0b3RhbDogdGhpcy5tb25leVRvQ29udHJvbFZhbHVlKGZpZWxkcz8udG90YWwpLFxuICAgICAgZGV0ZWN0ZWRMYW5ndWFnZTogdGhpcy50b0RldGVjdGVkTGFuZ3VhZ2VWYWx1ZShyZXN1bHQuZGV0ZWN0ZWREb2N1bWVudExhbmd1YWdlKVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZFVwZGF0ZVJlcXVlc3QoKTogVXBkYXRlRXh0cmFjdGVkRmllbGRzUmVxdWVzdER0byB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmZvcm0uZ2V0UmF3VmFsdWUoKTtcblxuICAgIHJldHVybiB7XG4gICAgICB2ZW5kb3JOYW1lOiB0aGlzLnRvTnVsbGFibGVUcmltbWVkKHZhbHVlLnZlbmRvck5hbWUpLFxuICAgICAgY3VzdG9tZXJOYW1lOiB0aGlzLnRvTnVsbGFibGVUcmltbWVkKHZhbHVlLmN1c3RvbWVyTmFtZSksXG4gICAgICBkb2N1bWVudE51bWJlcjogdGhpcy50b051bGxhYmxlVHJpbW1lZCh2YWx1ZS5kb2N1bWVudE51bWJlciksXG4gICAgICBkb2N1bWVudERhdGU6IHRoaXMudG9OdWxsYWJsZVRyaW1tZWQodmFsdWUuZG9jdW1lbnREYXRlKSxcbiAgICAgIGR1ZURhdGU6IHRoaXMudG9OdWxsYWJsZVRyaW1tZWQodmFsdWUuZHVlRGF0ZSksXG4gICAgICBjdXJyZW5jeTogdGhpcy50b051bGxhYmxlVHJpbW1lZCh2YWx1ZS5jdXJyZW5jeSk/LnRvVXBwZXJDYXNlKCkgPz8gbnVsbCxcbiAgICAgIHN1YnRvdGFsOiB0aGlzLnBhcnNlTW9uZXkodmFsdWUuc3VidG90YWwpLFxuICAgICAgZ3N0OiB0aGlzLnBhcnNlTW9uZXkodmFsdWUuZ3N0KSxcbiAgICAgIHFzdDogdGhpcy5wYXJzZU1vbmV5KHZhbHVlLnFzdCksXG4gICAgICBoc3Q6IHRoaXMucGFyc2VNb25leSh2YWx1ZS5oc3QpLFxuICAgICAgcHN0OiB0aGlzLnBhcnNlTW9uZXkodmFsdWUucHN0KSxcbiAgICAgIHRpcDogdGhpcy5wYXJzZU1vbmV5KHZhbHVlLnRpcCksXG4gICAgICB0b3RhbDogdGhpcy5wYXJzZU1vbmV5KHZhbHVlLnRvdGFsKSxcbiAgICAgIGRldGVjdGVkTGFuZ3VhZ2U6IHZhbHVlLmRldGVjdGVkTGFuZ3VhZ2VcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB0b0RhdGVJbnB1dFZhbHVlKHZhbHVlPzogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gMTApIHtcbiAgICAgIHJldHVybiB2YWx1ZS5zbGljZSgwLCAxMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBtb25leVRvQ29udHJvbFZhbHVlKHZhbHVlPzogbnVtYmVyIHwgbnVsbCk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWUudG9GaXhlZCgyKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VNb25leSh2YWx1ZTogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IHZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXHMvZywgJycpLnJlcGxhY2UoJywnLCAnLicpO1xuICAgIGlmICghbm9ybWFsaXplZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcGFyc2VkID0gTnVtYmVyKG5vcm1hbGl6ZWQpO1xuICAgIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VkICogMTAwKSAvIDEwMDtcbiAgfVxuXG4gIHByaXZhdGUgdG9OdWxsYWJsZVRyaW1tZWQodmFsdWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB2YWx1ZS50cmltKCk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQubGVuZ3RoID4gMCA/IG5vcm1hbGl6ZWQgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0RldGVjdGVkTGFuZ3VhZ2VWYWx1ZSh2YWx1ZTogc3RyaW5nKTogRGV0ZWN0ZWRMYW5ndWFnZVZhbHVlIHtcbiAgICBpZiAodmFsdWUgPT09ICdFbmdsaXNoQ2FuYWRhJyB8fCB2YWx1ZSA9PT0gJ0ZyZW5jaENhbmFkYScgfHwgdmFsdWUgPT09ICdCaWxpbmd1YWxDYW5hZGEnIHx8IHZhbHVlID09PSAnVW5rbm93bicpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ1Vua25vd24nO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFcnJvck1lc3NhZ2UoZXJyOiB1bmtub3duKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGVyciA9PT0gJ3N0cmluZycgJiYgZXJyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cblxuICAgIGlmIChlcnIgJiYgdHlwZW9mIGVyciA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZXJyIGFzIHsgZXJyb3I/OiB1bmtub3duOyBtZXNzYWdlPzogc3RyaW5nIH07XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUuZXJyb3IgPT09ICdzdHJpbmcnICYmIHZhbHVlLmVycm9yLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5lcnJvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlLmVycm9yICYmIHR5cGVvZiB2YWx1ZS5lcnJvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9ICh2YWx1ZS5lcnJvciBhcyB7IG1lc3NhZ2U/OiB1bmtub3duIH0pLm1lc3NhZ2U7XG4gICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgbWVzc2FnZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUubWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUubWVzc2FnZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdmFsdWUubWVzc2FnZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJ0ZhaWxlZCB0byBzYXZlIGNvcnJlY3Rpb25zLic7XG4gIH1cbn1cbiIsImltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IERvY3VtZW50c0xpc3RDb21wb25lbnQgfSBmcm9tICcuL3BhZ2VzL2RvY3VtZW50cy1saXN0L2RvY3VtZW50cy1saXN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERvY3VtZW50VXBsb2FkQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdlcy9kb2N1bWVudC11cGxvYWQvZG9jdW1lbnQtdXBsb2FkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERvY3VtZW50RGV0YWlsQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdlcy9kb2N1bWVudC1kZXRhaWwvZG9jdW1lbnQtZGV0YWlsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERvY3VtZW50UmV2aWV3Q29tcG9uZW50IH0gZnJvbSAnLi9wYWdlcy9kb2N1bWVudC1yZXZpZXcvZG9jdW1lbnQtcmV2aWV3LmNvbXBvbmVudCc7XHJcblxyXG5leHBvcnQgY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXHJcbiAgeyBwYXRoOiAnJywgcmVkaXJlY3RUbzogJy9kb2N1bWVudHMnLCBwYXRoTWF0Y2g6ICdmdWxsJyB9LFxyXG4gIHsgcGF0aDogJ2RvY3VtZW50cycsIGNvbXBvbmVudDogRG9jdW1lbnRzTGlzdENvbXBvbmVudCB9LFxyXG4gIHsgcGF0aDogJ2RvY3VtZW50cy91cGxvYWQnLCBjb21wb25lbnQ6IERvY3VtZW50VXBsb2FkQ29tcG9uZW50IH0sXHJcbiAgeyBwYXRoOiAnZG9jdW1lbnRzLzppZCcsIGNvbXBvbmVudDogRG9jdW1lbnREZXRhaWxDb21wb25lbnQgfSxcclxuICB7IHBhdGg6ICdkb2N1bWVudHMvOmlkL3JldmlldycsIGNvbXBvbmVudDogRG9jdW1lbnRSZXZpZXdDb21wb25lbnQgfSxcclxuICB7IHBhdGg6ICcqKicsIHJlZGlyZWN0VG86ICdkb2N1bWVudHMnIH1cclxuXTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlck91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1yb290JyxcclxuICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gIGltcG9ydHM6IFtSb3V0ZXJPdXRsZXRdLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsOiAnLi9hcHAuY29tcG9uZW50LmNzcydcclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XHJcbiAgdGl0bGUgPSAnZnJvbnRlbmQnO1xyXG59XHJcbiIsIjxoZWFkZXIgY2xhc3M9XCJhcHAtaGVhZGVyXCI+XG4gIDxkaXYgY2xhc3M9XCJhcHAtYnJhbmRcIj5cbiAgICA8aDE+RmluYW5jaWFsIE9DUjwvaDE+XG4gICAgPHA+UmVjZWlwdCBhbmQgaW52b2ljZSByZXZpZXcgZm9yIENhbmFkaWFuIGRvY3VtZW50czwvcD5cbiAgPC9kaXY+XG4gIDxuYXYgY2xhc3M9XCJhcHAtbmF2XCI+XG4gICAgPGEgcm91dGVyTGluaz1cIi9kb2N1bWVudHNcIiByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlXCI+RG9jdW1lbnRzPC9hPlxuICAgIDxhIHJvdXRlckxpbms9XCIvZG9jdW1lbnRzL3VwbG9hZFwiIHJvdXRlckxpbmtBY3RpdmU9XCJhY3RpdmVcIj5VcGxvYWQ8L2E+XG4gIDwvbmF2PlxuPC9oZWFkZXI+XG5cbjxtYWluIGNsYXNzPVwiYXBwLW1haW5cIj5cbiAg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Z0NBQUEsT0FBQSwwQkFBQSxPQUFBLFNBQUEsZ0JBQUEsQ0FBQTtBQUlBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsT0FBQSx5QkFBQSxDQUFBO0FBSUEsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxnQ0FBQSxPQUFBLFNBQUEsTUFBQTtBQUlBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsT0FBQSxXQUFBLE9BQUEsU0FBQSxhQUFBLENBQUE7QUFJQSxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLGdDQUFBLE9BQUEsV0FBQSxPQUFBLFNBQUEsY0FBQSxDQUFBO0FBSUEsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxnQ0FBQSxPQUFBLG1CQUFBLENBQUE7QUFJQSxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLGdDQUFBLE9BQUEsUUFBQSx3QkFBQSxHQUFBO0FBSUEsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxnQ0FBQSxPQUFBLFFBQUEseUJBQUEsR0FBQTtBQUlBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsT0FBQSxRQUFBLGVBQUEsUUFBQSxJQUFBO0FBSUEsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxnQ0FBQSxPQUFBLFFBQUEsZ0JBQUEsR0FBQTtBQUlBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsT0FBQSxRQUFBLGFBQUEsR0FBQTtBQUlBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsT0FBQSxRQUFBLHFCQUFBLEdBQUE7QUFJQSxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLGdDQUFBLE9BQUEsUUFBQSxvQkFBQSxHQUFBO0FBSUEsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxnQ0FBQSxPQUFBLFFBQUEscUJBQUEsR0FBQTtBQUlBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsT0FBQSxxQkFBQSxPQUFBLFFBQUEsd0JBQUEsQ0FBQTtBQUlBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NB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QSxHQUFBLENBQUEsU0FBQSxvQ0FBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLFNBQUEsc0NBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxTQUFBLGdDQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsR0FBQSxXQUFBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsR0FBQSxTQUFBLEdBQUEsQ0FBQSxTQUFBLHNCQUFBLEdBQUEsU0FBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLFdBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxHQUFBLENBQUEsR0FBQSxTQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsU0FBQSxtQkFBQSxHQUFBLFlBQUEsU0FBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsT0FBQSxlQUFBLEdBQUEsWUFBQSxHQUFBLENBQUEsWUFBQSxJQUFBLEdBQUEsT0FBQSxlQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsT0FBQSxlQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUEsQ0FBQSxTQUFBLHNCQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxZQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxzQkFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLFNBQUEsWUFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsZUFBQSxHQUFBLENBQUEsU0FBQSxvQkFBQSxHQUFBLFNBQUEsS0FBQSxHQUFBLENBQUEsR0FBQSxTQUFBLE9BQUEsS0FBQSxHQUFBLENBQUEsR0FBQSxrQkFBQSxHQUFBLENBQUEsR0FBQSxpQkFBQSxHQUFBLENBQUEsVUFBQSxVQUFBLE9BQUEsWUFBQSxHQUFBLE9BQUEsZUFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsa0JBQUEsbUJBQUEsR0FBQSxDQUFBLEdBQUEsa0JBQUEscUJBQUEsR0FBQSxDQUFBLEdBQUEsa0JBQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxTQUFBLGNBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxHQUFBLE9BQUEsZUFBQSxHQUFBLFNBQUEsVUFBQSxHQUFBLENBQUEsR0FBQSxTQUFBLGNBQUEsR0FBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLENBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLG9CQUFBLEdBQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQSxDQUFBLFNBQUEsZ0JBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLGdCQUFBLEdBQUEsU0FBQSxHQUFBLENBQUEsR0FBQSxjQUFBLEdBQUEsQ0FBQSxHQUFBLGNBQUEsR0FBQSxDQUFBLEdBQUEsa0JBQUEsR0FBQSxDQUFBLFNBQUEsaUJBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsQ0FBQSxHQUFBLFVBQUEsU0FBQSxpQ0FBQSxJQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBQTtBQTNpQmhDLE1BQUEsNkJBQUEsR0FBQSxPQUFBLENBQUE7QUFDRSxNQUFBLHlCQUFBLEdBQUEsd0NBQUEsR0FBQSxHQUFBLE9BQUEsQ0FBQSxFQUFxQyxHQUFBLHdDQUFBLEdBQUEsR0FBQSxPQUFBLENBQUEsRUFFZ0IsR0FBQSx3Q0FBQSxLQUFBLElBQUEsT0FBQSxDQUFBO0FBSHZELE1BQUEsMkJBQUE7OztBQUNRLE1BQUEsd0JBQUE7QUFBQSxNQUFBLHlCQUFBLFFBQUEsSUFBQSxPQUFBO0FBRUEsTUFBQSx3QkFBQTtBQUFBLE1BQUEseUJBQUEsUUFBQSxDQUFBLElBQUEsV0FBQSxJQUFBLFNBQUE7QUFLQSxNQUFBLHdCQUFBO0FBQUEsTUFBQSx5QkFBQSxRQUFBLENBQUEsSUFBQSxXQUFBLElBQUEsUUFBQTs7b0JBVkFDLGVBQVksYUFBQSx1QkFBQSxhQUFBLFVBQUEsc0JBQUEsYUFBQSxjQUFBLGtCQUFBLHFCQUFBLGNBQUEsa0JBQUVDLGVBQVksa0JBQUEsZ0JBQUEsc0JBQUEsZ0NBQUEsZUFBQSxtQkFBQSxtQkFBQSxjQUFBLGVBQUEsaUJBQUEsaUJBQUEsbUJBQUEsa0JBQUEsY0FBQSxvQkFBQSxvQkFBQSxnQkFBQSxHQUFBLFFBQUEsQ0FBQSxvbU9BQUEsRUFBQSxDQUFBOzs7Z0ZBNmlCekIseUJBQXVCLENBQUE7VUFoakJuQ0M7dUJBQ1csdUJBQXFCLFlBQ25CLE1BQUksU0FDUCxDQUFDRixlQUFjQyxhQUFZLEdBQUMsVUFDM0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0E4TFQsUUFBQSxDQUFBLDg4TEFBQSxFQUFBLENBQUE7Ozs7aUZBOFdVLHlCQUF1QixFQUFBLFdBQUEsMkJBQUEsVUFBQSwwREFBQSxZQUFBLElBQUEsQ0FBQTtBQUFBLEdBQUE7Ozs7Ozs7K0RBQXZCLHlCQUF1QixFQUFBLFNBQUEsQ0FBQUUsS0FBQUMsS0FBQUMsS0FBQSwwQkFBQUMsR0FBQSxHQUFBLENBQUFOLGVBQUFDLGVBQUFDLFVBQUEsR0FBQSxhQUFBLEVBQUEsQ0FBQTtFQUFBO0FBQUEsR0FBQSxPQUFBLGNBQUEsZUFBQSxjQUFBLGdDQUFBLEtBQUEsSUFBQSxDQUFBO0FBQUEsR0FBQSxPQUFBLGNBQUEsZUFBQSxlQUFBLFlBQUEsT0FBQSxZQUFBLElBQUEsR0FBQSw0QkFBQSxPQUFBLEVBQUEsT0FBQSxNQUFBLGdDQUFBLEVBQUEsU0FBQSxDQUFBO0FBQUEsR0FBQTs7O0FDempCcEMsU0FBUyxhQUFBSyxrQkFBeUI7QUFDbEMsU0FBUyxnQkFBQUMscUJBQW9CO0FBQzdCLFNBQXlCLGdCQUFBQyxxQkFBb0I7QUFFN0MsU0FBOEMscUJBQXFCLGtCQUFrQjtBQUNyRixTQUFTLGNBQUFDLGFBQVksVUFBVSxNQUFBQyxXQUFVOzs7Ozs7Ozs7QUFrQ25DLElBQUEsNkJBQUEsR0FBQSxPQUFBLENBQUE7QUFBcUMsSUFBQSxxQkFBQSxHQUFBLDRCQUFBO0FBQTBCLElBQUEsMkJBQUE7Ozs7O0FBRS9ELElBQUEsNkJBQUEsR0FBQSxPQUFBLENBQUEsRUFBcUQsR0FBQSxHQUFBO0FBQ2hELElBQUEscUJBQUEsQ0FBQTtBQUFlLElBQUEsMkJBQUE7QUFDbEIsSUFBQSw2QkFBQSxHQUFBLEtBQUEsQ0FBQTtBQUFxRCxJQUFBLHFCQUFBLEdBQUEsY0FBQTtBQUFZLElBQUEsMkJBQUEsRUFBSTs7OztBQURsRSxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLGdDQUFBLE9BQUEsU0FBQTs7Ozs7O0FBUUMsSUFBQSw2QkFBQSxHQUFBLE9BQUEsRUFBQSxFQUFnRCxHQUFBLFVBQUEsRUFBQTtBQUNVLElBQUEseUJBQUEsU0FBQSxTQUFBLHVFQUFBO0FBQUEsTUFBQSw0QkFBQSxHQUFBO0FBQUEsWUFBQSxTQUFBLDRCQUFBLENBQUE7QUFBQSxhQUFBLDBCQUFTLE9BQUEsZUFBQSxDQUFnQjtJQUFBLENBQUE7QUFBRSxJQUFBLDJCQUFBLEVBQVM7Ozs7QUFBcEYsSUFBQSx3QkFBQTtBQUFBLElBQUEseUJBQUEsT0FBQSxPQUFBLGdCQUFBLG1DQUFBOzs7Ozs7QUFFVixJQUFBLDZCQUFBLEdBQUEsT0FBQSxFQUFBLEVBQWtELEdBQUEsT0FBQSxFQUFBO0FBQ2lCLElBQUEseUJBQUEsU0FBQSxTQUFBLG9FQUFBO0FBQUEsTUFBQSw0QkFBQSxHQUFBO0FBQUEsWUFBQSxTQUFBLDRCQUFBLENBQUE7QUFBQSxhQUFBLDBCQUFTLE9BQUEsZUFBQSxDQUFnQjtJQUFBLENBQUE7QUFBMUYsSUFBQSwyQkFBQSxFQUE4Rjs7OztBQUF6RixJQUFBLHdCQUFBO0FBQUEsSUFBQSx5QkFBQSxPQUFBLE9BQUEsWUFBQSwyQkFBQSxFQUFrQixPQUFBLE9BQUEsT0FBQSxTQUFBLGdCQUFBOzs7OztBQUV6QixJQUFBLDZCQUFBLEdBQUEsT0FBQSxFQUFBLEVBQTBGLEdBQUEsR0FBQTtBQUNyRixJQUFBLHFCQUFBLEdBQUEsOENBQUE7QUFBNEMsSUFBQSwyQkFBQTtBQUMvQyxJQUFBLDZCQUFBLEdBQUEsT0FBQSxFQUFBLEVBQTZCLEdBQUEsS0FBQSxFQUFBO0FBQ21ELElBQUEscUJBQUEsR0FBQSxXQUFBO0FBQVMsSUFBQSwyQkFBQTtBQUN2RixJQUFBLDZCQUFBLEdBQUEsS0FBQSxFQUFBO0FBQXdELElBQUEscUJBQUEsR0FBQSxlQUFBO0FBQWEsSUFBQSwyQkFBQSxFQUFJLEVBQ3JFOzs7O0FBRkQsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSx5QkFBQSxRQUFBLE9BQUEsWUFBQSwyQkFBQTtBQUNBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEseUJBQUEsUUFBQSxPQUFBLFlBQUEsMkJBQUE7Ozs7O0FBc0JYLElBQUEsNkJBQUEsR0FBQSxPQUFBLEVBQUEsRUFBeUQsR0FBQSxJQUFBO0FBQ25ELElBQUEscUJBQUEsR0FBQSwyQkFBQTtBQUF5QixJQUFBLDJCQUFBO0FBQzdCLElBQUEsNkJBQUEsR0FBQSxHQUFBLEVBQUcsR0FBQSxRQUFBO0FBQ08sSUFBQSxxQkFBQSxDQUFBO0FBQXdFLElBQUEsMkJBQUE7QUFDaEYsSUFBQSxxQkFBQSxDQUFBO0FBQ0YsSUFBQSwyQkFBQSxFQUFJOzs7O0FBRk0sSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxnQ0FBQSxPQUFBLE9BQUEsaUJBQUEsY0FBQSxjQUFBLGNBQUE7QUFDUixJQUFBLHdCQUFBO0FBQUEsSUFBQSxpQ0FBQSxZQUFBLE9BQUEsT0FBQSxpQkFBQSxTQUFBLEdBQUE7Ozs7O0FBSUosSUFBQSw2QkFBQSxHQUFBLE9BQUEsRUFBQSxFQUEwRCxHQUFBLElBQUE7QUFDcEQsSUFBQSxxQkFBQSxHQUFBLDJCQUFBO0FBQXlCLElBQUEsMkJBQUE7QUFDN0IsSUFBQSw2QkFBQSxHQUFBLEdBQUE7QUFBRyxJQUFBLHFCQUFBLEdBQUEsOENBQUE7QUFBNEMsSUFBQSwyQkFBQSxFQUFJOzs7OztBQU9qRCxJQUFBLDZCQUFBLEdBQUEsS0FBQSxFQUFBO0FBQW9HLElBQUEscUJBQUEsR0FBQSx5QkFBQTtBQUF1QixJQUFBLDJCQUFBOzs7OztBQStCekgsSUFBQSw2QkFBQSxHQUFBLFVBQUEsRUFBQTtBQUFzRSxJQUFBLHFCQUFBLENBQUE7QUFBa0IsSUFBQSwyQkFBQTs7OztBQUF6QyxJQUFBLHlCQUFBLFNBQUEsVUFBQSxLQUFBO0FBQXVCLElBQUEsd0JBQUE7QUFBQSxJQUFBLGdDQUFBLFVBQUEsS0FBQTs7Ozs7QUF3QzVFLElBQUEsNkJBQUEsR0FBQSxPQUFBLEVBQUE7QUFBa0QsSUFBQSxxQkFBQSxDQUFBO0FBQWUsSUFBQSwyQkFBQTs7OztBQUFmLElBQUEsd0JBQUE7QUFBQSxJQUFBLGdDQUFBLE9BQUEsU0FBQTs7Ozs7QUFDbEQsSUFBQSw2QkFBQSxHQUFBLE9BQUEsRUFBQTtBQUFxRCxJQUFBLHFCQUFBLENBQUE7QUFBaUIsSUFBQSwyQkFBQTs7OztBQUFqQixJQUFBLHdCQUFBO0FBQUEsSUFBQSxnQ0FBQSxPQUFBLFdBQUE7Ozs7O0FBVWpELElBQUEsNkJBQUEsR0FBQSxLQUFBLEVBQUE7QUFBbUQsSUFBQSxxQkFBQSxDQUFBO0FBQThCLElBQUEsMkJBQUE7Ozs7QUFBOUIsSUFBQSx3QkFBQTtBQUFBLElBQUEsaUNBQUEsV0FBQSxXQUFBLFNBQUE7Ozs7O0FBTnJELElBQUEsNkJBQUEsR0FBQSxPQUFBLEVBQUEsRUFBd0gsR0FBQSxPQUFBLEVBQUEsRUFDNUYsR0FBQSxRQUFBLEVBQUE7QUFDRyxJQUFBLHFCQUFBLENBQUE7QUFBa0IsSUFBQSwyQkFBQTtBQUM3QyxJQUFBLDZCQUFBLEdBQUEsUUFBQSxFQUFBO0FBQStCLElBQUEscUJBQUEsQ0FBQTtBQUFzQixJQUFBLDJCQUFBLEVBQU87QUFFOUQsSUFBQSw2QkFBQSxHQUFBLEdBQUE7QUFBRyxJQUFBLHFCQUFBLENBQUE7QUFBZ0MsSUFBQSwyQkFBQTtBQUNuQyxJQUFBLHlCQUFBLEdBQUEseURBQUEsR0FBQSxHQUFBLEtBQUEsRUFBQTtBQUNGLElBQUEsMkJBQUE7Ozs7O0FBUDJFLElBQUEseUJBQUEsV0FBQSxPQUFBLHdCQUFBLFVBQUEsQ0FBQTtBQUU1QyxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLGdDQUFBLFdBQUEsSUFBQTtBQUNJLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsV0FBQSxRQUFBO0FBRTlCLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsZ0NBQUEsT0FBQSxrQkFBQSxVQUFBLENBQUE7QUFDQyxJQUFBLHdCQUFBO0FBQUEsSUFBQSx5QkFBQSxRQUFBLFdBQUEsU0FBQTs7Ozs7QUFSUixJQUFBLDZCQUFBLEdBQUEsT0FBQSxFQUFBLEVBQWtFLEdBQUEsSUFBQTtBQUM1RCxJQUFBLHFCQUFBLEdBQUEsK0JBQUE7QUFBNkIsSUFBQSwyQkFBQTtBQUNqQyxJQUFBLHlCQUFBLEdBQUEscURBQUEsR0FBQSxHQUFBLE9BQUEsRUFBQTtBQVFGLElBQUEsMkJBQUE7Ozs7QUFSZ0QsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSx5QkFBQSxXQUFBLE9BQUEsT0FBQSxpQkFBQTs7Ozs7QUFjOUMsSUFBQSw2QkFBQSxHQUFBLE9BQUEsRUFBQSxFQUFrRCxHQUFBLEtBQUE7QUFDM0MsSUFBQSxxQkFBQSxDQUFBO0FBQW9ELElBQUEsMkJBQUEsRUFBTTs7OztBQUExRCxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLGdDQUFBLE9BQUEsT0FBQSxXQUFBLDRCQUFBOzs7Ozs7QUFoSlgsSUFBQSw2QkFBQSxHQUFBLE9BQUEsQ0FBQSxFQUF1RCxHQUFBLE9BQUEsQ0FBQSxFQUMxQixHQUFBLFNBQUEsQ0FBQSxFQUNJLEdBQUEsSUFBQTtBQUN2QixJQUFBLHFCQUFBLEdBQUEsa0JBQUE7QUFBZ0IsSUFBQSwyQkFBQTtBQUNwQixJQUFBLHlCQUFBLEdBQUEsOENBQUEsR0FBQSxHQUFBLE9BQUEsRUFBQSxFQUFnRCxHQUFBLDhDQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUEsRUFHRSxHQUFBLDhDQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUE7QUFVcEQsSUFBQSwyQkFBQTtBQUVBLElBQUEsNkJBQUEsR0FBQSxPQUFBLEVBQUEsRUFBNEIsR0FBQSxPQUFBLEVBQUEsRUFDTixJQUFBLEtBQUEsRUFDakIsSUFBQSxJQUFBO0FBQ0MsSUFBQSxxQkFBQSxFQUFBO0FBQTZDLElBQUEsMkJBQUE7QUFDakQsSUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBQTtBQUFnQixJQUFBLHFCQUFBLEVBQUE7QUFBcUMsSUFBQSwyQkFBQSxFQUFJO0FBRTNELElBQUEsNkJBQUEsSUFBQSxLQUFBLEVBQUE7QUFBK0UsSUFBQSxxQkFBQSxJQUFBLGdCQUFBO0FBQWMsSUFBQSwyQkFBQSxFQUFJO0FBR25HLElBQUEsNkJBQUEsSUFBQSxPQUFBLEVBQUEsRUFBaUMsSUFBQSxVQUFBLEVBQUE7QUFDbUQsSUFBQSx5QkFBQSxTQUFBLFNBQUEsa0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFTLE9BQUEsZ0JBQUEsQ0FBaUI7SUFBQSxDQUFBO0FBQzFHLElBQUEscUJBQUEsRUFBQTtBQUNGLElBQUEsMkJBQUE7QUFDQSxJQUFBLDZCQUFBLElBQUEsS0FBQSxFQUFBO0FBQTJELElBQUEscUJBQUEsSUFBQSxlQUFBO0FBQWEsSUFBQSwyQkFBQTtBQUN4RSxJQUFBLDZCQUFBLElBQUEsS0FBQSxFQUFBO0FBQTBELElBQUEscUJBQUEsSUFBQSxjQUFBO0FBQVksSUFBQSwyQkFBQSxFQUFJO0FBRzVFLElBQUEseUJBQUEsSUFBQSwrQ0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLEVBQXlELElBQUEsK0NBQUEsR0FBQSxHQUFBLE9BQUEsRUFBQTtBQWF6RCxJQUFBLDZCQUFBLElBQUEsUUFBQSxFQUFBO0FBQTJDLElBQUEseUJBQUEsWUFBQSxTQUFBLG1FQUFBO0FBQUEsTUFBQSw0QkFBQSxHQUFBO0FBQUEsWUFBQSxTQUFBLDRCQUFBO0FBQUEsYUFBQSwwQkFBWSxPQUFBLGdCQUFBLENBQWlCO0lBQUEsQ0FBQTtBQUN0RSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQThCLElBQUEsU0FBQSxFQUFBO0FBQ0osSUFBQSxxQkFBQSxJQUFBLFlBQUE7QUFBVSxJQUFBLDJCQUFBO0FBQ2xDLElBQUEsd0JBQUEsSUFBQSxTQUFBLEVBQUE7QUFBbUMsSUFBQSw4QkFBQTtBQUNuQyxJQUFBLHlCQUFBLElBQUEsNkNBQUEsR0FBQSxHQUFBLEtBQUEsRUFBQTtBQUNGLElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ1MsSUFBQSxxQkFBQSxJQUFBLGNBQUE7QUFBWSxJQUFBLDJCQUFBO0FBQ3RDLElBQUEsd0JBQUEsSUFBQSxTQUFBLEVBQUE7QUFBcUMsSUFBQSw4QkFBQTtBQUN2QyxJQUFBLDJCQUFBO0FBRUEsSUFBQSw2QkFBQSxJQUFBLE9BQUEsRUFBQSxFQUFtQixJQUFBLFNBQUEsRUFBQTtBQUNXLElBQUEscUJBQUEsSUFBQSxnQkFBQTtBQUFjLElBQUEsMkJBQUE7QUFDMUMsSUFBQSx3QkFBQSxJQUFBLFNBQUEsRUFBQTtBQUF1QyxJQUFBLDhCQUFBO0FBQ3pDLElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ1MsSUFBQSxxQkFBQSxJQUFBLGNBQUE7QUFBWSxJQUFBLDJCQUFBO0FBQ3RDLElBQUEsd0JBQUEsSUFBQSxTQUFBLEVBQUE7QUFBcUMsSUFBQSw4QkFBQTtBQUN2QyxJQUFBLDJCQUFBO0FBRUEsSUFBQSw2QkFBQSxJQUFBLE9BQUEsRUFBQSxFQUFtQixJQUFBLFNBQUEsRUFBQTtBQUNJLElBQUEscUJBQUEsSUFBQSxTQUFBO0FBQU8sSUFBQSwyQkFBQTtBQUM1QixJQUFBLHdCQUFBLElBQUEsU0FBQSxFQUFBO0FBQWdDLElBQUEsOEJBQUE7QUFDbEMsSUFBQSwyQkFBQTtBQUVBLElBQUEsNkJBQUEsSUFBQSxPQUFBLEVBQUEsRUFBbUIsSUFBQSxTQUFBLEVBQUE7QUFDSyxJQUFBLHFCQUFBLElBQUEsVUFBQTtBQUFRLElBQUEsMkJBQUE7QUFDOUIsSUFBQSx3QkFBQSxJQUFBLFNBQUEsRUFBQTtBQUFpQyxJQUFBLDhCQUFBO0FBQ25DLElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ2EsSUFBQSxxQkFBQSxJQUFBLGtCQUFBO0FBQWdCLElBQUEsMkJBQUE7QUFDOUMsSUFBQSw2QkFBQSxJQUFBLFVBQUEsRUFBQTtBQUNFLElBQUEseUJBQUEsSUFBQSxrREFBQSxHQUFBLEdBQUEsVUFBQSxFQUFBO0FBQ0YsSUFBQSwyQkFBQTtBQUY4QixJQUFBLDhCQUFBO0FBR2hDLElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ0ssSUFBQSxxQkFBQSxJQUFBLFVBQUE7QUFBUSxJQUFBLDJCQUFBO0FBQzlCLElBQUEsNkJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBZ0YsSUFBQSx5QkFBQSxRQUFBLFNBQUEsZ0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFRLE9BQUEsbUJBQW1CLFVBQVUsQ0FBQztJQUFBLENBQUE7QUFBdEgsSUFBQSwyQkFBQTtBQUFxRCxJQUFBLDhCQUFBO0FBQ3ZELElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ0EsSUFBQSxxQkFBQSxJQUFBLFNBQUE7QUFBTyxJQUFBLDJCQUFBO0FBQ3hCLElBQUEsNkJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBc0UsSUFBQSx5QkFBQSxRQUFBLFNBQUEsZ0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFRLE9BQUEsbUJBQW1CLEtBQUssQ0FBQztJQUFBLENBQUE7QUFBdkcsSUFBQSwyQkFBQTtBQUFnRCxJQUFBLDhCQUFBO0FBQ2xELElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ0EsSUFBQSxxQkFBQSxJQUFBLFNBQUE7QUFBTyxJQUFBLDJCQUFBO0FBQ3hCLElBQUEsNkJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBc0UsSUFBQSx5QkFBQSxRQUFBLFNBQUEsZ0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFRLE9BQUEsbUJBQW1CLEtBQUssQ0FBQztJQUFBLENBQUE7QUFBdkcsSUFBQSwyQkFBQTtBQUFnRCxJQUFBLDhCQUFBO0FBQ2xELElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ0EsSUFBQSxxQkFBQSxJQUFBLFNBQUE7QUFBTyxJQUFBLDJCQUFBO0FBQ3hCLElBQUEsNkJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBc0UsSUFBQSx5QkFBQSxRQUFBLFNBQUEsZ0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFRLE9BQUEsbUJBQW1CLEtBQUssQ0FBQztJQUFBLENBQUE7QUFBdkcsSUFBQSwyQkFBQTtBQUFnRCxJQUFBLDhCQUFBO0FBQ2xELElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ0EsSUFBQSxxQkFBQSxJQUFBLFNBQUE7QUFBTyxJQUFBLDJCQUFBO0FBQ3hCLElBQUEsNkJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBc0UsSUFBQSx5QkFBQSxRQUFBLFNBQUEsZ0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFRLE9BQUEsbUJBQW1CLEtBQUssQ0FBQztJQUFBLENBQUE7QUFBdkcsSUFBQSwyQkFBQTtBQUFnRCxJQUFBLDhCQUFBO0FBQ2xELElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ0EsSUFBQSxxQkFBQSxJQUFBLGVBQUE7QUFBYSxJQUFBLDJCQUFBO0FBQzlCLElBQUEsNkJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBc0UsSUFBQSx5QkFBQSxRQUFBLFNBQUEsZ0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFRLE9BQUEsbUJBQW1CLEtBQUssQ0FBQztJQUFBLENBQUE7QUFBdkcsSUFBQSwyQkFBQTtBQUFnRCxJQUFBLDhCQUFBO0FBQ2xELElBQUEsMkJBQUE7QUFFQSxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQW1CLElBQUEsU0FBQSxFQUFBO0FBQ0UsSUFBQSxxQkFBQSxJQUFBLE9BQUE7QUFBSyxJQUFBLDJCQUFBO0FBQ3hCLElBQUEsNkJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBMEUsSUFBQSx5QkFBQSxRQUFBLFNBQUEsZ0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFRLE9BQUEsbUJBQW1CLE9BQU8sQ0FBQztJQUFBLENBQUE7QUFBN0csSUFBQSwyQkFBQTtBQUFrRCxJQUFBLDhCQUFBO0FBQ3BELElBQUEsMkJBQUEsRUFBTTtBQUdSLElBQUEseUJBQUEsSUFBQSwrQ0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLEVBQWtELElBQUEsK0NBQUEsR0FBQSxHQUFBLE9BQUEsRUFBQSxFQUNHLElBQUEsK0NBQUEsR0FBQSxHQUFBLE9BQUEsRUFBQTtBQWNyRCxJQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQXVCLElBQUEsVUFBQSxFQUFBO0FBQ3lCLElBQUEseUJBQUEsU0FBQSxTQUFBLGtFQUFBO0FBQUEsTUFBQSw0QkFBQSxHQUFBO0FBQUEsWUFBQSxTQUFBLDRCQUFBO0FBQUEsYUFBQSwwQkFBQSxPQUFBLG1CQUFBLENBQUEsT0FBQSxnQkFBQTtJQUFBLENBQUE7QUFDNUMsSUFBQSxxQkFBQSxFQUFBO0FBQ0YsSUFBQSwyQkFBQTtBQUNBLElBQUEseUJBQUEsSUFBQSwrQ0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBO0FBR0YsSUFBQSwyQkFBQTtBQUVBLElBQUEsNkJBQUEsSUFBQSxPQUFBLEVBQUEsRUFBb0MsSUFBQSxVQUFBLEVBQUE7QUFDZ0QsSUFBQSx5QkFBQSxTQUFBLFNBQUEsa0VBQUE7QUFBQSxNQUFBLDRCQUFBLEdBQUE7QUFBQSxZQUFBLFNBQUEsNEJBQUE7QUFBQSxhQUFBLDBCQUFTLE9BQUEsZ0JBQUEsQ0FBaUI7SUFBQSxDQUFBO0FBQzFHLElBQUEscUJBQUEsRUFBQTtBQUNGLElBQUEsMkJBQUE7QUFDQSxJQUFBLDZCQUFBLElBQUEsS0FBQSxFQUFBO0FBQStFLElBQUEscUJBQUEsSUFBQSxnQkFBQTtBQUFjLElBQUEsMkJBQUE7QUFDN0YsSUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBQTtBQUEyRCxJQUFBLHFCQUFBLElBQUEsZUFBQTtBQUFhLElBQUEsMkJBQUE7QUFDeEUsSUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBQTtBQUEwRCxJQUFBLHFCQUFBLEtBQUEsY0FBQTtBQUFZLElBQUEsMkJBQUEsRUFBSSxFQUN0RSxFQUNFLEVBQ0o7Ozs7QUF6SjRCLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEseUJBQUEsUUFBQSxPQUFBLFlBQUE7QUFHQSxJQUFBLHdCQUFBO0FBQUEsSUFBQSx5QkFBQSxRQUFBLE9BQUEsY0FBQTtBQUdHLElBQUEsd0JBQUE7QUFBQSxJQUFBLHlCQUFBLFFBQUEsT0FBQSxpQkFBQSxDQUFBLE9BQUEsZ0JBQUEsQ0FBQSxPQUFBLGNBQUE7QUFZM0IsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxpQ0FBQSxXQUFBLE9BQUEsT0FBQSxTQUFBLGdCQUFBO0FBQ1ksSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSxpQ0FBQSxpQkFBQSxPQUFBLE9BQUEsU0FBQSxFQUFBO0FBRWYsSUFBQSx3QkFBQTtBQUFBLElBQUEseUJBQUEsY0FBQSw4QkFBQSxJQUFBQyxNQUFBLE9BQUEsT0FBQSxTQUFBLEVBQUEsQ0FBQTtBQUkyQyxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHlCQUFBLFlBQUEsT0FBQSxVQUFBLE9BQUEsS0FBQSxPQUFBO0FBQzVDLElBQUEsd0JBQUE7QUFBQSxJQUFBLGlDQUFBLEtBQUEsT0FBQSxTQUFBLGNBQUEsb0JBQUEsR0FBQTtBQUVDLElBQUEsd0JBQUE7QUFBQSxJQUFBLHlCQUFBLFFBQUEsT0FBQSxlQUFBLDJCQUFBO0FBQ0EsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSx5QkFBQSxRQUFBLE9BQUEsY0FBQSwyQkFBQTtBQUdxQixJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHlCQUFBLFFBQUEsT0FBQSxPQUFBLGdCQUFBO0FBUUEsSUFBQSx3QkFBQTtBQUFBLElBQUEseUJBQUEsUUFBQSxDQUFBLE9BQUEsT0FBQSxnQkFBQTtBQUtwQixJQUFBLHdCQUFBO0FBQUEsSUFBQSx5QkFBQSxhQUFBLE9BQUEsSUFBQTtBQUdpQyxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBO0FBQy9CLElBQUEsd0JBQUE7QUFBQSxJQUFBLHlCQUFBLFFBQUEsT0FBQSxLQUFBLFNBQUEsV0FBQSxXQUFBLE9BQUEsS0FBQSxTQUFBLFdBQUEsT0FBQTtBQUtpQyxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBO0FBS0UsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSx3QkFBQTtBQUtGLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7QUFLTCxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBO0FBS0MsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSx3QkFBQTtBQUtILElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7QUFDRCxJQUFBLHdCQUFBO0FBQUEsSUFBQSx5QkFBQSxXQUFBLE9BQUEsZUFBQTtBQU13QixJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBO0FBS0wsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSx3QkFBQTtBQUtBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7QUFLQSxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBO0FBS0EsSUFBQSx3QkFBQSxDQUFBO0FBQUEsSUFBQSx3QkFBQTtBQUtBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7QUFLRSxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBO0FBSWhELElBQUEsd0JBQUE7QUFBQSxJQUFBLHlCQUFBLFFBQUEsT0FBQSxTQUFBO0FBQ0EsSUFBQSx3QkFBQTtBQUFBLElBQUEseUJBQUEsUUFBQSxPQUFBLFdBQUE7QUFFaUIsSUFBQSx3QkFBQTtBQUFBLElBQUEseUJBQUEsUUFBQSxPQUFBLE9BQUEsa0JBQUEsU0FBQSxDQUFBO0FBY25CLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEsaUNBQUEsS0FBQSxPQUFBLG1CQUFBLHNCQUFBLHFCQUFBLEdBQUE7QUFFd0IsSUFBQSx3QkFBQTtBQUFBLElBQUEseUJBQUEsUUFBQSxPQUFBLGdCQUFBO0FBTW9CLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEseUJBQUEsWUFBQSxPQUFBLFVBQUEsT0FBQSxLQUFBLE9BQUE7QUFDNUMsSUFBQSx3QkFBQTtBQUFBLElBQUEsaUNBQUEsS0FBQSxPQUFBLFNBQUEsY0FBQSxvQkFBQSxHQUFBO0FBRUMsSUFBQSx3QkFBQTtBQUFBLElBQUEseUJBQUEsY0FBQSw4QkFBQSxJQUFBQSxNQUFBLE9BQUEsT0FBQSxTQUFBLEVBQUEsQ0FBQTtBQUNBLElBQUEsd0JBQUEsQ0FBQTtBQUFBLElBQUEseUJBQUEsUUFBQSxPQUFBLGVBQUEsMkJBQUE7QUFDQSxJQUFBLHdCQUFBLENBQUE7QUFBQSxJQUFBLHlCQUFBLFFBQUEsT0FBQSxjQUFBLDJCQUFBOzs7QUFvVlAsSUFBTywwQkFBUCxNQUFPLHlCQUF1QjtFQTJCZjtFQUNBO0VBQ0E7RUFDQTtFQTdCVixhQUF5QjtFQUN6QixrQkFBMEU7SUFDakYsRUFBRSxPQUFPLFdBQVcsT0FBTyxVQUFTO0lBQ3BDLEVBQUUsT0FBTyxpQkFBaUIsT0FBTyxpQkFBZ0I7SUFDakQsRUFBRSxPQUFPLGdCQUFnQixPQUFPLHFCQUFpQjtJQUNqRCxFQUFFLE9BQU8sbUJBQW1CLE9BQU8sbUJBQWtCOztFQUd2RCxTQUFtQztFQUNuQyxVQUFVO0VBQ1YsU0FBUztFQUNULFlBQVk7RUFDWixZQUFZO0VBQ1osY0FBYztFQUNkLG1CQUFtQjtFQUNuQixnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLGFBQWE7RUFDYixpQkFBeUM7RUFDekMsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixnQkFBZ0I7RUFFUDtFQUVULFlBQ21CLGlCQUNBLE9BQ0EsSUFDQSxXQUF1QjtBQUh2QixTQUFBLGtCQUFBO0FBQ0EsU0FBQSxRQUFBO0FBQ0EsU0FBQSxLQUFBO0FBQ0EsU0FBQSxZQUFBO0FBRWpCLFNBQUssT0FBTyxLQUFLLEdBQUcsTUFBTTtNQUN4QixZQUFZLEtBQUssR0FBRyxZQUFZLFFBQVEsSUFBSSxDQUFDLFdBQVcsUUFBUSxDQUFDO01BQ2pFLGNBQWMsS0FBSyxHQUFHLFlBQVksUUFBUSxFQUFFO01BQzVDLGdCQUFnQixLQUFLLEdBQUcsWUFBWSxRQUFRLEVBQUU7TUFDOUMsY0FBYyxLQUFLLEdBQUcsWUFBWSxRQUFRLEVBQUU7TUFDNUMsU0FBUyxLQUFLLEdBQUcsWUFBWSxRQUFRLEVBQUU7TUFDdkMsVUFBVSxLQUFLLEdBQUcsWUFBWSxRQUFRLE9BQU8sQ0FBQyxXQUFXLFFBQVEsQ0FBQztNQUNsRSxVQUFVLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRTtNQUN4QyxLQUFLLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRTtNQUNuQyxLQUFLLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRTtNQUNuQyxLQUFLLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRTtNQUNuQyxLQUFLLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRTtNQUNuQyxLQUFLLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRTtNQUNuQyxPQUFPLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRTtNQUNyQyxrQkFBa0IsS0FBSyxHQUFHLFlBQVksUUFBK0IsU0FBUztLQUMvRTtFQUNIO0VBRUEsV0FBUTtBQUNOLFNBQUssTUFBTSxPQUFPLFVBQVUsQ0FBQyxXQUFVO0FBQ3JDLFlBQU0sS0FBSyxPQUFPLElBQUk7QUFDdEIsVUFBSSxJQUFJO0FBQ04sYUFBSyxXQUFXLEVBQUU7TUFDcEI7SUFDRixDQUFDO0VBQ0g7RUFFQSxXQUFXLElBQVU7QUFDbkIsU0FBSyxVQUFVO0FBQ2YsU0FBSyxZQUFZO0FBQ2pCLFNBQUssWUFBWTtBQUNqQixTQUFLLGNBQWM7QUFDbkIsU0FBSyxhQUFhO0FBQ2xCLFNBQUssaUJBQWlCO0FBQ3RCLFNBQUssZUFBZTtBQUNwQixTQUFLLGlCQUFpQjtBQUN0QixTQUFLLGdCQUFnQjtBQUVyQixhQUFTO01BQ1AsUUFBUSxLQUFLLGdCQUFnQixrQkFBa0IsRUFBRTtNQUNqRCxTQUFTLEtBQUssZ0JBQWdCLFdBQVcsRUFBRSxFQUFFLEtBQUtDLFlBQVcsTUFBTUMsSUFBRyxFQUFFLFNBQVMsR0FBRSxDQUFFLENBQUMsQ0FBQztLQUN4RixFQUFFLFVBQVU7TUFDWCxNQUFNLENBQUMsRUFBRSxRQUFRLFFBQU8sTUFBTTtBQUM1QixlQUFPLFVBQVUsT0FBTyxXQUFXLFFBQVEsV0FBVztBQUN0RCxhQUFLLFNBQVM7QUFDZCxhQUFLLGdCQUFnQixLQUFLLGdCQUFnQixpQkFBaUIsT0FBTyxTQUFTLEVBQUU7QUFDN0UsYUFBSyxlQUFlLEtBQUssZ0JBQWdCLGdCQUFnQixPQUFPLFNBQVMsRUFBRTtBQUMzRSxhQUFLLGFBQWEsS0FBSyxnQkFBZ0IsbUJBQW1CLE9BQU8sU0FBUyxFQUFFO0FBQzVFLGFBQUssaUJBQWlCLEtBQUssVUFBVSwrQkFBK0IsS0FBSyxVQUFVO0FBQ25GLGNBQU0sZUFBZSxPQUFPLFNBQVMsZUFBZSxJQUFJLFlBQVc7QUFDbkUsYUFBSyxlQUFlLFlBQVksU0FBUyxpQkFBaUI7QUFDMUQsYUFBSyxpQkFBaUIsWUFBWSxXQUFXLFFBQVE7QUFDckQsYUFBSyxnQkFBZ0I7QUFDckIsYUFBSyxvQkFBb0IsTUFBTTtBQUMvQixhQUFLLFVBQVU7TUFDakI7TUFDQSxPQUFPLE1BQUs7QUFDVixhQUFLLFVBQVU7QUFDZixhQUFLLFlBQVk7TUFDbkI7S0FDRDtFQUNIO0VBRUEsa0JBQWU7QUFDYixRQUFJLENBQUMsS0FBSyxRQUFRO0FBQ2hCO0lBQ0Y7QUFFQSxRQUFJLEtBQUssS0FBSyxTQUFTO0FBQ3JCLFdBQUssS0FBSyxpQkFBZ0I7QUFDMUI7SUFDRjtBQUVBLFNBQUssU0FBUztBQUNkLFNBQUssWUFBWTtBQUNqQixTQUFLLGNBQWM7QUFFbkIsVUFBTSxVQUFVLEtBQUssbUJBQWtCO0FBQ3ZDLFNBQUssZ0JBQWdCLHNCQUFzQixLQUFLLE9BQU8sU0FBUyxJQUFJLE9BQU8sRUFBRSxVQUFVO01BQ3JGLE1BQU0sQ0FBQyxrQkFBaUI7QUFDdEIsYUFBSyxTQUFTO0FBQ2QsYUFBSyxvQkFBb0IsYUFBYTtBQUN0QyxhQUFLLFNBQVM7QUFDZCxhQUFLLGNBQWM7TUFDckI7TUFDQSxPQUFPLENBQUMsUUFBTztBQUNiLGFBQUssU0FBUztBQUNkLGFBQUssWUFBWSxLQUFLLGdCQUFnQixHQUFHO01BQzNDO0tBQ0Q7RUFDSDtFQUVBLG1CQUFtQixhQUF5RTtBQUMxRixVQUFNLFVBQVUsS0FBSyxLQUFLLFNBQVMsV0FBVztBQUM5QyxVQUFNLFNBQVMsS0FBSyxXQUFXLFFBQVEsS0FBSztBQUU1QyxRQUFJLFdBQVcsTUFBTTtBQUNuQixjQUFRLFNBQVMsUUFBUSxNQUFNLEtBQUksQ0FBRTtBQUNyQztJQUNGO0FBRUEsWUFBUSxTQUFTLE9BQU8sUUFBUSxDQUFDLENBQUM7RUFDcEM7RUFFQSxrQkFBa0IsU0FBNkI7QUFDN0MsUUFBSSxLQUFLLGVBQWUsUUFBUSxRQUFRLFdBQVc7QUFDakQsYUFBTyxRQUFRO0lBQ2pCO0FBRUEsV0FBTyxRQUFRO0VBQ2pCO0VBRUEsd0JBQXdCLFNBQTZCO0FBQ25ELFVBQU0sV0FBVyxRQUFRLFNBQVMsWUFBVztBQUU3QyxRQUFJLFNBQVMsU0FBUyxPQUFPLEtBQUssU0FBUyxTQUFTLFVBQVUsS0FBSyxTQUFTLFNBQVMsTUFBTSxHQUFHO0FBQzVGLGFBQU87SUFDVDtBQUVBLFFBQUksU0FBUyxTQUFTLFNBQVMsS0FBSyxTQUFTLFNBQVMsUUFBUSxHQUFHO0FBQy9ELGFBQU87SUFDVDtBQUVBLFdBQU87RUFDVDtFQUVBLGlCQUFjO0FBQ1osU0FBSyxnQkFBZ0I7RUFDdkI7RUFFUSxvQkFBb0IsUUFBeUI7QUFDbkQsVUFBTSxTQUFTLE9BQU87QUFFdEIsU0FBSyxLQUFLLFNBQVM7TUFDakIsWUFBWSxRQUFRLGNBQWM7TUFDbEMsY0FBYyxRQUFRLGdCQUFnQjtNQUN0QyxnQkFBZ0IsUUFBUSxrQkFBa0I7TUFDMUMsY0FBYyxLQUFLLGlCQUFpQixRQUFRLFlBQVk7TUFDeEQsU0FBUyxLQUFLLGlCQUFpQixRQUFRLE9BQU87TUFDOUMsVUFBVSxRQUFRLFlBQVk7TUFDOUIsVUFBVSxLQUFLLG9CQUFvQixRQUFRLFFBQVE7TUFDbkQsS0FBSyxLQUFLLG9CQUFvQixRQUFRLEdBQUc7TUFDekMsS0FBSyxLQUFLLG9CQUFvQixRQUFRLEdBQUc7TUFDekMsS0FBSyxLQUFLLG9CQUFvQixRQUFRLEdBQUc7TUFDekMsS0FBSyxLQUFLLG9CQUFvQixRQUFRLEdBQUc7TUFDekMsS0FBSyxLQUFLLG9CQUFvQixRQUFRLEdBQUc7TUFDekMsT0FBTyxLQUFLLG9CQUFvQixRQUFRLEtBQUs7TUFDN0Msa0JBQWtCLEtBQUssd0JBQXdCLE9BQU8sd0JBQXdCO0tBQy9FO0VBQ0g7RUFFUSxxQkFBa0I7QUFDeEIsVUFBTSxRQUFRLEtBQUssS0FBSyxZQUFXO0FBRW5DLFdBQU87TUFDTCxZQUFZLEtBQUssa0JBQWtCLE1BQU0sVUFBVTtNQUNuRCxjQUFjLEtBQUssa0JBQWtCLE1BQU0sWUFBWTtNQUN2RCxnQkFBZ0IsS0FBSyxrQkFBa0IsTUFBTSxjQUFjO01BQzNELGNBQWMsS0FBSyxrQkFBa0IsTUFBTSxZQUFZO01BQ3ZELFNBQVMsS0FBSyxrQkFBa0IsTUFBTSxPQUFPO01BQzdDLFVBQVUsS0FBSyxrQkFBa0IsTUFBTSxRQUFRLEdBQUcsWUFBVyxLQUFNO01BQ25FLFVBQVUsS0FBSyxXQUFXLE1BQU0sUUFBUTtNQUN4QyxLQUFLLEtBQUssV0FBVyxNQUFNLEdBQUc7TUFDOUIsS0FBSyxLQUFLLFdBQVcsTUFBTSxHQUFHO01BQzlCLEtBQUssS0FBSyxXQUFXLE1BQU0sR0FBRztNQUM5QixLQUFLLEtBQUssV0FBVyxNQUFNLEdBQUc7TUFDOUIsS0FBSyxLQUFLLFdBQVcsTUFBTSxHQUFHO01BQzlCLE9BQU8sS0FBSyxXQUFXLE1BQU0sS0FBSztNQUNsQyxrQkFBa0IsTUFBTTs7RUFFNUI7RUFFUSxpQkFBaUIsT0FBcUI7QUFDNUMsUUFBSSxDQUFDLE9BQU87QUFDVixhQUFPO0lBQ1Q7QUFFQSxRQUFJLE1BQU0sVUFBVSxJQUFJO0FBQ3RCLGFBQU8sTUFBTSxNQUFNLEdBQUcsRUFBRTtJQUMxQjtBQUVBLFdBQU87RUFDVDtFQUVRLG9CQUFvQixPQUFxQjtBQUMvQyxRQUFJLE9BQU8sVUFBVSxVQUFVO0FBQzdCLGFBQU87SUFDVDtBQUVBLFdBQU8sTUFBTSxRQUFRLENBQUM7RUFDeEI7RUFFUSxXQUFXLE9BQWE7QUFDOUIsVUFBTSxhQUFhLE1BQU0sS0FBSSxFQUFHLFFBQVEsT0FBTyxFQUFFLEVBQUUsUUFBUSxLQUFLLEdBQUc7QUFDbkUsUUFBSSxDQUFDLFlBQVk7QUFDZixhQUFPO0lBQ1Q7QUFFQSxVQUFNLFNBQVMsT0FBTyxVQUFVO0FBQ2hDLFFBQUksT0FBTyxNQUFNLE1BQU0sR0FBRztBQUN4QixhQUFPO0lBQ1Q7QUFFQSxXQUFPLEtBQUssTUFBTSxTQUFTLEdBQUcsSUFBSTtFQUNwQztFQUVRLGtCQUFrQixPQUFhO0FBQ3JDLFVBQU0sYUFBYSxNQUFNLEtBQUk7QUFDN0IsV0FBTyxXQUFXLFNBQVMsSUFBSSxhQUFhO0VBQzlDO0VBRVEsd0JBQXdCLE9BQWE7QUFDM0MsUUFBSSxVQUFVLG1CQUFtQixVQUFVLGtCQUFrQixVQUFVLHFCQUFxQixVQUFVLFdBQVc7QUFDL0csYUFBTztJQUNUO0FBRUEsV0FBTztFQUNUO0VBRVEsZ0JBQWdCLEtBQVk7QUFDbEMsUUFBSSxPQUFPLFFBQVEsWUFBWSxJQUFJLEtBQUksRUFBRyxTQUFTLEdBQUc7QUFDcEQsYUFBTztJQUNUO0FBRUEsUUFBSSxPQUFPLE9BQU8sUUFBUSxVQUFVO0FBQ2xDLFlBQU0sUUFBUTtBQUVkLFVBQUksT0FBTyxNQUFNLFVBQVUsWUFBWSxNQUFNLE1BQU0sS0FBSSxFQUFHLFNBQVMsR0FBRztBQUNwRSxlQUFPLE1BQU07TUFDZjtBQUVBLFVBQUksTUFBTSxTQUFTLE9BQU8sTUFBTSxVQUFVLFVBQVU7QUFDbEQsY0FBTSxVQUFXLE1BQU0sTUFBZ0M7QUFDdkQsWUFBSSxPQUFPLFlBQVksWUFBWSxRQUFRLEtBQUksRUFBRyxTQUFTLEdBQUc7QUFDNUQsaUJBQU87UUFDVDtNQUNGO0FBRUEsVUFBSSxPQUFPLE1BQU0sWUFBWSxZQUFZLE1BQU0sUUFBUSxLQUFJLEVBQUcsU0FBUyxHQUFHO0FBQ3hFLGVBQU8sTUFBTTtNQUNmO0lBQ0Y7QUFFQSxXQUFPO0VBQ1Q7O3FDQXBSVywwQkFBdUIsZ0NBQUEsZUFBQSxHQUFBLGdDQUFBLGtCQUFBLEdBQUEsZ0NBQUEsZUFBQSxHQUFBLGdDQUFBLGdCQUFBLENBQUE7RUFBQTs2RUFBdkIsMEJBQXVCLFdBQUEsQ0FBQSxDQUFBLHFCQUFBLENBQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxHQUFBLFFBQUEsQ0FBQSxDQUFBLEdBQUEsV0FBQSxHQUFBLENBQUEsU0FBQSxXQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxhQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxrQkFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxHQUFBLENBQUEsR0FBQSxXQUFBLEdBQUEsQ0FBQSxjQUFBLGNBQUEsR0FBQSxPQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsZ0JBQUEsR0FBQSxDQUFBLEdBQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxTQUFBLGlCQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxvQkFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsZ0JBQUEsR0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLENBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLE9BQUEsaUJBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxHQUFBLFdBQUEsYUFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsT0FBQSxlQUFBLEdBQUEsU0FBQSxVQUFBLEdBQUEsQ0FBQSxZQUFBLElBQUEsR0FBQSxPQUFBLGVBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxTQUFBLGVBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxZQUFBLFdBQUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxZQUFBLEdBQUEsQ0FBQSxPQUFBLFlBQUEsR0FBQSxDQUFBLE1BQUEsY0FBQSxRQUFBLFFBQUEsbUJBQUEsWUFBQSxHQUFBLENBQUEsU0FBQSxlQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsR0FBQSxPQUFBLEdBQUEsQ0FBQSxPQUFBLGNBQUEsR0FBQSxDQUFBLE1BQUEsZ0JBQUEsUUFBQSxRQUFBLG1CQUFBLGNBQUEsR0FBQSxDQUFBLE9BQUEsZ0JBQUEsR0FBQSxDQUFBLE1BQUEsa0JBQUEsUUFBQSxRQUFBLG1CQUFBLGdCQUFBLEdBQUEsQ0FBQSxPQUFBLGNBQUEsR0FBQSxDQUFBLE1BQUEsZ0JBQUEsUUFBQSxRQUFBLG1CQUFBLGNBQUEsR0FBQSxDQUFBLE9BQUEsU0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLFFBQUEsUUFBQSxtQkFBQSxTQUFBLEdBQUEsQ0FBQSxPQUFBLFVBQUEsR0FBQSxDQUFBLE1BQUEsWUFBQSxRQUFBLFFBQUEsbUJBQUEsWUFBQSxhQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsa0JBQUEsR0FBQSxDQUFBLE1BQUEsb0JBQUEsbUJBQUEsa0JBQUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxHQUFBLFNBQUEsU0FBQSxHQUFBLENBQUEsT0FBQSxVQUFBLEdBQUEsQ0FBQSxNQUFBLFlBQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxtQkFBQSxZQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxtQkFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxtQkFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxtQkFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxtQkFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxtQkFBQSxPQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLFNBQUEsUUFBQSxRQUFBLGFBQUEsV0FBQSxtQkFBQSxTQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsU0FBQSxzQkFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLFNBQUEsdUJBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxTQUFBLFlBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLFdBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxHQUFBLE9BQUEsZUFBQSxHQUFBLE9BQUEsR0FBQSxDQUFBLFNBQUEsZUFBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxnQkFBQSxHQUFBLENBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxTQUFBLG9CQUFBLEdBQUEsU0FBQSxLQUFBLEdBQUEsQ0FBQSxHQUFBLFNBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxHQUFBLGtCQUFBLEdBQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxVQUFBLFVBQUEsT0FBQSxZQUFBLEdBQUEsT0FBQSxlQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxH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QUEsZUFBQSxjQUFBLHFCQUFBLEtBQUEsSUFBQSxDQUFBO0FBQUEsR0FBQSxPQUFBLGNBQUEsZUFBQSxlQUFBLFlBQUEsT0FBQSxZQUFBLElBQUEsR0FBQSw0QkFBQSxPQUFBLEVBQUEsT0FBQSxNQUFBLHFCQUFBLEVBQUEsU0FBQSxDQUFBO0FBQUEsR0FBQTs7O0FUTnpCLHFCQUFxQixjQUFjLFNBQVMsRUFDekMsTUFBTSxDQUFDLFFBQVEsUUFBUSxNQUFNLEdBQUcsQ0FBQzsiLCJuYW1lcyI6WyJpMCIsIkNvbXBvbmVudCIsIkNvbW1vbk1vZHVsZSIsIlJvdXRlck1vZHVsZSIsIkluamVjdGFibGUiLCJDb21tb25Nb2R1bGUiLCJSb3V0ZXJNb2R1bGUiLCJDb21wb25lbnQiLCJpMCIsImkzIiwiaTIiLCJDb21wb25lbnQiLCJDb21tb25Nb2R1bGUiLCJSb3V0ZXJNb2R1bGUiLCJfYzAiLCJDb21tb25Nb2R1bGUiLCJSb3V0ZXJNb2R1bGUiLCJDb21wb25lbnQiLCJpMCIsImk0IiwiaTIiLCJpMyIsIkNvbXBvbmVudCIsIkNvbW1vbk1vZHVsZSIsIlJvdXRlck1vZHVsZSIsImNhdGNoRXJyb3IiLCJvZiIsIl9jMCIsImNhdGNoRXJyb3IiLCJvZiIsIkNvbW1vbk1vZHVsZSIsIlJvdXRlck1vZHVsZSIsIkNvbXBvbmVudCIsImkwIiwiaTIiLCJpMyIsImk0IiwiQ29tcG9uZW50IiwiUm91dGVyT3V0bGV0IiwiaTAiXX0=