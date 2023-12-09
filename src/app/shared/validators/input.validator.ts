import { AbstractControl, ValidatorFn } from '@angular/forms';

export function espacosVaziosValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const isValid = control.value.trim().length > 0;
    return isValid ? null : { notOnlyWhitespace: true };
  };
}
