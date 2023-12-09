import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'relativeTime',
  pure: true
})
export class RelativeTimePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: Date | string): Date | string {
    if (value) {
      const agoLabel = this.translate.instant('TIMES.AGO');
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) {
        return this.translate.instant('TIMES.JUST_NOW');
      }
      const intervals = {
        ['TIMES.YEAR']: 31536000,
        ['TIMES.MONTH']: 2592000,
        ['TIMES.WEEK']: 604800,
        ['TIMES.DAY']: 86400,
        ['TIMES.HOUR']: 3600,
        ['TIMES.MINUTE']: 60,
        ['TIMES.SECOND']: 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + this.translate.instant(i) + ' ' + agoLabel; // singular (1 day ago)
          } else {
            return counter + ' ' + this.translate.instant(i + 'S') + ' ' + agoLabel; // plural (2 days ago)
          }
        }
      }
    }
    return value;
  }
}
