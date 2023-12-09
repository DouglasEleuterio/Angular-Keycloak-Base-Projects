import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class JsonDateInterceptor implements HttpInterceptor {
  private dateFormat = /^\d{4}-\d{1,2}-\d{1,2}$/;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map(response => {
        if (response instanceof HttpResponse) {
          const responseBody = response.body;
          this.convertToDate(responseBody);
        }
        return response;
      })
    );
  }

  isDate(value: unknown): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string') {
      return this.dateFormat.test(value);
    }
    return false;
  }

  convertToDate(body: unknown): unknown {
    if (body != null && typeof body === 'object') {
      for (const prop of Object.keys(body)) {
        const value = body[prop];
        if (this.isDate(value)) {
          const dnStartDate = new Date(value);
          body[prop] = new Date(dnStartDate.getUTCFullYear(), dnStartDate.getUTCMonth(), dnStartDate.getUTCDate());
        } else if (typeof value === 'object') {
          this.convertToDate(value);
        }
      }
    }
    return body;
  }
}
