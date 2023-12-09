import { AuthorizationCodeCallback } from '../model/authorization-code.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LogService } from '../../log/log.service';
import { AuthProvider } from '../auth.provider';
import { AuthToken } from '../model/token.model';
import { AuthUser } from '../model/user.model';
import { EnvService } from '../../../env/env.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthLogout } from '../model/logout.model';
import { JwtHelperService } from '../services/jwt-helper.service';

@Injectable()
export class OauthProvider extends AuthProvider {
  constructor(
    private router: Router,
    private http: HttpClient,
    private logService: LogService,
    private envService: EnvService,
    private jwtHelperService: JwtHelperService
  ) {
    super();
  }

  login(username: string, password: string): Observable<AuthToken> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', this.environment.authClientId);
    body.set('username', username);
    body.set('password', password);

    return this.http.post<AuthToken>(this.environment.authLoginUrl, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  logout(authUser: AuthUser): Observable<AuthLogout> {
    if (authUser != null) {
      const body = new URLSearchParams();
      body.set('id_token', authUser.idToken);
      body.set('refresh_token', authUser.refreshToken);
      return this.http.post<AuthLogout>(this.environment.authLogoutUrl, body.toString(), {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      });
    }
    return of();
  }

  refresh(refreshToken: string): Observable<AuthToken> {
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', this.environment.authClientId);
    body.set('refresh_token', refreshToken);

    return this.http.post<AuthToken>(this.environment.authLoginUrl, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  authorize(): void {
    this.redirectAuthorizationPage().then();
  }

  async redirectAuthorizationPage(): Promise<void> {
    const authNonce = this.environment.authNonce;
    let authAuthorizationResponseType = this.environment.authAuthorizationResponseType;
    const authAuthorizationSecretKey = this.environment.authAuthorizationSecretKey;
    if (authAuthorizationResponseType == null) {
      authAuthorizationResponseType = 'code';
    }

    const payload = new URLSearchParams();
    payload.append('client_id', this.environment.authClientId);
    if (authAuthorizationSecretKey) {
      payload.append('client_secret', this.environment.authClientSecret);
    }

    payload.append('state', uuidv4());

    payload.append('scope', this.environment.authScope);
    payload.append('response_type', authAuthorizationResponseType);
    payload.append('redirect_uri', this.environment.authCallbackUrl);

    if (authNonce) {
      payload.append('nonce', uuidv4());
    }

    payload.append('grant_type', 'authorization_code');
    window.location.href = `${this.environment.authCodeUrl}?${payload.toString()}`;
  }

  public callback(authorizationCode: AuthorizationCodeCallback): Observable<AuthToken> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const payload = new URLSearchParams();

    const authBasicAuthorization = this.environment.authBasicAuthorization;
    const authSendClientIdClientSecret = this.environment.authSendClientIdClientSecret;

    payload.append('grant_type', 'authorization_code');
    payload.append('code', authorizationCode.code);
    payload.append('redirect_uri', this.environment.authCallbackUrl);

    if (authBasicAuthorization === true) {
      const authorizationHeader = btoa(`${this.environment.authClientId}:${this.environment.authClientSecret}`);
      headers = headers.append('Authorization', `Basic ${authorizationHeader}`);
    }

    if (authSendClientIdClientSecret) {
      payload.append('client_id', this.environment.authClientId);
      payload.append('client_secret', this.environment.authClientSecret);
      payload.append('code_verifier', authorizationCode.state);
    }

    return this.http.post<AuthToken>(this.environment.authLoginUrl, payload.toString(), { headers });
  }

  processToken(authToken: AuthToken): AuthUser {
    const jwtToken = this.jwtHelperService.decodeToken(authToken.access_token);
    const sub = jwtToken.sub as string;
    const email = jwtToken.email as string;
    const name = jwtToken.name as string;
    return {
      id: sub,
      email: authToken.email ?? email,
      name: authToken.name ?? name,
      token: authToken.access_token,
      refreshToken: authToken.refresh_token,
      idToken: authToken.id_token,
      permissions: authToken.permissions ?? []
    };
  }

  private get environment() {
    return this.envService.environment;
  }
}
