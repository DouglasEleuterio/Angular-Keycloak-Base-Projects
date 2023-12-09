import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'activeLabelPipe' })
export class ActiveLabelPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: boolean, activeLabel?: string, inactiveLabel?: string): unknown {
    if (value == null) {
      return this.translateService.instant('shared.msg.not_defined'.toUpperCase());
    }
    if (value) {
      return activeLabel != null ? activeLabel : this.translateService.instant('shared.label.active'.toUpperCase());
    }
    if (!value) {
      return activeLabel != null ? inactiveLabel : this.translateService.instant('shared.label.inactive'.toUpperCase());
    }
    return value;
  }
}
