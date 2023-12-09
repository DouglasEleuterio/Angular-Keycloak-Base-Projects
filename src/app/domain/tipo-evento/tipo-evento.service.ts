import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoEvento } from './tipo-evento.model';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Pagination } from '../../core/api/model/pagination';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../core/api/response/api-list.response';

@Injectable()
export class TipoEventoService extends BaseActiveService<TipoEvento, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'tipo-evento');
  }

  paginateJsonMapper(pagination: Pagination): Observable<ApiListResponse<TipoEvento>> {
    return this.http.get<ApiListResponse<TipoEvento>>(`${this.getBaseUrl()}/paginate-jsonmapper`, { params: pagination.getParams() });
  }
}
