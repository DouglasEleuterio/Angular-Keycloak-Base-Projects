import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'simNaoPipe' })
export class SimNaoPipe implements PipeTransform {
  transform(value: boolean) {
    if (value === undefined || value === null) {
      return '';
    }

    return value ? 'Sim' : 'Não';
  }
}
