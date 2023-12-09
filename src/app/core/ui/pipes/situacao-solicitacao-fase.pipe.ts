import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { situacaoSolicitacaoFaseOptionsStatic } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.static';

@Pipe({ name: 'situacaoSolicitacaoFase' })
export class SituacaoSolicitacaoFasePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string): string {
    const label = situacaoSolicitacaoFaseOptionsStatic.find(x => x.value === value)?.label;
    return label === undefined ? '' : label;
  }
}
