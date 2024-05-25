import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { AuthUser } from '../auth/model/user.model';
import { AlertService } from '../ui/notifications/alert.service';
import { ApiBlobResponse } from '../api/response/api-blob.response';
import { ApiErrorResponse } from '../api/response/api-error.response';
import { EnvService } from '../../env/env.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authenticationService: AuthenticationService, private alertService: AlertService, private router: Router) {}

  intercept(request: HttpRequest<never>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        switch (error.status) {
          case 400:
            return this.handle400Error(error);
          case 403:
            return this.handle403Error(error);
          case 404:
            return this.handle404Error(error);
          case 401:
            return this.handle401Error(request, next, error);
          case 500:
            return this.handle500Error(error);
          default:
            return throwError(error);
        }
      })
    );
  }

  handle401Error(req: HttpRequest<never>, next: HttpHandler, httpError: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshingToken && httpError && httpError.status === 401 && httpError.error && httpError.error.error === 'invalid_grant') {
      return throwError(httpError);
    }

    if (EnvService.env.disableRefresh) {
      this.logout();
    }

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);

      return this.authenticationService.refresh().pipe(
        switchMap((user: AuthUser) => {
          if (user != null && user.refreshToken) {
            this.tokenSubject.next(user.token);
            return next.handle(this.addToken(req, user.token));
          }
          this.logout();
          return throwError(() => httpError);
        }),
        catchError(() => {
          this.logout();
          return throwError(() => httpError);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token));
        })
      );
    }
  }

  addToken(req: HttpRequest<never>, token: string): HttpRequest<never> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  handle400Error(httpError: HttpErrorResponse): Observable<never> {
    if (httpError.error != null) {
      if (httpError.error instanceof Blob) {
        return throwError(() => new ApiBlobResponse(httpError.error));
      } else {
        const apiErrorResponse = plainToClass(ApiErrorResponse, httpError.error);
        apiErrorResponse.status = httpError.status;
        return throwError(() => apiErrorResponse);
      }
    }
    return throwError(() => httpError);
  }

  handle403Error(error: unknown): Observable<never> {
    this.router.navigate(['/errors/403']).then();
    return throwError(() => new Error(`Error ${error}`));
  }

  handle500Error(error: {error: ApiErrorResponse }): Observable<never> {
    this.alertService.error500();
    return throwError(() => new Error(`Error ${error.error.message}`));
  }

  handle404Error(error: unknown): Observable<never> {
    this.alertService.error404();
    return throwError(() => new Error(`Error ${error}`));
  }

  logout(): Observable<never> {
    this.authenticationService.logout();
    location.reload();
    return throwError(() => new Error(`Logout`));
  }
}
