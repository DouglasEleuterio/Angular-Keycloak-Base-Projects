import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { situacaoSolicitacaoOptionsStatic } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.static';

@Pipe({ name: 'situacaoSolicitacao' })
export class SituacaoSolicitacaoPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string): string {
    const label = situacaoSolicitacaoOptionsStatic.find(x => x.value === value)?.label;
    return label === undefined ? '' : label;
  }
}
