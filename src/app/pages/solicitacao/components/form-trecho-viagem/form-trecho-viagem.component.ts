import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { finalize, switchMap, tap } from 'rxjs';
import { from } from 'src/app/core/api/select/select';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { IntegradorLocalidade } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.model';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { LocalDificilAcesso } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.model';
import { LocalDificilAcessoService } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.service';
import { MeioTransporteEnum } from 'src/app/domain/meio-transporte/meio-transporte.enum';
import { meioTransporteOptionsList } from 'src/app/domain/meio-transporte/meio-transporte.static';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { TrechoViagem } from 'src/app/domain/trecho-viagem/trecho-viagem.model';

@Component({
  selector: 'app-form-trecho-viagem',
  templateUrl: './form-trecho-viagem.component.html',
  styleUrls: ['./form-trecho-viagem.component.scss']
})
export class FormTrechoViagemComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;

  private idSolicitacao: number | string;
  private idTrecho: number | string;
  private posicaoTrechoIda: number;
  private ultimaDataPartidaSolicitacaoOrignal: Date = null;

  simNaoOptions = simNaoOptionsList;
  listUFs: string[] = [];
  listCidadesOrigem: IntegradorLocalidade[] = [];
  listLocaisDificilAcessoOrigem: LocalDificilAcesso[] = [];
  listCidadesDestino: IntegradorLocalidade[] = [];
  listLocaisDificilAcessoDestino: LocalDificilAcesso[] = [];
  meioTransporteOptions = meioTransporteOptionsList;

  onSubmit: (entity: TrechoViagem[], formGroup: FormGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private localDificilAcessoService: LocalDificilAcessoService,
    private integradorLocalidadeService: IntegradorLocalidadeService,
    private solicitacaoService: SolicitacaoService,
    private loadingService: LoadingService
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.buildFormGroup();
    this.getParams();
    this.getEstados();
    this.calledDatasPartida();
    this.calledDatasSugestivas();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      apenasUmDestino: [true],
      destinoUF: [null, [Validators.required]],
      destinoCidade: [{ value: null, disabled: this.isNew }, [Validators.required]],
      localDificilAcessoDestino: [null],

      trechoIda: this.formBuilder.group({
        origemUF: [null, [Validators.required]],
        origemCidade: [{ value: null, disabled: this.isNew }, [Validators.required]],
        localDificilAcessoOrigem: [null],
        dataPartida: [null, [Validators.required]],
        meioTransporte: [null, [Validators.required]],
        sugestaoHorarioPartidaInicial: [],
        sugestaoHorarioPartidaFinal: [],
        utilizaTransporteOficial: [],
        justificativaNaoRetornoOrigem: [],
        utilizaDespachoBagagem: []
      }),

      trechoVolta: this.formBuilder.group({
        dataPartida: [null, this.isNew ? [Validators.required] : []],
        meioTransporte: [null, this.isNew ? [Validators.required] : []],
        sugestaoHorarioPartidaInicial: [],
        sugestaoHorarioPartidaFinal: [],
        utilizaTransporteOficial: [],
        justificativaNaoRetornoOrigem: [],
        utilizaDespachoBagagem: []
      })
    });
  }

  getParams(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.loadingService.startLoading();

      this.disableFormDataPartida();
      this.route.params
        .pipe(
          tap((params: Params) => {
            this.idSolicitacao = params.id;
          }),
          switchMap((params: Params) =>
            this.solicitacaoService.get(params.id).pipe(
              finalize(() => {
                this.loadingService.stopLoading();
              })
            )
          )
        )
        .subscribe({
          next: entity => {
            this.setUltimaDataPartidaSolicitacaoOrignal(entity?.solicitacaoOriginal);
            this.enableFormDataPartida();
          },
          error: error => {
            this.validationService.handle(null, error);
            this.cancel();
          }
        });

      if (!this.isNew) {
        this.idTrecho = params.get('idTrecho');
      }
    });
  }

  disableFormDataPartida(): void {
    this.formGroup.get(`trechoIda.dataPartida`).disable();
    this.formGroup.get(`trechoVolta.dataPartida`).disable();
  }

  enableFormDataPartida(): void {
    this.formGroup.get(`trechoIda.dataPartida`).enable();
    this.formGroup.get(`trechoVolta.dataPartida`).enable();
  }

  private setUltimaDataPartidaSolicitacaoOrignal(solicitacaoOriginal: Solicitacao): void {
    if (solicitacaoOriginal && solicitacaoOriginal.trechoViagem.length > 0) {
      let posicaoUltimoTrecho = 0;

      solicitacaoOriginal.trechoViagem.map(x => {
        const posicao = x.posicaoTrecho;
        if (posicao > posicaoUltimoTrecho) {
          posicaoUltimoTrecho = posicao;
        }
      });

      const ultimoTrecho: TrechoViagem = solicitacaoOriginal.trechoViagem.find(x => x.posicaoTrecho === posicaoUltimoTrecho);

      const datePipe = new DatePipe('en-US');
      const dateTransform = datePipe.transform(ultimoTrecho.dataPartida, 'yyyy-MM-ddT00:00');

      this.ultimaDataPartidaSolicitacaoOrignal = new Date(dateTransform);
    }
  }

  getEstados(): void {
    // TODO, daniel - obter lista de estados do serviço integrador
    this.listUFs = ['MT', 'SP'];
  }

  calledDatasPartida(): void {
    this.formGroup.get('trechoIda.dataPartida')?.valueChanges?.subscribe(inicial => {
      const final = this.formGroup.get('trechoVolta.dataPartida')?.value;
      this.compareDates(inicial, final, true);
    });

    this.formGroup.get('trechoVolta.dataPartida')?.valueChanges.subscribe(final => {
      const inicial = this.formGroup.get('trechoIda.dataPartida')?.value;
      this.compareDates(inicial, final, false);
    });
  }

  compareDates(inicial: Date, final: Date, isDataIda: boolean) {
    if (inicial && final && inicial > final) {
      const translateValue = isDataIda ? 'ida' : 'volta';
      const msg = this.translateService.instant(`solicitacao.message.error_dates_${translateValue}`.toUpperCase());

      this.alertService.defaultError(msg);
      this.formGroup.get(`trecho${isDataIda ? 'Ida' : 'Volta'}.dataPartida`)?.setValue(null);
    }

    this.isValidTimeInSameDay();

    if (this.ultimaDataPartidaSolicitacaoOrignal) {
      this.isValidTimeSolicitacaoComplementacao();
    }
  }

  calledDatasSugestivas(): void {
    const trechoIdasugestaoInicial = 'trechoIda.sugestaoHorarioPartidaInicial';
    this.formGroup.get(trechoIdasugestaoInicial)?.valueChanges?.subscribe(data => {
      if (data) {
        this.isValidTime(data, trechoIdasugestaoInicial);
      }
    });

    const trechoIdasugestaoFinal = 'trechoIda.sugestaoHorarioPartidaFinal';
    this.formGroup.get(trechoIdasugestaoFinal)?.valueChanges?.subscribe(data => {
      if (data) {
        this.isValidTime(data, trechoIdasugestaoFinal);
      }
    });

    const trechoVoltasugestaoInicial = 'trechoVolta.sugestaoHorarioPartidaInicial';
    this.formGroup.get(trechoVoltasugestaoInicial)?.valueChanges?.subscribe(data => {
      if (data) {
        this.isValidTime(data, trechoVoltasugestaoInicial);
      }
    });

    const trechoVoltasugestaoFinal = 'trechoVolta.sugestaoHorarioPartidaFinal';
    this.formGroup.get(trechoVoltasugestaoFinal)?.valueChanges?.subscribe(data => {
      if (data) {
        this.isValidTime(data, trechoVoltasugestaoFinal);
      }
    });
  }

  isValidTime(data: string, formGroupName: string): void {
    const horario: string[] = data.split(':');
    const hora: string = horario[0];
    const minuto: string = horario[1];

    this.isValidTimeInSameDay();

    const inputComplete = !hora.includes('_') && !minuto.includes('_');
    const invalidTime = Number(hora) > 23 || Number(hora) < 0 || Number(minuto) > 59 || Number(minuto) < 0;

    if (inputComplete && invalidTime) {
      this.invalidTimeMessage(formGroupName);
    } else if (inputComplete) {
      this.isInvalidInicioFim(formGroupName);
    }
  }

  private isInvalidInicioFim(formGroupName: string): void {
    const inicio = formGroupName.includes('Inicial') ? formGroupName : formGroupName.replace('Final', 'Inicial');
    const fim = formGroupName.includes('Inicial') ? formGroupName.replace('Inicial', 'Final') : formGroupName;

    if (this.formGroup.get(inicio)?.value && this.formGroup.get(fim)?.value) {
      const valueInicio = new Date('01-01-1970 ' + this.formGroup.get(inicio)?.value + ':00');
      const valueFim = new Date('01-01-1970 ' + this.formGroup.get(fim)?.value + ':00');

      if (valueInicio.getTime() > valueFim.getTime()) {
        const msg = this.translateService.instant(
          `solicitacao.message.error_dates_${formGroupName.includes('Inicial') ? 'inicio' : 'termino'}`.toUpperCase()
        );
        this.alertService.defaultError(msg);
        this.formGroup.get(formGroupName)?.setValue(null);
      }
    }
  }

  isValidTimeInSameDay(): void {
    const idaDataPartida: Date = this.formGroup.get('trechoIda.dataPartida')?.value;
    const voltaDataPartida: Date = this.formGroup.get('trechoVolta.dataPartida')?.value;

    const trechoIdasugestaoFinal: string = this.formGroup.get('trechoIda.sugestaoHorarioPartidaFinal')?.value;
    const trechoVoltasugestaoInicial: string = this.formGroup.get('trechoVolta.sugestaoHorarioPartidaInicial')?.value;
    const equalsDates = idaDataPartida?.getTime() === voltaDataPartida?.getTime();
    const isInputDates: boolean =
      trechoIdasugestaoFinal &&
      trechoVoltasugestaoInicial &&
      !trechoIdasugestaoFinal?.includes('_') &&
      !trechoVoltasugestaoInicial?.includes('_');

    let invalid = false;

    if (isInputDates) {
      const ida = new Date('01-01-1970 ' + trechoIdasugestaoFinal + ':00');
      const volta = new Date('01-01-1970 ' + trechoVoltasugestaoInicial + ':00');

      invalid = ida.getTime() > volta.getTime();
    }

    if (equalsDates && invalid) {
      const msg = this.translateService.instant(`solicitacao.message.error_dates_sugestao_mesmo_dia`.toUpperCase());
      this.alertService.defaultError(msg);
      this.formGroup.get('trechoVolta.sugestaoHorarioPartidaInicial')?.setValue(null);
      this.formGroup.get('trechoVolta.sugestaoHorarioPartidaFinal')?.setValue(null);
    }
  }

  isValidTimeSolicitacaoComplementacao(): void {
    const idaDataPartida: Date = this.formGroup.get('trechoIda.dataPartida')?.value;
    const invalidDate: boolean = idaDataPartida && idaDataPartida.getTime() < this.ultimaDataPartidaSolicitacaoOrignal.getTime();

    if (invalidDate) {
      const msg = this.translateService.instant(`solicitacao.message.error_trechos_complementar`.toUpperCase());
      this.alertService.defaultError(msg);
      this.formGroup.get('trechoIda.dataPartida')?.setValue(null);
    }
  }

  invalidTimeMessage(formGroupName: string): void {
    const msg = this.translateService.instant(`solicitacao.message.error_times_invalid`.toUpperCase());
    this.alertService.defaultError(msg);
    this.formGroup.get(formGroupName)?.setValue(null);
  }

  onChangeApenasUmTrecho(isApenasUm: boolean): void {
    if (isApenasUm) {
      this.formGroup.get('trechoVolta.dataPartida').setValidators([Validators.required]);
      this.formGroup.get('trechoVolta.meioTransporte').setValidators([Validators.required]);
    } else {
      this.formGroup.get('trechoVolta.dataPartida').clearValidators();
      this.formGroup.get('trechoVolta.meioTransporte').clearValidators();
      this.formGroup.get('trechoVolta.dataPartida').setValue(null);
      this.formGroup.get('trechoVolta.meioTransporte').setValue(null);
    }

    this.formGroup.get('trechoVolta.meioTransporte').updateValueAndValidity();
    this.formGroup.get('trechoVolta.dataPartida').updateValueAndValidity();
  }

  onChangeUFOrigem(value: string): void {
    if (value) {
      this.integradorLocalidadeService.getLocalidadesByUf(value).subscribe({
        next: data => (this.listCidadesOrigem = data),
        error: error => this.validationService.handleErrorAlert(error)
      });

      this.formGroup.get('trechoIda.origemCidade').enable();
    } else {
      this.listCidadesOrigem = [];
      this.formGroup.get('trechoIda.origemCidade').disable();
    }
  }

  onChangeUFDestino(value: string): void {
    if (value) {
      this.integradorLocalidadeService.getLocalidadesByUf(value).subscribe({
        next: data => (this.listCidadesDestino = data),
        error: error => this.validationService.handleErrorAlert(error)
      });

      this.form.destinoCidade.enable();
    } else {
      this.listCidadesDestino = [];
      this.form.destinoCidade.disable();
    }
  }

  onChangeCidadeOrigem(value: IntegradorLocalidade): void {
    // TODO, daniel - obter lista de cidades do serviço integrador

    if (value) {
      const query = from<LocalDificilAcesso>()
        .select((u: LocalDificilAcesso) => [u.id, u.nome])
        .where(x => x.eq('localidade.id', value.id))
        .getQuery();

      this.localDificilAcessoService.fetchSelect<LocalDificilAcesso[]>(query).subscribe(data => {
        this.listLocaisDificilAcessoOrigem = data;
        this.verificaRegularidadeCidades(true);
      });
    }
  }

  onChangeLocaisDificilAcessoOrigem(value: LocalDificilAcesso): void {
    this.verificaRegularidadeLocaisDificilAcesso(true);
  }

  onChangeCidadeDestino(value: IntegradorLocalidade): void {
    // TODO, daniel - obter lista de cidades do serviço integrador

    if (value) {
      const query = from<LocalDificilAcesso>()
        .select((u: LocalDificilAcesso) => [u.id, u.nome])
        .where(x => x.eq('localidade.id', value.id))
        .getQuery();

      this.localDificilAcessoService.fetchSelect<LocalDificilAcesso[]>(query).subscribe(data => {
        this.listLocaisDificilAcessoDestino = data;
        this.verificaRegularidadeCidades(false);
      });
    }
  }

  onChangeLocaisDificilAcessoDestino(value: LocalDificilAcesso): void {
    this.verificaRegularidadeLocaisDificilAcesso(false);
  }

  verificaRegularidadeCidades(isFromOrigem: boolean): void {
    const cidadeOrigemCd = this.formGroup.get('trechoIda.origemCidade')?.value?.codigoLocalidade;
    const cidadeDestinoCd = this.form.destinoCidade?.value?.codigoLocalidade;

    const isNotNull: boolean = cidadeOrigemCd && cidadeDestinoCd;
    const isEqualsCidadesCd: boolean = cidadeOrigemCd === cidadeDestinoCd;
    const isEmptyLocalDificilAcesso = !(
      this.formGroup.get('trechoIda.localDificilAcessoOrigem')?.value?.id || this.form.localDificilAcessoDestino?.value?.id
    );

    if (isNotNull && isEqualsCidadesCd && isEmptyLocalDificilAcesso) {
      this.poupupErro();

      if (isFromOrigem) {
        this.formGroup.get('trechoIda.origemCidade').setValue(null);
        this.listLocaisDificilAcessoOrigem = [];
      } else {
        this.form.destinoCidade.setValue(null);
        this.listLocaisDificilAcessoDestino = [];
      }
    }
  }

  verificaRegularidadeLocaisDificilAcesso(isFromOrigem: boolean): void {
    const localOrigemId = this.formGroup.get('trechoIda.localDificilAcessoOrigem')?.value?.id;
    const localDestinoId = this.form.localDificilAcessoDestino?.value?.id;

    if (localOrigemId && localDestinoId && localOrigemId === localDestinoId) {
      this.poupupErro(false);

      isFromOrigem
        ? this.formGroup.get('trechoIda.localDificilAcessoOrigem').setValue(null)
        : this.form.localDificilAcessoDestino.setValue(null);
    }
  }

  poupupErro(isCidades = true): void {
    const msg = isCidades ? 'cidades' : 'locais';

    this.alertService.error(
      this.translateService.instant('shared.titles.error'.toUpperCase()),
      this.translateService.instant(`solicitacao.message.error_${msg}`.toUpperCase())
    );
  }

  onChangeMeioTransporte(value: string, isOrigem: boolean) {
    const formGroupName = isOrigem ? 'trechoIda' : 'trechoVolta';

    if (value === MeioTransporteEnum.AEREO || value === MeioTransporteEnum.RODOVIARIO) {
      this.formGroup.get(`${formGroupName}.sugestaoHorarioPartidaInicial`).setValidators([Validators.required]);
      this.formGroup.get(`${formGroupName}.sugestaoHorarioPartidaFinal`).setValidators([Validators.required]);
    } else {
      this.formGroup.get(`${formGroupName}.sugestaoHorarioPartidaInicial`).clearValidators();
      this.formGroup.get(`${formGroupName}.sugestaoHorarioPartidaFinal`).clearValidators();
    }
    this.formGroup.get(`${formGroupName}.sugestaoHorarioPartidaInicial`).updateValueAndValidity();
    this.formGroup.get(`${formGroupName}.sugestaoHorarioPartidaFinal`).updateValueAndValidity();

    if (value === MeioTransporteEnum.AEREO) {
      this.formGroup.get(`${formGroupName}.utilizaTransporteOficial`).setValue(false);
      this.formGroup.get(`${formGroupName}.utilizaTransporteOficial`).setValidators([Validators.required]);

      this.formGroup.get(`${formGroupName}.utilizaDespachoBagagem`).setValidators([Validators.required]);
    } else {
      this.formGroup.get(`${formGroupName}.utilizaTransporteOficial`).clearValidators();
      this.formGroup.get(`${formGroupName}.utilizaTransporteOficial`).setValue(null);

      this.formGroup.get(`${formGroupName}.utilizaDespachoBagagem`).clearValidators();
      this.formGroup.get(`${formGroupName}.utilizaDespachoBagagem`).setValue(null);
    }
  }

  get isMeioTransporteAereoIda(): boolean {
    return this.formGroup.get('trechoIda.meioTransporte')?.value === MeioTransporteEnum.AEREO;
  }

  get isMeioTransporteAereoOuRodoviarioIda(): boolean {
    const isRodoviario = this.formGroup.get('trechoIda.meioTransporte')?.value === MeioTransporteEnum.RODOVIARIO;
    return isRodoviario || this.isMeioTransporteAereoIda;
  }

  get isMeioTransporteAereoVolta(): boolean {
    return this.formGroup.get('trechoVolta.meioTransporte')?.value === MeioTransporteEnum.AEREO;
  }

  get isMeioTransporteAereoOuRodoviarioVolta(): boolean {
    const isRodoviario = this.formGroup.get('trechoVolta.meioTransporte')?.value === MeioTransporteEnum.RODOVIARIO;
    return isRodoviario || this.isMeioTransporteAereoVolta;
  }

  get destinoDesembarque(): string {
    const msg = this.form.destinoCidade?.value?.descricaoLocalidade;
    const msgEmpty = this.translateService.instant('solicitacao.message.desembarque_transporte_selecione'.toUpperCase());
    return msg ? msg : msgEmpty;
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  get getSolicitacaoIdOnly(): Solicitacao {
    const solicitacao = new Solicitacao();
    solicitacao.id = this.idSolicitacao;

    return solicitacao;
  }

  get getEntityIda(): TrechoViagem {
    const entityIda: TrechoViagem = plainToClass(TrechoViagem, this.form.trechoIda.value);

    entityIda.destinoUF = this.form.destinoUF.value;
    entityIda.destinoCidade = this.form.destinoCidade.value;
    entityIda.localDificilAcessoDestino = this.form.localDificilAcessoDestino.value;

    entityIda.solicitacao = this.getSolicitacaoIdOnly;

    if (!entityIda.utilizaTransporteOficial) {
      entityIda.utilizaTransporteOficial = false;
    }

    if (!entityIda.utilizaDespachoBagagem) {
      entityIda.utilizaDespachoBagagem = false;
    }

    if (!this.isNew) {
      entityIda.id = this.idTrecho;
      entityIda.posicaoTrecho = this.posicaoTrechoIda;
    }

    return entityIda;
  }

  get getEntityVolta(): TrechoViagem {
    const entityVolta: TrechoViagem = plainToClass(TrechoViagem, this.form.trechoVolta.value);

    entityVolta.origemUF = this.form.destinoUF.value;
    entityVolta.origemCidade = this.form.destinoCidade.value;
    entityVolta.localDificilAcessoOrigem = this.form.localDificilAcessoDestino.value;

    entityVolta.destinoUF = this.getEntityIda.origemUF;
    entityVolta.destinoCidade = this.getEntityIda.origemCidade;
    entityVolta.localDificilAcessoDestino = this.getEntityIda.localDificilAcessoOrigem;

    entityVolta.solicitacao = this.getSolicitacaoIdOnly;

    if (!entityVolta.utilizaTransporteOficial) {
      entityVolta.utilizaTransporteOficial = false;
    }

    if (!entityVolta.utilizaDespachoBagagem) {
      entityVolta.utilizaDespachoBagagem = false;
    }

    return entityVolta;
  }

  cancel(): void {
    this.onCancel();
  }

  submit(): void {
    this.submitted = true;

    if (this.formGroup.valid) {
      const listEntities: TrechoViagem[] = [];
      listEntities.push(this.getEntityIda);

      if (this.formGroup.controls.apenasUmDestino?.value) {
        listEntities.push(this.getEntityVolta);
      }

      this.onSubmit(listEntities, this.formGroup);
    } else {
      this.validationError();
    }
  }

  patchValue(entity: TrechoViagem): void {
    if (entity != null) {
      this.onChangeUFOrigem(entity.origemUF);
      this.onChangeUFDestino(entity.destinoUF);
      this.onChangeCidadeOrigem(entity.origemCidade);
      this.onChangeCidadeDestino(entity.destinoCidade);

      this.formGroup.patchValue(entity);
      this.formGroup.get('trechoIda').patchValue(entity);
      this.formGroup.get('trechoIda.dataPartida').setValue(new Date(entity.dataPartida));

      this.posicaoTrechoIda = entity.posicaoTrecho;
    }
  }
}
