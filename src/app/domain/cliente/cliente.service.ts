import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Cliente } from './cliente';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseActiveService<Cliente, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'cliente');
  }
}
