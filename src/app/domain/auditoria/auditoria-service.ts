import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Historico } from '../historico/historico.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Auditoria } from './auditoria.model';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService extends BaseActiveService<Auditoria, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'auditoria');
  }
}
