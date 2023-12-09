import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { AuxilioAlimentacao } from './auxilio-alimentacao.model';

@Injectable()
export class AuxilioAlimentacaoService extends BaseActiveService<AuxilioAlimentacao, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'auxilio-alimentacao');
  }
}
