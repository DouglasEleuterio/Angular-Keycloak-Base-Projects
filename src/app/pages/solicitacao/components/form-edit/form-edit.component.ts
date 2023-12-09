import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { from } from 'src/app/core/api/select/select';

import { EventoService } from 'src/app/domain/evento/evento.service';
import { Evento } from 'src/app/domain/evento/evento.model';
import { SituacaoCondicaoEnum } from 'src/app/domain/situacao-condicao/situacao-condicao.enum';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { cargosSolicitacaoEdicao } from 'src/app/domain/cargos/cargos.static';

import { FormConfig } from '../form/form.config';
import TimeUtil from 'src/app/shared/util/time.util';
import { TrechoViagem } from 'src/app/domain/trecho-viagem/trecho-viagem.model';
import { TrechoViagemService } from 'src/app/domain/trecho-viagem/trecho-viagem.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { Pagination } from 'src/app/core/api/model/pagination';
import { Filter } from 'src/app/core/api/filter/filter.model';
import { SimNaoEnum } from 'src/app/domain/situacao/simNao.enum';

@Component({
  selector: 'app-solicitacao-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss']
})
export class FormEditComponent extends BaseFormComponent implements OnInit, OnChanges {
  @Input() idSolicitacaoOriginal: number;
  @Input() idSolicitacao: number;
  @Input() isDetail = false;
  @Input() formGroup: FormGroup = null;
  @Input() formConfig: FormConfig = null;
  @Input() submitted: boolean;
  @Input() eventosByEntity: Evento[] = [];
  @Input() eventosBySolicitacaoOriginal: Evento[] = [];

  @Output() onEventosAdicionados: EventEmitter<Evento[]> = new EventEmitter<Evento[]>();

  simNaoOptions = simNaoOptionsList;
  maiorCargoFuncaoList = cargosSolicitacaoEdicao;

  listIdsEventosSolicitacaoOriginal: (string | number)[] = [];

  eventoSelected: Evento;
  listEventosDropDown: Evento[];
  listEventosTable: Evento[] = [];
  listTrechoViagemTable: TrechoViagem[] = [];

  showDescricaoEvento = false;
  showCondicaoEvento = false;
  enableBtnAddEvento = false;

  trechoPosicaoInicial: number;
  trechoPosicaoFinal: number;

  isPernoite = false;
  isBagagem = false;
  isJustificativaBagagem = false;

