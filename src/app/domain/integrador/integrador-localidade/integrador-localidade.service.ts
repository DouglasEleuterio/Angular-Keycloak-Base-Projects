import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { IntegradorLocalidade } from './integrador-localidade.model';
import { Observable } from 'rxjs';

@Injectable()
export class IntegradorLocalidadeService extends BaseActiveService<IntegradorLocalidade, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'integrador-localidade');
  }

  getLocalidadesByUfAndNome(uf: string, nome: string): Observable<IntegradorLocalidade[]> {
    return this.http.get<IntegradorLocalidade[]>(`${this.getBaseUrl()}/localidades-por-uf-nome`, {
      params: { uf, nome }
    });
  }

  getLocalidadesByUf(uf: string): Observable<IntegradorLocalidade[]> {
    return this.http.get<IntegradorLocalidade[]>(`${this.getBaseUrl()}/localidades-por-uf`, {
      params: { uf }
    });
  }
}
