import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Pagination } from '../../core/api/model/pagination';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../core/api/response/api-list.response';
import { ClassificacaoLocalidade } from './classificacao-localidade.model';

@Injectable()
export class ClassificacaoLocalidadeService extends BaseActiveService<ClassificacaoLocalidade, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'classificacao-localidade');
  }

  paginateJsonMapper(pagination: Pagination): Observable<ApiListResponse<ClassificacaoLocalidade>> {
    return this.http.get<ApiListResponse<ClassificacaoLocalidade>>(`${this.getBaseUrl()}/paginate-jsonmapper`, {
      params: pagination.getParams()
    });
  }
}
