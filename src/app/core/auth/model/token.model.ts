export interface AuthToken {
  name?: string;
  email?: string;
  responsavel?: string;
  permissions?: Array<string>;
  first_access?: boolean;
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_preference_json: string;
}
