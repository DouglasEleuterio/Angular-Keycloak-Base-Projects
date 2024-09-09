import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'versaoPipe' })
export class VersaoPipe implements PipeTransform {
  transform(value: string): string {
    if (value == null || value === '') {
      return 'Valor não obtido';
    }
    return `v [${value}.0]`;
  }
}
