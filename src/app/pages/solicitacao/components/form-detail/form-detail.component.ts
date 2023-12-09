import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { situacaoSolicitacaoFaseOptionsStatic } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.static';
import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';

@Component({
  selector: 'app-solicitacao-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss']
})
export class FormDetailComponent implements OnChanges {
  @Input() id: number | string;

  solicitacao: Solicitacao;
  situacoes = situacaoSolicitacaoFaseOptionsStatic;
  activeIndex = 0;

  constructor(private service: SolicitacaoService, private validationService: ValidationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.id && changes.id && changes.id.currentValue) {
      this.getSolicitacao(this.id);
    }
  }

  getSolicitacao(id: number | string): void {
    this.service.get(id.toString()).subscribe({
      next: data => this.setValuesHeader(data),
      error: error => this.validationService.handleErrorAlert(error)
    });
  }

  setValuesHeader(solicitacao: Solicitacao) {
    this.solicitacao = solicitacao;

    const situacao = this.situacoes.find(x => {
      return x.value === solicitacao?.situacaoSolicitacao?.situacaoSolicitacaoFase?.chave;
    });
    const indexSituacao = this.situacoes.indexOf(situacao);
    this.activeIndex = indexSituacao;
  }
}
