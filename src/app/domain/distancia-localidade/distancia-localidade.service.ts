import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Pagination } from '../../core/api/model/pagination';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../core/api/response/api-list.response';
import { DistanciaLocalidade } from './distancia-localidades.model';

@Injectable()
export class DistanciaLocalidadeService extends BaseActiveService<DistanciaLocalidade, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'distancia-localidade');
  }

  paginateJsonMapper(pagination: Pagination): Observable<ApiListResponse<DistanciaLocalidade>> {
    return this.http.get<ApiListResponse<DistanciaLocalidade>>(`${this.getBaseUrl()}/paginate-jsonmapper`, {
      params: pagination.getParams()
    });
  }
}
