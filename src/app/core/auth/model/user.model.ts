export class AuthUser {
  id: string | number;
  name: string;
  email: string;
  token: string;
  refreshToken: string;
  idToken: string;
  permissions?: string[];
  roles?: string[];
}
