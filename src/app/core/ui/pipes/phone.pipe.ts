import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {
  transform(number: string): string {
    if (!number || !number.length) {
      return '';
    } else if (number && number.length === 10) {
      return `(${number.substr(0, 2)}) ${number.substr(2, 4)}-${number.substr(6, 4)}`;
    } else if (number && number.length === 11) {
      return `(${number.substr(0, 2)}) ${number.substr(2, 5)}-${number.substr(7, 4)}`;
    } else {
      return number;
    }
  }
}
