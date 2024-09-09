import { Injectable } from '@angular/core';
import { Termo } from './termo-model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { BaseActiveService } from '../../core/domain/base.active.service';

@Injectable({
  providedIn: 'root'
})
export class TermoService extends BaseActiveService<Termo, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'termo');
  }
}