  @ViewChild('eventoDataInicio') eventoDataInicio!: ElementRef;
  @ViewChild('eventoDataTermino') eventoDataTermino!: ElementRef;
  @ViewChild('eventoNumeroDocumento') eventoNumeroDocumento!: ElementRef;
  @ViewChild('eventoNumeroProcesso') eventoNumeroProcesso!: ElementRef;
  @ViewChild('eventoDescricao', { static: false }) eventoDescricao: ElementRef;
  @ViewChild('eventoCondicao', { static: false }) eventoCondicao: ElementRef;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private eventoService: EventoService,
    private changeDetector: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private trechoViagemService: TrechoViagemService,
    private validationService: ValidationService
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.getEventos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.eventosByEntity?.currentValue) {
      this.setEventos(changes.eventosByEntity.currentValue);
    }
    if (changes.eventosBySolicitacaoOriginal?.currentValue) {
      this.getEventosBySolicitacaoOriginal(changes.eventosBySolicitacaoOriginal.currentValue);
    }
    if (changes.idSolicitacao?.currentValue || changes.idSolicitacaoOriginal?.currentValue) {
      this.getTrechos();
    }
  }

  private getEventos(): void {
    const query = from<Evento>()
      .select((u: Evento) => [u.id, u.nomeEvento])
      .where(x => x.eq('situacaoCondicao', `${SituacaoCondicaoEnum.ABERTO}`))
      .asc(x => x.nomeEvento)
      .getQuery();

    this.eventoService.fetchSelect<Evento[]>(query).subscribe(data => {
      this.listEventosDropDown = data;
      this.removeEventosDropdown();
    });
  }

  private getTrechos(): void {
    if (this.idSolicitacao) {
      const pagination: Pagination = new Pagination();
      pagination.pageSize = 999;
      pagination.sort = [{ field: 'posicaoTrecho', order: 'asc' }];
      pagination.filter = new Filter({ search: `solicitacao.id==${this.idSolicitacao}` }, null);

      this.trechoViagemService.paginateSolicitacao(pagination).subscribe({
        next: data => {
          this.listTrechoViagemTable = data.content;
          this.setPosicoesTrecho(data.content);
          this.checkPernoiteBagagem(data.content);
        }
      });
    }
  }

  setPosicoesTrecho(data: TrechoViagem[]): void {
    data?.map(x => {
      if (!this.trechoPosicaoInicial) {
        this.trechoPosicaoInicial = x.posicaoTrecho;
        this.trechoPosicaoFinal = x.posicaoTrecho;
      }

      if (x.posicaoTrecho < this.trechoPosicaoInicial) {
        this.trechoPosicaoInicial = x.posicaoTrecho;
      }
      if (x.posicaoTrecho > this.trechoPosicaoFinal) {
        this.trechoPosicaoFinal = x.posicaoTrecho;
      }
    });
  }

  private checkPernoiteBagagem(data: TrechoViagem[]) {
    const trechoIda = data.find(x => x.posicaoTrecho === this.trechoPosicaoInicial);
    const trechoVolta = data.find(x => x.posicaoTrecho === this.trechoPosicaoFinal);

    if (trechoIda && trechoVolta) {
      const timeDiff = Math.abs(new Date(trechoVolta.dataPartida).getTime() - new Date(trechoIda.dataPartida).getTime());
      const diasDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const pernoiteCondicao1A = this.formGroup.controls?.solicitacaoOriginal?.value;
      const pernoiteCondicao2A = trechoVolta.localDificilAcessoOrigem;
      const pernoiteCondicao2B = diasDiff !== 0;

      this.isPernoite = pernoiteCondicao1A || pernoiteCondicao2A || pernoiteCondicao2B;
      this.isBagagem = data.find(x => x.utilizaDespachoBagagem === true)?.utilizaDespachoBagagem;
      this.isJustificativaBagagem = this.isBagagem && diasDiff < 2;

      this.formConfig.setControlsValidatorsJustificativaBagagem(this.isJustificativaBagagem);
    } else {
      this.formConfig.setControlsValidatorsJustificativaBagagem(false);
    }
  }

  private getEventosBySolicitacaoOriginal(eventos: Evento[]) {
    this.getEventos();

    if (eventos && eventos.length > 0) {
      this.listIdsEventosSolicitacaoOriginal = eventos.map(x => x.id);
    }
  }

  private setEventos(eventos: Evento[]): void {
    this.listEventosTable = eventos;
    this.removeEventosDropdown();
  }

  private removeEventosDropdown(): void {
    if (this.eventosByEntity?.length > 0 && this.listEventosTable?.length > 0) {
      this.listEventosTable.forEach(elementTable => {
        const evento = this.listEventosDropDown.find(elementDropDown => elementDropDown.id === elementTable.id);
        const index: number = this.listEventosDropDown.indexOf(evento);

        if (index >= 0) {
          this.listEventosDropDown.splice(index, 1);
        }
      });
    }
  }

  onChangeEvento(idEvento: string | number): void {
    if (idEvento) {
      this.eventoService.get(idEvento as string).subscribe(data => this.setValuesEvento(data));
    }
  }

  private setValuesEvento(evento: Evento): void {
    this.eventoSelected = evento;

    this.eventoDataInicio.nativeElement.value = TimeUtil.formattedDateView(evento.dataInicio);
    this.eventoDataTermino.nativeElement.value = TimeUtil.formattedDateView(evento.dataTermino);
    this.eventoNumeroDocumento.nativeElement.value = evento.numeroDocumento;
    this.eventoNumeroProcesso.nativeElement.value = evento.numeroProcesso;
    this.setDescricaoEvento(evento.descricao);
    this.setCondicaoEvento(evento.condicoes);

    this.enableBtnAddEvento = true;
  }

  private setDescricaoEvento(value: string): void {
    if (value) {
      this.showDescricaoEvento = true;
      this.changeDetector.detectChanges();
      this.eventoDescricao.nativeElement.value = value;
    } else {
      this.showDescricaoEvento = false;
    }
  }

  private setCondicaoEvento(value: string): void {
    if (value) {
      this.showCondicaoEvento = true;
      this.changeDetector.detectChanges();
      this.eventoCondicao.nativeElement.value = value;
    } else {
      this.showCondicaoEvento = false;
    }
  }

  addEvento(dropdownEventos: any): void {
    if (this.eventoSelected && this.enableBtnAddEvento) {
      this.listEventosTable.push(this.eventoSelected);

      this.clearEvento();
      this.emitListEventosAdd();
      this.removeEventosDropdown();

      dropdownEventos.clear();
      this.enableBtnAddEvento = false;
    }
  }

  private clearEvento(): void {
    this.eventoDataInicio.nativeElement.value = null;
    this.eventoDataTermino.nativeElement.value = null;
    this.eventoNumeroDocumento.nativeElement.value = null;
    this.eventoNumeroProcesso.nativeElement.value = null;

    if (this.showDescricaoEvento) {
      this.eventoDescricao.nativeElement.value = null;
    }
    if (this.showCondicaoEvento) {
      this.eventoCondicao.nativeElement.value = null;
    }

    this.showDescricaoEvento = false;
    this.showCondicaoEvento = false;
  }

  removeEvento(evento: Evento): void {
    this.confirmationService.confirm({
      message: this.translateService.instant(`solicitacao.message.delete`.toUpperCase()),
      header: this.translateService.instant('shared.titles.delete'.toUpperCase()),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const index = this.listEventosTable.indexOf(evento);
        this.listEventosTable.splice(index, 1);
        this.getEventos();
        this.emitListEventosAdd();
      }
    });
  }

  private emitListEventosAdd(): void {
    this.onEventosAdicionados.emit(this.listEventosTable);
  }

  isDeletableEvento(id: string | number): boolean {
    const idEvento = this.listIdsEventosSolicitacaoOriginal.find(x => x === id);
    const isDeletable = !idEvento;

    return isDeletable;
  }

  get getLabelPerNoite(): string {
    return this.translateService.instant(`solicitacao.message.pernoite_${this.isPernoite ? 'sim' : 'nao'}`.toUpperCase());
  }

  get getLabelBagagem(): string {
    return this.isBagagem ? SimNaoEnum.SIM : SimNaoEnum.NAO;
  }

  removeTrecho(id: string): void {
    this.confirmationService.confirm({
      message: this.translateService.instant(`solicitacao.message.delete`.toUpperCase()),
      header: this.translateService.instant('shared.titles.delete'.toUpperCase()),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trechoViagemService.remove(id).subscribe({
          next: () => {
            this.trechoPosicaoInicial = null;
            this.getTrechos();
            this.alertService.defaultSuccess(this.translateService.instant('solicitacao.message.deleted_success_trecho'.toUpperCase()));
          },
          error: error => this.validationService.handleErrorAlert(error)
        });
      }
    });
  }

  trocarPosicao(isUpButton: boolean, id: string | number): void {
    const listTrechoIdPosicao = this.listTrechoViagemTable.map(x => {
      return { id: x.id, posicaoTrecho: x.posicaoTrecho };
    });

    let posicaoNova: number;
    const posicaoAtual = listTrechoIdPosicao.find(x => x.id === id).posicaoTrecho;

    if (isUpButton) {
      listTrechoIdPosicao.reverse();
      posicaoNova = listTrechoIdPosicao.find(x => posicaoAtual > x.posicaoTrecho).posicaoTrecho;
    } else {
      posicaoNova = listTrechoIdPosicao.find(x => posicaoAtual < x.posicaoTrecho).posicaoTrecho;
    }

    this.trechoViagemService.trocarPosicao(id, posicaoNova).subscribe({
      next: () => this.getTrechos(),
      error: error => this.validationService.handleErrorAlert(error)
    });
  }

  infosComplementaresTrecho(dataInicio: Date, dataFim: Date): string {
    if (dataInicio || dataFim) {
      return `Sugestão de horário para partida: a partir de ${dataInicio} até ${dataFim}`;
    }

    return '';
  }
}
