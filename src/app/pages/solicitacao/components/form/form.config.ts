import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { TipoSolicitanteEnum } from 'src/app/domain/tipo-solicitante/tipo-solicitante.enum';
import { FormUtils } from 'src/app/shared/util/form.util';
import { cpfValidator } from 'src/app/shared/validators/cpf.validator';

export const tipoDiaria = ['tipoDiaria'];
export const tipoSolicitante = ['tipoSolicitante'];
export const tipoSolicitacao = ['viagemPreAutorizada', 'solicitacaoComplementacao'];
export const solicitacaoComplementacao = ['solicitacaoOriginal', 'documentoComplementacao', 'justificativaComplementacao'];
export const nome = ['nome'];
export const dadosSolicitanteColaboradorOuEventual = [
  ...nome,
  'regimePrevidencia',
  'dataNascimento',
  'cpf',
  'cargoFuncao',
  'classificacaoCargoFuncao'
];
export const dadosCarregadosServidorOrMagistrado = ['matricula', 'cpf', 'rg'];
export const dadosSolicitanteServidorOrMagistrado = [...nome, ...dadosCarregadosServidorOrMagistrado];
export const contaBancaria = ['banco', 'agencia', 'contaCorrente', 'codigoOperacao'];
export const infosComplementares = [
  'recebeAuxilioAlimentacao',
  'valorAuxilioAlimentacao',
  'recebeAuxilioTransporte',
  'valorAuxilioTransporte'
];
export const toChangeTipoSolicitacao = [
  ...tipoSolicitante,
  ...dadosSolicitanteColaboradorOuEventual,
  ...dadosSolicitanteServidorOrMagistrado,
  ...contaBancaria,
  ...infosComplementares
];
export const toChangeTipoSolicitante = [
  ...dadosSolicitanteColaboradorOuEventual,
  ...dadosSolicitanteServidorOrMagistrado,
  ...contaBancaria,
  ...infosComplementares
];
export const justificativaEdit = ['justificativaSolicitacao'];
export const camposFormEdit = ['eventos', 'participaGrupoTrabalho', 'assessoraMembroTribunal', ...justificativaEdit];
export const camposParticipaGrupoTrabalho = ['maiorCargoFuncaoGrupo', 'normativoGrupoTrabalho'];
export const allCampos = [
  ...tipoDiaria,
  ...tipoSolicitacao,
  ...solicitacaoComplementacao,
  ...toChangeTipoSolicitacao,
  ...camposFormEdit,
  ...camposParticipaGrupoTrabalho
];
export const bagagem = ['bagagem'];

export class FormConfig {
  constructor(private formGroup: FormGroup, private isEdit: boolean) {}

  public setControlsValidatorsEdit(): void {
    this.requiredValidators(camposFormEdit);
    this.updateValueAndValidity(camposFormEdit);
    this.changeParticipaGrupoTrabalho();
    this.setValidatorsJustificativaSolicitacao();
  }

  public setControlsDetail(): void {
    this.setDisableControls(allCampos);
    this.updateValueAndValidity(allCampos);
  }

  public setControlsOptionsTipoSolicitacao(): void {
    const limparControls = [...solicitacaoComplementacao, ...toChangeTipoSolicitacao, ...camposFormEdit, ...camposParticipaGrupoTrabalho];

    this.clearValidators(limparControls);
    this.setValueNull(limparControls);

    this.setValidatorsSolicitacaoComplementar(this.form.solicitacaoComplementacao?.value);
    this.setRegraButtonTipoSolicitacao();

    this.updateValueAndValidity(limparControls);
  }

  public setRegraButtonTipoSolicitacao(): void {
    this.form.viagemPreAutorizada?.value ? this.form.solicitacaoComplementacao.disable() : this.form.solicitacaoComplementacao.enable();

    this.form.solicitacaoComplementacao?.value ? this.form.viagemPreAutorizada.disable() : this.form.viagemPreAutorizada.enable();
  }

  private setValidatorsSolicitacaoComplementar(checkedSolicitacaoComplementacao: boolean): void {
    if (checkedSolicitacaoComplementacao) {
      this.requiredValidators(solicitacaoComplementacao);
      this.setDisableControls(toChangeTipoSolicitacao);

      this.setValidatorsJustificativaSolicitacao();
    } else {
      this.requiredValidators(tipoSolicitante);
      this.enableControls(toChangeTipoSolicitacao);

      this.setValidatorsJustificativaSolicitacao();
    }
  }

