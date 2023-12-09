export interface AuthorizationCodeCallback {
  code: string;
  scope: string;
  state: string;
  session_state: string;
}
