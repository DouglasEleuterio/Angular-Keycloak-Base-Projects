import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';
import { CompanhiaAerea } from './companhia-aerea.model';

@Injectable()
export class CompanhiaAereaService extends BaseActiveService<CompanhiaAerea, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'companhia-aerea');
  }
}
