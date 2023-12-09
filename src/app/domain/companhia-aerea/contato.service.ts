import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { Contato } from './contato.model';

@Injectable()
export class ContatoService extends BaseActiveService<Contato, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'contato');
  }
}
