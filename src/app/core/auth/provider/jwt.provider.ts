import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthToken } from '../model/token.model';
import { AuthUser } from '../model/user.model';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth.provider';
import { EnvService } from '../../../env/env.service';
import { AuthorizationCodeCallback } from '../model/authorization-code.model';
import { AuthLogout } from '../model/logout.model';

@Injectable()
export class JwtProvider extends AuthProvider {
  constructor(private http: HttpClient, private envService: EnvService) {
    super();
  }

  login(username: string, password: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.envService.environment.authLoginUrl, { username, password });
  }

  logout(): Observable<AuthLogout> {
    return this.http.post<AuthLogout>(this.envService.environment.authLogoutUrl, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh(refreshToken: string): Observable<AuthToken> {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  processToken(authToken: AuthToken): AuthUser {
    return undefined;
  }

  authorize(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback(authorizationCode: AuthorizationCodeCallback): Observable<AuthToken> {
    throw new Error('Method not implemented.');
  }
}
