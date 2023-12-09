import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { PrecoCombustivel } from './preco-combustivel.model';

@Injectable()
export class PrecoCombustivelService extends BaseActiveService<PrecoCombustivel, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'preco-combustivel');
  }
}
