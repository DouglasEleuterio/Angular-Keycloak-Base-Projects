import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthUser } from './model/user.model';
import { AuthToken } from './model/token.model';
import { AuthProvider } from './auth.provider';
import { AuthorizationCodeCallback } from './model/authorization-code.model';
import { AuthLogout } from './model/logout.model';
import { JwtHelperService } from './services/jwt-helper.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private static localStorageKey = 'loggedUser';
  private static urlApi = '/auth';
  private user: AuthUser;

  constructor(
    private authProvider: AuthProvider,
    private jwtHelperService: JwtHelperService,
    private http: HttpClient,
    private envService: EnvService
  ) {}

  loggedUser(): AuthUser {
    return this.user || this.getUser();
  }

  login(username: string, password: string): Observable<AuthUser> {
    return this.authProvider.login(username, password).pipe(
      tap((authToken: AuthToken) => {
        this.processToken(authToken);
      }),
      switchMap(() => of(this.loggedUser()))
    );
  }

  refresh(): Observable<AuthUser> {
    const user = this.loggedUser();
    return this.authProvider.refresh(user?.refreshToken).pipe(
      tap((authToken: AuthToken) => {
        this.processToken(authToken);
      }),
      switchMap(() => of(this.loggedUser()))
    );
  }

  logout(): Observable<AuthLogout> {
    const user: AuthUser = { ...this.loggedUser() };
    this.clear();
    return this.authProvider.logout(user);
  }

  isAuthenticated(): boolean {
    const user = this.loggedUser();
    return !this.jwtHelperService.isTokenExpired(user?.token);
  }

  async isAuthenticatedRefresh(): Promise<boolean> {
    const user = this.loggedUser();
    const tokenExpired = this.jwtHelperService.isTokenExpired(user?.token);
    if (tokenExpired && user.refreshToken) {
      const refreshUser = await firstValueFrom(this.refresh());
      return this.jwtHelperService.isTokenExpired(refreshUser.token);
    }
    return tokenExpired;
  }

  autorize(): void {
    this.authProvider.authorize();
  }

  public callback(authorizationCode: AuthorizationCodeCallback): Observable<AuthUser> {
    return this.authProvider.callback(authorizationCode).pipe(
      tap((authToken: AuthToken) => {
        this.processToken(authToken);
      }),
      switchMap(() => of(this.loggedUser()))
    );
  }

  private setUser(user: AuthUser) {
    this.user = user;
    const userString = JSON.stringify(this.user);
    localStorage.setItem(AuthenticationService.localStorageKey, userString);
  }

  private getUser(): AuthUser {
    const userString = localStorage.getItem(AuthenticationService.localStorageKey);
    return (this.user = JSON.parse(userString));
  }

  private clear() {
    this.user = null;
    localStorage.removeItem(AuthenticationService.localStorageKey);
    Object.entries(localStorage)
      .map(x => x[0])
      .filter(x => x.startsWith('table_'))
      .map(x => localStorage.removeItem(x));
  }

  private processToken(authToken: AuthToken): void {
    this.setUser(this.authProvider.processToken(authToken));
  }

  public checkPermission(checkPermissions: Array<string>): boolean {
    const permissions = checkPermissions.filter(x => x != null);
    if (permissions == null || permissions.length <= 0) {
      return true;
    }
    const userPermissions = this.loggedUser()?.permissions;
    if (userPermissions && userPermissions.length > 0) {
      for (const checkPermission of permissions) {
        const permissionFound = userPermissions.find(x => x.toUpperCase() === checkPermission.toUpperCase());
        if (!permissionFound) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  public logoutRedirect(returnUrl: string, router: Router): boolean {
    this.logout();
    router.navigate(['/account/login'], { queryParams: { returnUrl: returnUrl } }).then();
    return false;
  }
}
