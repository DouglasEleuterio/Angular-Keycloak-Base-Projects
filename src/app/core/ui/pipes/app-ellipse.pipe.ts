import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appEllipse'
})
export class EllipsesPipe implements PipeTransform {
  transform(text: string, size: number): string {
    if (text && text.length > size) {
      return `${text.substr(0, size)}...`;
    }
    return text;
  }
}
