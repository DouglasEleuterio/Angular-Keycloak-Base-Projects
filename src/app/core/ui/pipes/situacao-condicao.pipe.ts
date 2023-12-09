import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { situacaoCondicaoOptionsList } from 'src/app/domain/situacao-condicao/situacao-condicao.static';

@Pipe({ name: 'situacaoCondicao' })
export class SituacaoCondicaoPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string): string {
    value = situacaoCondicaoOptionsList.find(x => x.value === value)?.label;

    return value === undefined ? this.translateService.instant('shared.msg.not_defined'.toUpperCase()) : value;
  }
}
