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
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'tabela-valores-monofasico-nf/11048724000121');
  }

  getProdutos(pagination: Pagination): Observable<ApiListResponse<ProdutoIncidenciaMonofasica>> {
    return super.paginate(pagination);
  }
}
