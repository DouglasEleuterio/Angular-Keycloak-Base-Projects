import { Injectable } from '@angular/core';
import { BaseService } from '../../core/domain/base.service';
import { ProdutoIncidenciaMonofasica } from './produtos-incidencia-monofasica-model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Pagination } from '../../core/api/model/pagination';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../core/api/response/api-list.response';

@Injectable({
  providedIn: 'root'
})
export class ProdutosIncidenciaMonofasicaService extends BaseService<ProdutoIncidenciaMonofasica, string> {
  private cnpj: string | unknown;

  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'tabela-valores-monofasico-nf');
    this.cnpj = '';
  }

  getProdutos(pagination: Pagination): Observable<ApiListResponse<ProdutoIncidenciaMonofasica>> {
    if (pagination.filter?.filters && pagination.filter?.filters?.cnpj) {
      const filters = pagination.filter?.filters;
      this.cnpj = filters.cnpj;
      return this.obtemPorCNPJ(pagination, inicio, fim);
    } else {
      return this.obtemTodos(pagination, inicio, fim);
    }
  }

  obtemPorCNPJ(pagination: Pagination): Observable<ApiListResponse<ProdutoIncidenciaMonofasica>> {
    return this.http.get<ApiListResponse<ProdutoIncidenciaMonofasica>>(`${this.getBaseUrl()}/${this.cnpj}`, {
      params: pagination.getParams()
    });
  }

  obtemTodos(pagination: Pagination): Observable<ApiListResponse<ProdutoIncidenciaMonofasica>> {
    return this.http.get<ApiListResponse<ProdutoIncidenciaMonofasica>>(`${this.getBaseUrl()}`, { params: pagination.getParams() });
  }
}
