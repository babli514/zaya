import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

const localApiInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/')) {
    return next(request);
  }

  const isLocalAngularDev = typeof window !== 'undefined'
    && window.location.hostname === 'localhost'
    && window.location.port === '4200';

  const targetUrl = isLocalAngularDev ? `http://localhost:5268${request.url}` : request.url;
  let headers = request.headers;

  if (isLocalAngularDev && !headers.has('X-API-Key')) {
    headers = headers.set('X-API-Key', 'dev-local-api-key');
  }

  return next(request.clone({
    url: targetUrl,
    headers
  }));
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([localApiInterceptor])),
    provideRouter(routes)
  ]
};
