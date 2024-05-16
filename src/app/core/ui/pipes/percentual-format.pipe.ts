import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentualFormat',
  pure: true
})
export class PercentualFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value + ' %';
  }
}
