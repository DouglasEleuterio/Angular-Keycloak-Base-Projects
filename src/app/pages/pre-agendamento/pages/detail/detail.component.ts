import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { PreAgendamento } from '../../../../domain/pre-agendamento/pre-agendamento';
import { PreAgendamentoService } from '../../../../domain/pre-agendamento/pre-agendamento.service';
import { CalendarComponent } from '../../../fullcalendar/calendar/calendar.component';
import { INITIAL_EVENTS } from '../../../fullcalendar/event-utils';
import { EventChangeArg, EventClickArg } from '@fullcalendar/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  visible: boolean;

  @ViewChild('calendar')
  calendar: CalendarComponent;

  titulo: string;

  public entity: PreAgendamento;
  private id: number;

  menuBack: AppMenuItem = AppMenuModel.itemPreAgendamento;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private service: PreAgendamentoService
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

  onLoad(entity: PreAgendamento): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('pre_agendamento.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
    }
  }

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
    console.log('Evento foi modificado.');
    console.log(JSON.stringify($event.oldEvent));
    this.titulo = $event.oldEvent.title;
    this.showDialog();
    // $event.revert();
    //Chamar modal de confirmação quando evento modificado.
    //Caso usuário cancele, chamar $event.revert()
  }

  showDialog() {
    this.visible = true;
  }
}
