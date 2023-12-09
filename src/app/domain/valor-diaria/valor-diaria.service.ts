import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { ValorDiaria } from './valor-diaria.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';

@Injectable()
export class ValorDiariaService extends BaseActiveService<ValorDiaria, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'valor-diaria');
  }
}
