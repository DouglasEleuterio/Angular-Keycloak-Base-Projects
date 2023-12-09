import { Injectable } from '@angular/core';
import { ContaBancaria } from './conta-bancaria.model';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContaBancariaService extends BaseActiveService<ContaBancaria, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'conta-bancaria');
  }

  getBancos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.getBaseUrl()}/descricao-bancos`);
  }
}
