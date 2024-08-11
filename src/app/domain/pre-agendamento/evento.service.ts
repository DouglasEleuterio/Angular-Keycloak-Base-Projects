import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Evento } from './evento';
import { ConfirmarAgendamento } from '../agendamento/confirmaragendamento.model';
import { Observable, of } from 'rxjs';
import { Pagination } from '../../core/api/model/pagination';
import { Calendar } from '@fullcalendar/core';
import { BaseController } from '../../core/domain/base.controller';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class EventoService extends BaseActiveService<Evento, number> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'evento');
  }

  confirmarAgendamento(entity: ConfirmarAgendamento): Observable<any> {
    return this.http.post(`${this.envService.environment.baseUrl}/confirmaragendamento/${entity.id}`, entity);
  }

  public filtrarEventoProProfissional(
    columns: (u: any) => any[],
    pagination: Pagination,
    calendarApi: Calendar,
    baseController: BaseController,
    loadingService: LoadingService,
    eventoAgendar?: Evento
  ): void {
    baseController.fetchSelect(columns, pagination, this, result => {
      calendarApi.removeAllEvents();
      if (result.content.length > 0) {
        result.content.map(value => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          calendarApi.addEvent({ ...value });
        });
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      calendarApi.addEvent(eventoAgendar);
      calendarApi.render();
      loadingService.stopLoading();
    });
  }
}
