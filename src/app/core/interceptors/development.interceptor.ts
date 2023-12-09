import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class DevelopmentInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(responseValue => {
        if (!environment.production && responseValue.type === HttpEventType.Sent) {
          // eslint-disable-next-line no-console
          console.log(`Enviando uma requisição para a api: ${request.url}`);
        }
        if (!environment.production && responseValue.type === HttpEventType.Response) {
          responseValue.headers.get('');
          // eslint-disable-next-line no-console
          console.log(`Servidor respondeu com sucesso, ${request.url}`, responseValue);
        }
      }),
      catchError(error => {
        if (!environment.production) {
          // eslint-disable-next-line no-console
          console.error(`Tivemos um error no servidor ${request.url}`, error);
        }
        return throwError(error);
      })
    );
  }
}
