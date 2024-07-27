import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { ProcedimentoCreateRequest } from './create/procedimento-create-request-model';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService extends BaseActiveService<ProcedimentoCreateRequest, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'procedimento');
  }
}
