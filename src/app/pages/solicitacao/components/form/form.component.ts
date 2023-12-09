import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { LogService } from 'src/app/core/log/log.service';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';

import { ContaBancariaService } from 'src/app/domain/conta-bancaria/conta-bancaria.service';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { SolicitanteService } from 'src/app/domain/solicitante/solicitante.service';

import { cargosSolicitacaoCadastro } from 'src/app/domain/cargos/cargos.static';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { tipoSolicitanteAdministradorOptionsStatic } from 'src/app/domain/tipo-solicitante/tipo-solicitante.static';
import { tipoDiariaOptionsStatic } from 'src/app/domain/tipo-diaria/tipo-diaria.static';
import { tipoRegimePrevidenciaOptionsStatic } from 'src/app/domain/tipo-regime-previdencia/tipo-regime-previdencia.static';

import { TipoSolicitacaoEnum } from 'src/app/domain/tipo-solicitacao/tipo-solicitacao.enum';
import { TipoDiariaEnum } from 'src/app/domain/tipo-diaria/tipo-diaria.enum';
import { TipoSolicitanteEnum } from 'src/app/domain/tipo-solicitante/tipo-solicitante.enum';

import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { Solicitante } from 'src/app/domain/solicitante/solicitante.model';
import { SolicitacaoAnterior } from 'src/app/domain/solicitacao/solicitacao-anterior.model';
import { Evento } from 'src/app/domain/evento/evento.model';

import { FormConfig } from './form.config';
import { FormValues } from './form.values';
import { SituacaoSolicitacaoEnum } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.enum';

export const tiposArquivosValidos = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.png', '.zip'];

