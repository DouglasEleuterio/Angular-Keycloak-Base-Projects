import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Aquisicao } from './aquisicao-model';

@Injectable({
  providedIn: 'root'
})
export class AquisicaoService extends BaseActiveService<Aquisicao, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'aquisicao');
  }
}
