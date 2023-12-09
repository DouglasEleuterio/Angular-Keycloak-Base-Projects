import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Exemplo } from './exemplo.model';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Pagination } from '../../core/api/model/pagination';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../core/api/response/api-list.response';

@Injectable()
export class ExemploService extends BaseActiveService<Exemplo, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'exemplos');
  }

  paginateJsonMapper(pagination: Pagination): Observable<ApiListResponse<Exemplo>> {
    return this.http.get<ApiListResponse<Exemplo>>(`${this.getBaseUrl()}/paginate-jsonmapper`, { params: pagination.getParams() });
  }
}
