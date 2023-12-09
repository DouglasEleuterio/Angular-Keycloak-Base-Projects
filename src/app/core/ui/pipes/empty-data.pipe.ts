import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'emptyDataPipe' })
export class EmptyDataPipe implements PipeTransform {
  transform(value: unknown, checkEmpty?: boolean): unknown {
    if (value == null || (checkEmpty && value === '')) {
      return 'Valor não informado';
    }
    return value;
  }
}