  public setControlsOptionsTipoSolicitante(): void {
    this.setValueNull(toChangeTipoSolicitante);
    this.clearValidators(toChangeTipoSolicitante);
    this.setDisableControls(toChangeTipoSolicitante);

    const tipoSolicitante = this.form.tipoSolicitante?.value;

    switch (tipoSolicitante) {
      case TipoSolicitanteEnum.COLABORADOR:
        this.setControlsOptionsTipoSolicitanteColaborador();
        break;

      case TipoSolicitanteEnum.COLABORADOR_EVENTUAL:
        this.setControlsOptionsTipoSolicitanteEventual();
        break;

      case TipoSolicitanteEnum.SERVIDOR:
        this.setControlsOptionsTipoSolicitanteServidor();
        break;

      case TipoSolicitanteEnum.MAGISTRADO:
        this.setControlsOptionsTipoSolicitanteMagistrado();
        break;
    }

    this.updateValueAndValidity(toChangeTipoSolicitante);
  }

  private setControlsOptionsTipoSolicitanteEventual(): void {
    this.requiredValidators([...dadosSolicitanteColaboradorOuEventual, ...contaBancaria]);
    this.enableControls([...contaBancaria, ...dadosSolicitanteColaboradorOuEventual]);

    this.form.cpf.setValidators([cpfValidator(), Validators.required]);
  }

  private setControlsOptionsTipoSolicitanteServidor(): void {
    this.requiredValidators([...dadosSolicitanteServidorOrMagistrado, ...contaBancaria]);
    this.enableControls(nome);
  }

  private setControlsOptionsTipoSolicitanteColaborador(): void {
    this.setControlsOptionsTipoSolicitanteEventual();
    this.requiredValidators(infosComplementares);
    this.enableControls(infosComplementares);
  }

  private setControlsOptionsTipoSolicitanteMagistrado(): void {
    this.setControlsOptionsTipoSolicitanteServidor();
    this.requiredValidators(infosComplementares);
  }

  public changeAuxilioAlimentacao(): void {
    if (this.form.recebeAuxilioAlimentacao?.value) {
      this.form.valorAuxilioAlimentacao.setValidators([Validators.required]);
      this.form.valorAuxilioAlimentacao.enable();
    } else {
      this.form.valorAuxilioAlimentacao.clearValidators();
      this.form.valorAuxilioAlimentacao.setValue(null);
      this.form.valorAuxilioAlimentacao.disable();
    }

    this.form.valorAuxilioAlimentacao.updateValueAndValidity();
  }

  public changeAuxilioTransporte(): void {
    if (this.form.recebeAuxilioTransporte?.value) {
      this.form.valorAuxilioTransporte.setValidators([Validators.required]);
      this.form.valorAuxilioTransporte.enable();
    } else {
      this.form.valorAuxilioTransporte.clearValidators();
      this.form.valorAuxilioTransporte.setValue(null);
      this.form.valorAuxilioTransporte.disable();
    }

    this.form.valorAuxilioTransporte.updateValueAndValidity();
  }

  public changeParticipaGrupoTrabalho(): void {
    if (this.form.participaGrupoTrabalho?.value) {
      this.requiredValidators(camposParticipaGrupoTrabalho);
      this.updateValueAndValidity(camposParticipaGrupoTrabalho);
    } else {
      this.clearValidators(camposParticipaGrupoTrabalho);
      this.setValueNull(camposParticipaGrupoTrabalho);
    }
  }

  private setValidatorsJustificativaSolicitacao(): void {
    if (this.isEdit) {
      if (this.form.solicitacaoComplementacao?.value) {
        this.setValueNull(justificativaEdit);
        this.clearValidators(justificativaEdit);
      } else {
        this.requiredValidators(justificativaEdit);
      }
      this.updateValueAndValidity(justificativaEdit);
    }
  }

  public setControlsValidatorsJustificativaBagagem(value = false): void {
    value ? FormUtils.requiredValidators(this.formGroup, bagagem) : FormUtils.clearValidators(this.formGroup, bagagem);
    FormUtils.updateValueAndValidity(this.formGroup, bagagem);
  }

  public setDisableControls(values: string[]): void {
    FormUtils.disableControls(this.formGroup, values);
  }

  public setValueNull(values: string[]): void {
    FormUtils.setValueNull(this.formGroup, values);
  }

  public requiredValidators(values: string[]): void {
    FormUtils.requiredValidators(this.formGroup, values);
  }

  public updateValueAndValidity(values: string[]): void {
    FormUtils.updateValueAndValidity(this.formGroup, values);
  }

  public clearValidators(values: string[]): void {
    FormUtils.clearValidators(this.formGroup, values);
  }

  public enableControls(values: string[]): void {
    FormUtils.enableControls(this.formGroup, values);
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }
}
