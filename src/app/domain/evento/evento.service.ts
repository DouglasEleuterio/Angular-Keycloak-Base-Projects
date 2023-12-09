import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { Evento } from './evento.model';
import { EnvService } from 'src/app/env/env.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiListResponse } from 'src/app/core/api/response/api-list.response';
import { ListIdEventosRequest } from './eventoIds.dto';
import { SituacaoCondicaoEnum } from '../situacao-condicao/situacao-condicao.enum';

@Injectable()
export class EventoService extends BaseActiveService<Evento, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'evento');
  }

  alterarSituacaoCondicao(
    listIdEventosRequest: ListIdEventosRequest,
    situacaoCondicao: SituacaoCondicaoEnum
  ): Observable<ApiListResponse<void>> {
    return this.http.put<ApiListResponse<void>>(`${this.getBaseUrl()}/alterar-condicao-evento/${situacaoCondicao}`, {
      ...listIdEventosRequest
    });
  }
}
