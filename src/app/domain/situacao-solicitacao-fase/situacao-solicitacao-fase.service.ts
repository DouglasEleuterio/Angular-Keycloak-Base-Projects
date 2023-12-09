import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { SituacaoSolicitacaoFase } from './situacao-solicitacao-fase.model';
import { ApiListResponse } from 'src/app/core/api/response/api-list.response';
import { Pagination } from 'src/app/core/api/model/pagination';
import { Observable } from 'rxjs';

@Injectable()
export class SituacaoSolicitacaoFaseService extends BaseActiveService<SituacaoSolicitacaoFase, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'situacao-solicitacao-fase');
  }

  paginateJsonMapper(pagination: Pagination): Observable<ApiListResponse<SituacaoSolicitacaoFase>> {
    return this.http.get<ApiListResponse<SituacaoSolicitacaoFase>>(`${this.getBaseUrl()}/paginate-jsonmapper`, {
      params: pagination.getParams()
    });
  }
}
