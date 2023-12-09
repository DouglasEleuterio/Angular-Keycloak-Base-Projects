import { Injectable } from '@angular/core';
import { BaseActiveService } from 'src/app/core/domain/base.active.service';
import { TipoLocalidade } from './tipo-localidade.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env/env.service';

@Injectable()
export class TipoLocalidadeService extends BaseActiveService<TipoLocalidade, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'tipo-localidade');
  }
}
