import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../auth/auth.service';
import { EnvService } from '../../env/env.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private envService: EnvService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const loggedUser = this.authenticationService.loggedUser();
    const ignore = this.ignore(request.url);
    if (!ignore && loggedUser && loggedUser.token) {
      if (!request.headers.has('Authorization')) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${loggedUser.token}`
          }
        });
      }
    }
    return next.handle(request);
  }

  private ignore(route: string) {
    return environment.apiWhiteList.some(value => route.endsWith(value));
  }
}
