import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { LocalDificilAcesso } from './local-dificil-acesso.model';

@Injectable()
export class LocalDificilAcessoService extends BaseActiveService<LocalDificilAcesso, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'local-dificil-acesso');
  }
}
