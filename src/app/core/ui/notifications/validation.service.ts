import { Injectable } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { AlertService } from './alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationFormFieldService } from '../components/validation/field-focus/validation-form-field.service';
import { EnvService } from '../../../env/env.service';
import { plainToClass } from 'class-transformer';
import { ApiBlobResponse } from '../../api/response/api-blob.response';
import { ApiErrorResponse } from '../../api/response/api-error.response';
import { ApiValidationResponse } from '../../api/response/api-validation.response';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
    private validationFormFieldService: ValidationFormFieldService,
    private envService: EnvService
  ) {}

  handle(formGroup: FormGroup, response: ApiErrorResponse | ApiBlobResponse, showAlert = true): void {
    if (response instanceof ApiBlobResponse) {
      const fr = new FileReader();

      fr.onload = e => {
        if (typeof e.target.result === 'string') {
          const error = plainToClass(ApiErrorResponse, JSON.parse(e.target.result));
          this.handleInternal(formGroup, error, showAlert);
        }
      };

      fr.readAsText(response.error);
    } else {
      return this.handleInternal(formGroup, response, showAlert);
    }
  }

  private handleInternal(formGroup: FormGroup, response: ApiErrorResponse, showAlert = true): void {
    if (response.validation) {
      const validationJsonMode = this.envService.environment.validationJsonMode;
      if (response?.errors != null) {
        let firstFieldError = null;
        if (validationJsonMode) {
          firstFieldError = this.verifyJsonModel(formGroup, response);
        } else {
          firstFieldError = this.verifyFieldModel(formGroup, response);
        }
        if (firstFieldError != null) {
          this.alertService.error(
            this.translate.instant('shared.titles.error'.toUpperCase()),
            this.translate.instant('shared.msg.invalid_form'.toUpperCase()),
            () => {
              this.validationFormFieldService.gotId(firstFieldError);
            }
          );
        }
      }
    }
    if (showAlert) {
      this.handleErrorAlert(response);
    }
  }

  handleErrorAlert(response: ApiErrorResponse): void {
    if (response.domainErrors != null && response.domainErrors.length > 0) {
      response.domainErrors.forEach(error => this.alertService.error(this.translate.instant('shared.titles.error'.toUpperCase()), error));
    } else if (response.message) {
      this.alertService.error(this.translate.instant('shared.titles.error'.toUpperCase()), response.message);
    }
  }

  clearForm(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).setErrors(null);
    });
  }

  verifyFieldModel(formGroup: FormGroup, response: ApiErrorResponse): string {
    let firstFieldError = null;
    const errors: Array<ApiValidationResponse> = response?.errors as Array<ApiValidationResponse>;
    errors?.forEach(x => {
      const field = this.getField(x.field);
      if (firstFieldError == null) {
        firstFieldError = field;
      }
      formGroup.get(field)?.setErrors({
        validation: x.message
      });
    });
    return firstFieldError;
  }

  verifyJsonModel(formGroup: FormGroup, response: ApiErrorResponse): string {
    let firstFieldError = null;
    Object.entries(response?.errors).forEach(([field, message]) => {
      if (firstFieldError == null) {
        firstFieldError = field;
      }
      formGroup.get(field)?.setErrors({
        validation: message
      });
    });
    return firstFieldError;
  }

  getField(field: string): string {
    return field.split('.').pop();
  }
}
