import { ApiValidationResponse } from './api-validation.response';

export class ApiErrorResponse {
  status: number;
  message: string;
  exception: string;
  stacktrace: string;
  errors: Record<string, Array<string>> | Array<ApiValidationResponse>;
  domainErrors: Array<string>;
  validation: boolean;
}
