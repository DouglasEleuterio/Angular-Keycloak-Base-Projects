import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { HistoricoSituacaoSolicitacao } from './historico-situacao-solicitacao.model';

@Injectable()
export class HistoricoSituacaoSolicitacaoService extends BaseActiveService<HistoricoSituacaoSolicitacao, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'historico-situacao-solicitacao');
  }
}
