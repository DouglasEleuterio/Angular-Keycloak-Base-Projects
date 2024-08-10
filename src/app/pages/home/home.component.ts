import { Component, ViewChild } from '@angular/core';
import { CalendarComponent } from '../fullcalendar/calendar/calendar.component';
import { Calendar, DateSelectArg, EventChangeArg } from '@fullcalendar/core';
import { Filter } from '../../core/api/filter/filter.model';
import { PaginatorComponent } from '../../core/ui/components/pagination/paginator.component';
import { BaseController } from '../../core/domain/base.controller';
import { EventoService } from '../../domain/pre-agendamento/evento.service';
import { LoadingService } from '../../domain/loading/loading.service';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent extends PaginatorComponent {
  @ViewChild('calendar')
  calendar: CalendarComponent;
  calendarApi: Calendar;

  eventosFetch = (u: any) => [
    u.id,
    u.allDay,
    u.title,
    u.start,
    u.end,
    u.situacao,
    u.confirmado,
    u.backgroundColor,
    u.aquisicaoProcedimento.id,
    u.aquisicaoProcedimento.nome,
    u.aquisicaoProcedimento.procedimento,
    u.aquisicaoProcedimento.aquisicao.id,
    u.aquisicaoProcedimento.aquisicao.cliente.id,
    u.aquisicaoProcedimento.aquisicao.cliente.nome
  ];

  constructor(
    private loadingService: LoadingService,
    private messageService: MessageService,
    private baseController: BaseController,
    private service: EventoService
  ) {
    super('PaginationAgenda');
  }

  /*
   * Ao carregar a página, buscar todos agendamentos confirmados.
   * Navegar para data do evento clicado.
   */
  handlePageLoaded() {
    this.calendarApi = this.calendar.getFullCalendar().getApi();
    this.fetch();
  }

  fetch(): void {
    this.pagination.filter = new Filter({ search: `situacao==true;confirmado==true` }, null);
    this.pagination.pageSize = 100000;
    this.baseController.fetchSelect(this.eventosFetch, this.pagination, this.service, result => {
      result.content.map(value => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.calendarApi.addEvent({ ...value });
      });
      this.loadingService.stopLoading();
    });
    this.calendarApi.render();
  }

  handleEventChange($event: EventChangeArg) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cancelado',
      detail: 'Para alterar procedimento, acesse o menu de procedimentos'
    });
    $event.revert();
  }

  handleDateSelect($event: DateSelectArg) {
    this.calendarApi.gotoDate($event.start);
    this.calendarApi.changeView('dia');
  }

  //todo Realiar busca apenas do mês do calendario.
  filtrarPorProfissional($event: number) {
    this.pagination.filter = new Filter({ search: `situacao==true;confirmado==true;profissional.id==${$event}` }, null);
    this.pagination.pageSize = 100000;
    this.calendarApi.render();
    this.service.filtrarEventoProProfissional(
      this.eventosFetch,
      this.pagination,
      this.calendarApi,
      this.baseController,
      this.loadingService
    );
  }
}
