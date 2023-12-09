import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Servidor } from './servidor.model';

@Injectable()
export class ServidorService extends BaseActiveService<Servidor, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'servidor');
  }
}
