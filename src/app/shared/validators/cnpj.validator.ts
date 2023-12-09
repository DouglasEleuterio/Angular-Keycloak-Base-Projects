import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { cnpj } from 'cpf-cnpj-validator';

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null || control.value.trim() === '') {
      return null;
    }
    return !cnpj.isValid(control.value) ? { cnpjInvalid: { value: 'CNPJ informado é inválido' } } : null;
  };
}
