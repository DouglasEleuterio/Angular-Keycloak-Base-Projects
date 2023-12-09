import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { IndenizacaoTransporte } from './indenizacao-transporte.model';

@Injectable()
export class IndenizacaoTransporteService extends BaseActiveService<IndenizacaoTransporte, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'indenizacao-transporte');
  }
}
