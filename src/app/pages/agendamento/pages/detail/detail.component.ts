import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ValidationFormFieldService
} from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { Profissional } from '../../../../domain/profissional/profissional.model';
import { EventImpl } from '@fullcalendar/core/internal';
import { ConfirmarAgendamento } from '../../../../domain/agendamento/confirmaragendamento.model';
import { plainToClass } from 'class-transformer';
import { AgendamentoService } from '../../../../domain/pre-agendamento/agendamento.service';
import { ConfirmarAtendimento } from '../../../../domain/atendimento/confirmar-atendimento.model';
import { Layout } from '../../../../shared/editor-component/editor/layout';

@Component({
  selector: 'app-agendamento-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends PaginatorComponent implements OnInit, AfterViewInit {
  modalViewVisible: boolean;
  modalConfirmarVisible: boolean;

  calendarApi: Calendar;
  @ViewChild('calendar')
  calendar: CalendarComponent;
  public entity: Evento;
  id: number;
  profissionais: Profissional[] = [];
  //PickList
  profissionaisDisponiveis: Profissional[] = [];
  profissionaisSelecionado: Profissional[] = [];
  formGroup: FormGroup;
  formGroupConfirmar: FormGroup;

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
    this.buildFormGroupConfirmar();
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

  ngAfterViewInit(): void {
    this.profissionalService.fetchProfissionais().subscribe(value => {
      this.profissionaisDisponiveis = value;
      this.profissionaisDisponiveis = this.profissionaisDisponiveis.splice(
        this.profissionaisDisponiveis.indexOf(this.entity.profissional),
        1
      );
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

  buildFormGroupConfirmar(): void {
    this.formGroupConfirmar = this.formBuilder.group({
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      documento: this.formBuilder.group({
        id: [null],
        conteudo: [null]
      }),
      agendamento: [null],
      profissionais: this.formBuilder.array([])
    });
  }

  get profissionaisForm(): FormArray {
    return this.formGroupConfirmar.get('profissionais') as FormArray;
  }

  onLoad(entity: Evento): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('agendamento.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      //FormGroup
      this.formGroupConfirmar.controls['documento'].get('conteudo').setValue(Layout.tabelaProdutos);
      //Layout padrão de inserção de gasto de material no antendimento;
      this.formGroupConfirmar.controls['agendamento'].setValue(this.entity.id);
      this.formGroupConfirmar.controls['agendamento'].setValue(this.entity.id);
      this.profissionaisForm.value.push(entity.profissional);
      this.profissionaisSelecionado.push(entity.profissional);
      //Calendar
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

  submitConfirmar() {
    if (this.formGroupConfirmar.valid) {
      const entity: ConfirmarAtendimento = plainToClass(ConfirmarAtendimento, this.formGroupConfirmar.value);
      this.service.confirmarAtendimento(entity).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Atendimento salvo' });
          this.modalViewVisible = false;
          this.modalConfirmarVisible = false;
          //Recarregar agendamentos
          this.calendarApi.removeAllEvents();
          this.fetch();
          //
          setTimeout(function () {
            this.router.navigate(this.menuBack.routerLink);
          }, 2000);
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

  submit(): void {
    if (this.formGroup.valid) {
      const entity: ConfirmarAgendamento = plainToClass(ConfirmarAgendamento, this.formGroup.value);
      this.service.alterarAgendamento(entity).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento atualizado' });
          this.modalViewVisible = false;
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
    this.modalViewVisible = true;
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

  cancelView() {
    this.modalViewVisible = false;
  }

  cancelConfirmar() {
    this.modalConfirmarVisible = false;
  }

  onEventoCancelar() {
    this.removerEventoCalendario();
    this.service.cancelarAgendamento(this.formGroup.controls['id'].value).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento cancelado' });
        this.modalViewVisible = false;
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

  onEventoConfirmar() {
    this.modalConfirmarVisible = true;
    this.formGroupConfirmar.controls['dataInicio'].setValue(this.formGroup.controls['dataInicio'].value);
    this.formGroupConfirmar.controls['dataFim'].setValue(this.formGroup.controls['dataFim'].value);
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

  //Adicionar Itens no form group
  onMoveTarget($event: any) {
    const profissionaisEnviados = $event.items;
    const profissionaisInseridos: Profissional[] = this.formGroupConfirmar.controls['profissionais'].value;
    profissionaisEnviados.forEach((value: Profissional) => {
      profissionaisInseridos.push(value);
    });
  }

  //Remover Itens no form group
  onMoveSource($event: any) {
    const profissionais: Profissional[] = this.formGroupConfirmar.controls['profissionais'].value;
    const remanescentes: Profissional[] = [];
    const removidos = $event.items;
    for (let i = 0; i < removidos.length; i++) {
      const index = profissionais.indexOf(removidos[i]);
      profissionais.splice(index, 1);
    }
    this.formGroupConfirmar.controls['profissionais'].setValue(profissionais);
  }
}
