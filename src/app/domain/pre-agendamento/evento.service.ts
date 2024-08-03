import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Evento } from './evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService extends BaseActiveService<Evento, number> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'evento');
  }
/*
  get(id: number): Observable<Evento> {
    return ListDatas.getAgendamento(id);
  }*/
}
