import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Evento } from '../../../../domain/pre-agendamento/evento';
import { CalendarComponent } from '../../../fullcalendar/calendar/calendar.component';
import { Calendar, EventChangeArg, EventClickArg } from '@fullcalendar/core';
import { MessageService } from 'primeng/api';
import { DataUtils } from '../../../../shared/util/data.utils';
import { BaseController } from '../../../../core/domain/base.controller';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { Filter } from '../../../../core/api/filter/filter.model';
import { ProfissionalService } from '../../../../domain/profissional/profissional.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { Profissional } from '../../../../domain/profissional/profissional.model';
import { EventImpl } from '@fullcalendar/core/internal';
import { ConfirmarAgendamento } from '../../../../domain/agendamento/confirmaragendamento.model';
import { plainToClass } from 'class-transformer';
import { AgendamentoService } from '../../../../domain/pre-agendamento/agendamento.service';

@Component({
  selector: 'app-agendamento-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends PaginatorComponent implements OnInit {
  visible: boolean;

  calendarApi: Calendar;
  @ViewChild('calendar')
  calendar: CalendarComponent;
  public entity: Evento;
  id: number;
  profissionais: Profissional[] = [];
  formGroup: FormGroup;

  menuBack: AppMenuItem = AppMenuModel.itemAgendamento;

  eventosFetch = (u: any) => [
    u.id,
    u.allDay,
    u.title,
    u.start,
    u.end,
    u.situacao,
    u.executado,
    u.backgroundColor,
    u.aquisicaoProcedimento.id,
    u.aquisicaoProcedimento.nome,
    u.profissional.id,
    u.profissional.nome,
    u.aquisicaoProcedimento.procedimento,
    u.aquisicaoProcedimento.aquisicao.id,
    u.aquisicaoProcedimento.aquisicao.cliente.id,
    u.aquisicaoProcedimento.aquisicao.cliente.nome
  ];

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private profissionalService: ProfissionalService,
    private loadingService: LoadingService,
    private baseController: BaseController,
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService,
    protected validationFormFieldService: ValidationFormFieldService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private service: AgendamentoService
  ) {
    super('PaginationAgendamentoDetail');
  }

  ngOnInit(): void {
    this.buildFormGroup();
    this.profissionalService.carregarProfissionais(this.profissionais);
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

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      id: null,
      profissional: [null, Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required]
    });
  }

  onLoad(entity: Evento): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('agendamento.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;

      this.calendarApi.changeView('dia');
      this.calendarApi.scrollToTime({
        hours: DataUtils.obterHoras(this.entity.start),
        minute: DataUtils.obterMinuto(this.entity.start)
      });
      this.calendarApi.gotoDate(DataUtils.formatarDataParaFullcalendar(this.entity.start));
      this.calendarApi.render();
    }
  }

  fetch(): void {
    this.loadingService.startLoading();
    this.pagination.filter = new Filter({ search: `situacao==true;executado==false` }, null);
    this.pagination.pageSize = 10000;
    this.baseController.fetchSelect(this.eventosFetch, this.pagination, this.service, result => {
      result.content.map(value => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.calendarApi.addEvent(value);
      });
      this.loadingService.stopLoading();
    });
    this.calendarApi.render();
  }

  submit(): void {
    if (this.formGroup.valid) {
      const entity: ConfirmarAgendamento = plainToClass(ConfirmarAgendamento, this.formGroup.value);
      this.service.alterarAgendamento(entity).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento atualizado' });
          this.visible = false;
        },
        error => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Cancelado',
            detail: `Alteração não realizada: ${error.message}`
          });
        }
      );
    } else {
      this.alertService.error(
        this.translateService.instant('shared.titles.error'.toUpperCase()),
        this.translateService.instant('shared.msg.invalid_form'.toUpperCase()),
        () => {
          this.validationFormFieldService.goFirst();
        }
      );
    }
  }

  //Handlers
  handleEventClick($event: EventClickArg) {
    this.definirAgendamento($event.event);
  }

  handleEventChange($event: EventChangeArg) {
    this.definirAgendamento($event.event);
  }

  /*
   * Ao carregar a página, buscar todos agendamentos confirmados.
   */
  handlePageLoaded() {
    this.calendarApi = this.calendar.getFullCalendar().getApi();
    this.fetch();
  }

  private definirAgendamento(evento: EventImpl) {
    const eventoUpdate = new Evento();
    eventoUpdate.id = Number.parseInt(evento.id);
    eventoUpdate.start = evento.start;
    eventoUpdate.end = evento.end;
    eventoUpdate.allDay = evento.allDay;
    //Chamar a Modal de opções quando clicado no evento.

    this.formGroup.controls['id'].setValue(evento.id);
    this.formGroup.controls['dataInicio'].setValue(evento.start);
    this.formGroup.controls['dataFim'].setValue(evento.end);
    this.formGroup.controls['profissional'].setValue(evento.extendedProps.profissional.id);
    this.visible = true;
  }

  //todo Realizar busca apenas do mês do calendario.
  filtrarPorProfissional($event: number) {
    this.pagination.filter = new Filter({ search: `situacao==true;executado==false;profissional.id==${$event}` }, null);
    this.pagination.pageSize = 10000;
    this.calendarApi.render();
    this.service.filtrarEventoProProfissional(
      this.eventosFetch,
      this.pagination,
      this.calendarApi,
      this.baseController,
      this.loadingService
    );
  }

  //Eventos
  onFimChange($event: Date) {
    this.calendarApi.getEventById(this.entity.id.toString()).setEnd($event);
    this.calendarApi.render();
  }

  onInicioChange($event: Date) {
    this.calendarApi.gotoDate($event);
    this.calendarApi.getEventById(this.entity.id.toString()).setStart($event);
    this.calendarApi.render();
  }

  cancel() {
    this.visible = false;
  }

  onEventoCancelar() {
    this.removerEventoCalendario();
    this.service.cancelarAgendamento(this.formGroup.controls['id'].value).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento cancelado' });
        this.visible = false;
      },
      error => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelado',
          detail: `Alteração não realizada: ${error.message}`
        });
      }
    );
  }

  removerEventoCalendario() {
    const allEvents: EventImpl[] = this.calendarApi.getEvents();
    const idEvents: string[] = this.calendarApi.getEvents().map(value => value.id);
    const eventoSelecionado = this.calendarApi.getEventById(this.formGroup.controls['id'].value);
    const index = idEvents.indexOf(eventoSelecionado.id);
    if (index > -1) {
      allEvents.splice(index, 1);
    }
    this.calendarApi.removeAllEvents();
    this.calendarApi.render();
    allEvents.forEach(value => {
      this.calendarApi.addEvent(value);
    });
    this.calendarApi.render();
  }
}
