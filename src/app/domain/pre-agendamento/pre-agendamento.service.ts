import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { PreAgendamento } from './pre-agendamento';
import { Observable } from 'rxjs';
import { ListDatas } from '../../pages/pre-agendamento/pages/list/list-datas';

@Injectable({
  providedIn: 'root'
})
export class PreAgendamentoService extends BaseActiveService<PreAgendamento, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'pre-agendamento');
  }

  get(id: string): Observable<PreAgendamento> {
    return ListDatas.getAgendamento(id);
  }
}
