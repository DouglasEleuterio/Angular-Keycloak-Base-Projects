import { FormGroup, Validators } from '@angular/forms';

export class FormUtils {
  public static clearValidators(formGroup: FormGroup, controlsName: string[]): void {
    controlsName.forEach(controlName => {
      formGroup.controls[controlName].clearValidators();
    });
  }

  public static updateValueAndValidity(formGroup: FormGroup, controlsName: string[]): void {
    controlsName.forEach(controlName => {
      formGroup.controls[controlName].updateValueAndValidity();
    });
  }

  public static requiredValidators(formGroup: FormGroup, controlsName: string[]): void {
    controlsName.forEach(controlName => {
      formGroup.controls[controlName].setValidators([Validators.required]);
    });
  }

  public static setValueNull(formGroup: FormGroup, controlsName: string[]): void {
    controlsName.forEach(controlName => {
      formGroup.controls[controlName].setValue(null);
    });
  }

  public static enableControls(formGroup: FormGroup, controlsName: string[]): void {
    controlsName.forEach(controlName => {
      formGroup.controls[controlName].enable();
    });
  }

  public static disableControls(formGroup: FormGroup, controlsName: string[]): void {
    controlsName.forEach(controlName => {
      formGroup.controls[controlName].disable();
    });
  }
}
