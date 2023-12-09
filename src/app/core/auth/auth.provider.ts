import { Observable } from 'rxjs';
import { AuthToken } from './model/token.model';
import { AuthorizationCodeCallback } from './model/authorization-code.model';
import { AuthUser } from './model/user.model';
import { AuthLogout } from './model/logout.model';

export abstract class AuthProvider {
  abstract login(username: string, password: string): Observable<AuthToken>;

  abstract refresh(refreshToken: string): Observable<AuthToken>;

  abstract logout(authUser: AuthUser): Observable<AuthLogout>;

  abstract authorize(): void;

  abstract callback(authorizationCode: AuthorizationCodeCallback): Observable<AuthToken>;

  abstract processToken(authToken: AuthToken): AuthUser;
}
