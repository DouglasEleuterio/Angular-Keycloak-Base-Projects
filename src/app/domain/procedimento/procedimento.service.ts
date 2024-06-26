import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Procedimento } from './procedimento-model';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService extends BaseActiveService<Procedimento, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'procedimento');
  }
}
