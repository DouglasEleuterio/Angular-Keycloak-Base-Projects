import { Injectable } from '@angular/core';
import { TabelaAliquotaDiferenciada } from './tabela-aliquota-diferenciada.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';

@Injectable({
  providedIn: 'root'
})
export class TabelaAliquotaDiferenciadaService extends BaseActiveService<TabelaAliquotaDiferenciada, number> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'tabela-aliquota-diferenciada');
  }
}
