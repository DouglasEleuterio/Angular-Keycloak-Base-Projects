import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Evento } from '../../../../domain/pre-agendamento/evento';
import { EventoService } from '../../../../domain/pre-agendamento/evento.service';
import { CalendarComponent } from '../../../fullcalendar/calendar/calendar.component';
import { Calendar, DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DataUtils } from '../../../../shared/util/data.utils';
import { BaseController } from '../../../../core/domain/base.controller';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { Filter } from '../../../../core/api/filter/filter.model';

@Component({
  selector: 'app-agendamento-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends PaginatorComponent implements OnInit {
  calendarApi: Calendar;
  @ViewChild('calendar')
  calendar: CalendarComponent;
  public entity: Evento;

  id: number;

  menuBack: AppMenuItem = AppMenuModel.itemAgendamento;

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
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private baseController: BaseController,
    private router: Router,
    private validationService: ValidationService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private service: EventoService
  ) {
    super('PaginationAgendamentoDetail');
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap((params: Params) => (this.id = params.id)),
        switchMap((params: Params) => this.service.get(params.id))
      )
      .subscribe({
        next: entity => this.onLoad(entity),
        error: error => {
          this.router.navigate(this.menuBack.routerLink).then(() => this.validationService.handle(null, error));
        }
      });
  }

  onLoad(entity: Evento): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('pre_agendamento.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      //Configurar Agenda para visualização de Dia.
      //Fazer scroll até horário do agendamento
      this.calendarApi.changeView('dia');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.calendarApi.addEvent({ ...entity });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.calendarApi.gotoDate(DataUtils.formatarDataParaFullcalendar(this.entity.start));
      this.calendarApi.scrollToTime({ hours: DataUtils.obterHoras(this.entity.start), minute: DataUtils.obterMinuto(this.entity.start) });
      this.calendarApi.render();
    }
  }

  /*
   * Ao carregar a página, buscar todos agendamentos confirmados.
   * Navegar para data do evento clicado.
   */
  handlePageLoaded() {
    this.calendarApi = this.calendar.getFullCalendar().getApi();
    this.fetch();
  }

  /**
   * Chamar a modal de laçamento de execução do procedimento
   * @param $event
   */
  handleEventClick($event: EventClickArg) {
    const eventoUpdate = new Evento();
    eventoUpdate.id = Number.parseInt($event.event.id);
    eventoUpdate.start = $event.event.start;
    eventoUpdate.end = $event.event.end;
    eventoUpdate.allDay = $event.event.allDay;
    //Chamar a Modal de opções quando clicado no evento.
    this.confirmationService.confirm({
      header: 'Confirmar Agendamento?',
      message: `Confirmar Agendamento para ${eventoUpdate.start.toLocaleString()}`,
      accept: () => {
        this.service.update(eventoUpdate).subscribe(
          value => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento confirmado' });
            this.confirmationService.close();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Alteração não realizada' });
          }
        );
      },
      reject: type => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Alteração não realizada' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Alteração não realizada' });
            break;
        }
        this.confirmationService.close();
      }
    });
  }

  handleDateSelect($event: DateSelectArg) {
    console.log(`Data selecionada`);
    console.log($event);
  }

  handleEventChange($event: EventChangeArg) {
    const eventoUpdate = new Evento();
    eventoUpdate.id = Number.parseInt($event.event.id);
    eventoUpdate.start = $event.event.start;
    eventoUpdate.end = $event.event.end;
    eventoUpdate.allDay = $event.event.allDay;
    //Chamar a Modal de opções quando clicado no evento.
    this.confirmationService.confirm({
      header: 'Confirmar Agendamento?',
      message: `Confirmar Agendamento para ${eventoUpdate.start.toLocaleString()}`,
      accept: () => {
        this.service.update(eventoUpdate).subscribe(
          value => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento confirmado' });
            this.confirmationService.close();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Alteração não realizada' });
          }
        );
      },
      reject: type => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Alteração não realizada' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Alteração não realizada' });
            break;
        }
        this.confirmationService.close();
        $event.revert();
      }
    });
  }

  fetch(): void {
    this.pagination.filter = new Filter({ search: `situacao==true;confirmado==true` }, null);
    this.pagination.pageSize = null;
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
}
