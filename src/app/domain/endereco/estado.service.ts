import { BaseActiveService } from '../../core/domain/base.active.service';
import { Estado } from './estado.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EstadoService extends BaseActiveService<Estado, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'estado');
  }
}
