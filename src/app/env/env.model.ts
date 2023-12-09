export interface Env {
  baseUrl: string;
  authLoginUrl: string;
  authLogoutUrl: string;
  authCodeUrl: string;
  authClientId: string;
  authClientSecret?: string;
  authCallbackUrl: string;
  authNonce?: boolean;
  authChallenge?: boolean;
  authScope: string;
  authAuthorizationResponseType: string;
  authAuthorizationSecretKey?: boolean;
  authParamsType?: string;
  authBasicAuthorization?: boolean;
  authSendClientIdClientSecret?: boolean;
  validationJsonMode: boolean;
  disableRefresh: boolean;
  version: string;

  defaultPaginationSize: number;

  defaultPaginationSizeOptions: Array<number>;
}
