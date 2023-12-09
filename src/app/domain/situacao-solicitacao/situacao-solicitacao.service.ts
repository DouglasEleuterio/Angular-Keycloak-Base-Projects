import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { SituacaoSolicitacao } from './situacao-solicitacao.model';
import { Observable } from 'rxjs';
import { SituacaoSolicitacaoEnum } from './situacao-solicitacao.enum';

@Injectable()
export class SituacaoSolicitacaoService extends BaseActiveService<SituacaoSolicitacao, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'situacao-solicitacao');
  }

  findSituacaoSolicitacaoByFase(fasesSolicitacaoId: (string | number)[]): Observable<SituacaoSolicitacao[]> {
    const params = { listSituacaoSolicitacaoFase: fasesSolicitacaoId };

    return this.http.get<SituacaoSolicitacao[]>(`${this.getBaseUrl()}/situacao-solicitacao-por-fase`, {
      params
    });
  }

  findSituacaoSolicitacaoByFaseAndSituacaoChave(chaveFase: string, chaveSituacao: string): Observable<SituacaoSolicitacao> {
    return this.http.get<SituacaoSolicitacao>(`${this.getBaseUrl()}/buscar-por-fase-e-situacao-chave`, {
      params: { chaveFase: chaveFase, chaveSituacao: chaveSituacao }
    });
  }
}
