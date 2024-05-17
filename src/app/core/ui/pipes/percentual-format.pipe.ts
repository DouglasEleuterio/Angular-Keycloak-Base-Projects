import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentualFormat',
  pure: true
})
export class PercentualFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      return '0';
    }
    return value + ' %';
  }
}
