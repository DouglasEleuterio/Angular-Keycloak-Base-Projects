import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { Justificativa } from './justificativa.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';

@Injectable()
export class JustificativaService extends BaseActiveService<Justificativa, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'justificativa');
  }
}
