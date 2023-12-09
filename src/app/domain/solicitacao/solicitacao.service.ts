import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { Solicitacao } from './solicitacao.model';
import { Observable } from 'rxjs';
import { SolicitacaoAnterior } from './solicitacao-anterior.model';
import { Pagination } from 'src/app/core/api/model/pagination';
import { ApiListResponse } from 'src/app/core/api/response/api-list.response';

@Injectable()
export class SolicitacaoService extends BaseActiveService<Solicitacao, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'solicitacao');
  }

  getSolicitacoesAnteriores(): Observable<SolicitacaoAnterior[]> {
    return this.http.get<SolicitacaoAnterior[]>(`${this.getBaseUrl()}/solicitacoes-anteriores`);
  }

  paginateWithEventos(pagination: Pagination): Observable<ApiListResponse<Solicitacao>> {
    return this.http.get<ApiListResponse<Solicitacao>>(`${this.getBaseUrl()}/solicitacoes-evento`, {
      params: pagination.getParams()
    });
  }
}
