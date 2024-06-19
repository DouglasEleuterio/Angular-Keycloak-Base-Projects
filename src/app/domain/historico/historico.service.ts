import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Historico } from './historico.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { QueryBuilder } from '../../core/api/select/select';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService extends BaseActiveService<Historico, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'historico');
  }

  fetchSelect<U>(query: QueryBuilder<Historico>): Observable<U> {
    const params: Record<string, string> = query.build();
    return this.http.get<U>(`${this.getBaseUrl()}/select`, {
      params: params
    });
  }
}
