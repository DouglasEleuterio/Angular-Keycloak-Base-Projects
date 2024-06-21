import { BaseActiveService } from '../../core/domain/base.active.service';
import { Cidade } from './cidade.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CidadeService extends BaseActiveService<Cidade, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'cidade');
  }
}
