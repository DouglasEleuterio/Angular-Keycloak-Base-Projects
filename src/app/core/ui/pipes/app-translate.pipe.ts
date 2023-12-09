import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'appTranslate' })
export class AppTranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string, page: string): string {
    if (value == null || value == undefined || value === '') {
      return 'Label não informada';
    }

    return this.translate.instant(page.toUpperCase() + '.' + value.toUpperCase());
  }
}
