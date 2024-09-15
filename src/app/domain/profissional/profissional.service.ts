import { Injectable } from '@angular/core';
import { Profissional } from './profissional.model';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { from } from '../../core/api/select/select';
import { ProcedimentoCreateRequest } from '../procedimento/create/procedimento-create-request-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService extends BaseActiveService<Profissional, number> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'profissional');
  }

  carregarProfissionais(profissionais: Profissional[]) {
    const query = from<ProcedimentoCreateRequest>()
      .select((u: Profissional) => [u.nome, u.id])
      .where(u => u.eq('situacao', 'true'))
      .asc(x => x.nome)
      .getQuery();

    const params: Record<string, string> = query.build();
    this.http
      .get<Profissional[]>(`${this.getBaseUrl()}/select`, {
        params: params
      })
      .subscribe(value => {
        value.forEach(p => profissionais.push(p));
      });
  }

  fetchProfissionais(): Observable<Profissional[]> {
    const query = from<ProcedimentoCreateRequest>()
      .select((u: Profissional) => [u.nome, u.id])
      .where(u => u.eq('situacao', 'true'))
      .asc(x => x.nome)
      .getQuery();

    const params: Record<string, string> = query.build();
    return this.http.get<Profissional[]>(`${this.getBaseUrl()}/select`, {
      params: params
    });
  }
}
