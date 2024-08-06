import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Evento } from './evento';
import { ConfirmarAgendamento } from '../agendamento/confirmaragendamento.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService extends BaseActiveService<Evento, number> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'evento');
  }

  confirmarAgendamento(eventoId: number, entity: ConfirmarAgendamento): Observable<any> {
    return this.http.post(`${this.envService.environment.baseUrl}/confirmaragendamento/${eventoId}`, entity);
  }
}
