import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { TrechoViagem } from './trecho-viagem.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/api/model/pagination';
import { ApiListResponse } from 'src/app/core/api/response/api-list.response';

@Injectable()
export class TrechoViagemService extends BaseActiveService<TrechoViagem, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'trecho-viagem');
  }

  createList(entity: TrechoViagem[]): Observable<TrechoViagem[]> {
    const listaTrechoViagem: TrechoViagem[] = entity;
    return this.http.post<TrechoViagem[]>(`${this.getBaseUrl()}/inserir-lista-trecho-evento`, listaTrechoViagem);
  }

  trocarPosicao(idTrecho: string | number, valorNovaPosicao: number): Observable<void> {
    const request = { posicaoNovaTrechoViagem: valorNovaPosicao };
    return this.http.put<void>(`${this.getBaseUrl()}/alterar-posicao-trecho-viagem/${idTrecho}`, request);
  }

  paginateSolicitacao(pagination: Pagination): Observable<ApiListResponse<TrechoViagem>> {
    return this.http.get<ApiListResponse<TrechoViagem>>(`${this.getBaseUrl()}/trecho-viagem-solicitacao`, {
      params: pagination.getParams()
    });
  }
}
