import { LogComponent } from '../log/log.component';
import { LogService } from '../../../log/log.service';
import { AlertService } from '../../notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationFormFieldService } from '../validation/field-focus/validation-form-field.service';
import { FormControl, FormGroup } from '@angular/forms';

export abstract class BaseFormComponent extends LogComponent {
  submitted = false;
  sending = false;

  protected constructor(
    protected logService: LogService,
    protected alertService: AlertService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService
  ) {
    super(logService);
  }

  startSending(): void {
    this.sending = true;
    this.submitted = true;
  }

  stopSending(): void {
    this.sending = false;
    this.submitted = false;
  }

  validationError(): void {
    this.alertService.error(
      this.translateService.instant('shared.titles.error'.toUpperCase()),
      this.translateService.instant('shared.msg.invalid_form'.toUpperCase()),
      () => {
        this.validationFormFieldService.goFirst();
      }
    );
  }

  /**
   * Check with control has required validation
   * @param controlName The control name to check existence of required validation
   * @param formGroup The `FormGroup` instance.
   * @returns true for required control
   */
  isRequiredControl(controlName: string, formGroup: FormGroup): boolean {
    const { controls } = formGroup;
    const control = controls[controlName];
    const { validator } = control;
    if (validator) {
      const validation = validator(new FormControl());
      return validation !== null && validation.required === true;
    }
    return false;
  }
}
