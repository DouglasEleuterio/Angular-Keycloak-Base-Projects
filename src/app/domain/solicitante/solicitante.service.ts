import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { Solicitante } from './solicitante.model';
import { EnvService } from 'src/app/env/env.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoSolicitanteEnum } from '../tipo-solicitante/tipo-solicitante.enum';

@Injectable()
export class SolicitanteService extends BaseActiveService<Solicitante, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'solicitante');
  }

  getSolicitantesByNome(nome: string, tipoSolicitante: TipoSolicitanteEnum): Observable<Solicitante[]> {
    return this.http.get<Solicitante[]>(`${this.getBaseUrl()}/solicitantes-por-nome`, {
      params: { nome, tipoSolicitante }
    });
  }

  getServidores(): Observable<Solicitante[]> {
    return this.http.get<Solicitante[]>(`${this.getBaseUrl()}/solicitantes-servidor`);
  }

  getMagistrados(): Observable<Solicitante[]> {
    return this.http.get<Solicitante[]>(`${this.getBaseUrl()}/solicitantes-magistrado`);
  }
}