@Component({
  selector: 'app-solicitacao-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;
  @Input() isDetail = false;

  private id: number | string;
  situacao: string;

  simNaoOptions = simNaoOptionsList;
  tipoSolicitacaoEnum = TipoSolicitacaoEnum;
  listSolicitacaoAnterior: SolicitacaoAnterior[] = [];
  listServidorOrMagistrado: Solicitante[] = [];
  listBancos: string[] = [];

  tiposArquivosValidos = tiposArquivosValidos;

  // TODO, daniel - implementar regra da lista após perfils e permissões
  listTipoSolicitante = tipoSolicitanteAdministradorOptionsStatic;

  listTipoDiaria = tipoDiariaOptionsStatic;
  listRegimePrevidencia = tipoRegimePrevidenciaOptionsStatic;
  listCargos = cargosSolicitacaoCadastro;

  visibleModalPesquisaServidor = false;
  visibleModalDetalhesServidor = false;

  filteredSolicitantes: Solicitante[];
  checkedSolicitacaoComplementacao = false;

  formGroup: FormGroup;
  formConfig: FormConfig;
  formValues: FormValues;

  solicitanteByModal: Solicitante;

  onSubmit: (entity: Solicitacao, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder,
    private contaBancariaService: ContaBancariaService,
    private solicitacaoService: SolicitacaoService,
    private solicitanteService: SolicitanteService
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.buildFormGroup();
    this.getBancos();
    this.getSolicitacoesAnteriores();
    this.setFormConfig();
    this.setFormValues();
    this.calledDataNascimento();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      tipoDiaria: [TipoDiariaEnum.NACIONAL, [Validators.required]],
      viagemPreAutorizada: [false],
      solicitacaoComplementacao: [false],
      solicitacaoOriginal: [null],
      documentoComplementacao: [null],
      justificativaComplementacao: [null],

      tipoSolicitante: [null, [Validators.required]],
      nome: [null],
      dataNascimento: [null],
      regimePrevidencia: [null],
      matricula: [null],
      cpf: [null],
      rg: [null],
      cargoFuncao: [null],
      classificacaoCargoFuncao: [null],

      banco: [{ value: null, disabled: true }, [Validators.required]],
      agencia: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(10)]],
      contaCorrente: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(10)]],
      codigoOperacao: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(3)]],

      recebeAuxilioAlimentacao: [null],
      valorAuxilioAlimentacao: [null],
      recebeAuxilioTransporte: [null],
      valorAuxilioTransporte: [null],

      unidade: ['Unidade MOCK'],
      eventos: [null],
      participaGrupoTrabalho: [null],
      maiorCargoFuncaoGrupo: [null],
      normativoGrupoTrabalho: [null],
      assessoraMembroTribunal: [null],
      justificativaSolicitacao: [null],
      bagagem: [null]
    });
  }

  getBancos(): void {
    this.contaBancariaService.getBancos().subscribe(data => (this.listBancos = data));
  }

  getSolicitacoesAnteriores(): void {
    this.solicitacaoService.getSolicitacoesAnteriores().subscribe(data => {
      this.listSolicitacaoAnterior = data.sort((a, b) => (a.id as number) - (b.id as number)).reverse();
    });
  }

  setFormConfig(): void {
    this.formConfig = new FormConfig(this.formGroup, !this.isNew);
  }

  setFormValues(): void {
    this.formValues = new FormValues(this.formGroup, this.formConfig, this.translateService);
  }

  calledDataNascimento(): void {
    this.form.dataNascimento.valueChanges.subscribe(data => {
      if (data) this.verificaDataNasc(data);
    });
  }

  verificaDataNasc(data: Date): void {
    if (data > new Date()) {
      this.form.dataNascimento.setValue(null);
      this.alertService.defaultError(
        this.translateService.instant(`solicitacao.validation.datanascimento.error_dates_future`.toUpperCase())
      );
    }
  }

  onChangeTipoSolicitacao(): void {
    this.formConfig.setControlsOptionsTipoSolicitacao();
    this.checkedSolicitacaoComplementacao = this.form.solicitacaoComplementacao?.value;
  }

  onChangeSolicitacaoComplementacao(id: string): void {
    this.solicitacaoService.get(id).subscribe(data => {
      this.formValues.setValuesBySolicitacaoAnteriorOrPatchValue(data, true);
    });
  }

  onChangeTipoSolicitante(): void {
    this.formConfig.setControlsOptionsTipoSolicitante();

    if (this.formValues.isServidorOrMagistrado) {
      this.getDataListServidorOrMagistrado();
    }
  }

  onSelectAutoComplete(solicitante: Solicitante): void {
    this.formValues.setFormValuesSolicitanteColaborador(solicitante);
  }

  onChangeServidorOrMagistrado(): void {
    const solicitante = this.form.nome?.value;
    this.formValues.setFormValuesSolicitanteServidorOrMagistrado(solicitante);
  }

  filterSolicitantes(event: any): void {
    setTimeout(() => {
      const nome = event.query;
      const tipoSolicitante = this.form.tipoSolicitante?.value;

      this.solicitanteService.getSolicitantesByNome(nome, tipoSolicitante).subscribe(data => {
        this.filteredSolicitantes = data.sort((a, b) => (a.nome > b.nome ? 1 : -1));
      });
    }, 500);
  }

  getDataListServidorOrMagistrado(): void {
    const tipoSolicitante = this.form.tipoSolicitante?.value;

    if (tipoSolicitante === TipoSolicitanteEnum.SERVIDOR) {
      this.solicitanteService.getServidores().subscribe(data => (this.listServidorOrMagistrado = data));
    }

    if (tipoSolicitante === TipoSolicitanteEnum.MAGISTRADO) {
      this.solicitanteService.getMagistrados().subscribe(data => (this.listServidorOrMagistrado = data));
    }
  }

  selectedSolicitante(solicitante: Solicitante): void {
    this.solicitanteByModal = solicitante;
  }

  closeModalPesquisaServidor(): void {
    this.visibleModalPesquisaServidor = false;

    if (this.solicitanteByModal) {
      this.formValues.setFormValuesSolicitanteServidorOrMagistrado(this.solicitanteByModal);
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  get labelBtnSubmit(): string {
    return this.translateService.instant(`solicitacao.action.submit_${this.isNew ? 'create' : 'edit'}`.toUpperCase());
  }

  getListEventosSelecteds(event: Evento[]): void {
    this.form.eventos.setValue(event);
  }

  get isVisibleBtnAutorizar(): boolean {
    // TODO - dnaiel, add regra de mostra btn com base no perfil de usuário
    return this.situacao === SituacaoSolicitacaoEnum.ANALISADA;
  }

  get isVisibleBtnAnalisar(): boolean {
    // TODO - dnaiel, add regra de mostra btn com base no perfil de usuário
    const isVisible =
      this.situacao === SituacaoSolicitacaoEnum.APROVADA_PARA_AUTORIZAR || this.situacao === SituacaoSolicitacaoEnum.EM_ANALISE;
    return isVisible;
  }

  get isVisibleBtnNaoAutorizar(): boolean {
    // TODO - dnaiel,  add regra de mostra btn com base no perfil de usuário
    return this.situacao === SituacaoSolicitacaoEnum.ANALISADA;
  }

  get isVisibleBtnDevolver(): boolean {
    // TODO - dnaiel, add regra de mostra btn com base no perfil de usuário
    return this.situacao === SituacaoSolicitacaoEnum.ANALISADA;
  }

  invalidFormPoupup(key: string): void {
    this.alertService.error(
      this.translateService.instant('shared.titles.error'.toUpperCase()),
      this.translateService.instant(key.toUpperCase())
    );
  }

  cancel(): void {
    this.onCancel();
  }

  submit(): void {
    this.submitted = true;

    if (this.form.documentoComplementacao.invalid) {
      this.invalidFormPoupup('solicitacao.message.error_trechos_complementar');
    } else if (this.formGroup.valid) {
      const entity: Solicitacao = this.formValues.getSolicitacao();
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  patchValue(entity: Solicitacao): void {
    if (entity != null) {
      this.id = entity.id;
      this.situacao = entity.situacaoSolicitacao.chave;
      this.formValues.setValuesPatchValue(entity);
      this.isDetail ? this.formConfig.setControlsDetail() : this.formConfig.setControlsValidatorsEdit();
    }
  }
}
