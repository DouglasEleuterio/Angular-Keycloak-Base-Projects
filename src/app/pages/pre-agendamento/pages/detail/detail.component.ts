import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Evento } from '../../../../domain/pre-agendamento/evento';
import { EventoService } from '../../../../domain/pre-agendamento/evento.service';
import { CalendarComponent } from '../../../fullcalendar/calendar/calendar.component';
import { INITIAL_EVENTS } from '../../../fullcalendar/event-utils';
import { EventChangeArg, EventClickArg } from '@fullcalendar/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  visible: boolean;

  @ViewChild('calendar')
  calendar: CalendarComponent;

  public entity: Evento;
  private id: number;

  menuBack: AppMenuItem = AppMenuModel.itemPreAgendamento;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private service: EventoService
  ) {}

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
    }
  }

  /*
   * Ao carregar a página, buscar todos agendamentos confirmados.
   * Navegar para data do evento clicado.
   */
  handlePageLoaded() {
    const calendarApi = this.calendar.getFullCalendar().getApi();
    const calendarOptions = this.calendar.getFullCalendar().options;
    calendarOptions.events = INITIAL_EVENTS;
    // calendarApi.gotoDate('1996-09-24');
    calendarApi.render();
  }

  handleEventClick($event: EventClickArg) {
    console.log(JSON.stringify($event.event));
    //Chamar a Modal de opções quando clicado no evento.
  }

  handleEventChange($event: EventChangeArg) {
    this.confirmationService.confirm({
      header: 'Alterar Agendamento?',
      message: `<p></p><b>Anterior: </b>Inicio: <i>${new Date($event.oldEvent.startStr).toLocaleString()}</i> Fim: <i>${new Date(
        $event.oldEvent.endStr
      ).toLocaleString()}</i></i></p><p></p><b>Novo: </b>Inicio: <i>${new Date(
        $event.event.startStr
      ).toLocaleString()}</i> Fim: <i></i>${new Date($event.event.endStr).toLocaleString()}</i></p>`,
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento alterado' });
        this.confirmationService.close();
      },
      reject: type => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Alteração não realizada' });
            $event.revert();
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Alteração não realizada' });
            break;
        }
        $event.revert();
        this.confirmationService.close();
      }
    });
  }
}
