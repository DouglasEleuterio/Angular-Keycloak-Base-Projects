import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { cpf } from 'cpf-cnpj-validator';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null || control.value.trim() === '') {
      return null;
    }
    return !cpf.isValid(control.value) ? { cpfInvalid: { value: 'CPF informado é inválido' } } : null;
  };
}
