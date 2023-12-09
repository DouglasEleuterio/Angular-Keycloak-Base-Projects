import { Pipe, PipeTransform } from '@angular/core';
import { cnpj, cpf } from 'cpf-cnpj-validator';

@Pipe({ name: 'cnpjCpfPipe' })
export class CnpjCpfPipe implements PipeTransform {
  transform(value: string, isCnpj: boolean): string {
    if (value == null || value === '') {
      return 'Valor não informado';
    }
    if (isCnpj) {
      return cnpj.format(value);
    }
    return cpf.format(value);
  }
}
