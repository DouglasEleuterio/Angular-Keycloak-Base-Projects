import { AbstractControl, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { ContaBancaria } from 'src/app/domain/conta-bancaria/conta-bancaria.model';
import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { Colaborador } from 'src/app/domain/solicitante/colaborador.model';
import { Magistrado } from 'src/app/domain/solicitante/magistrado.model';
import { Servidor } from 'src/app/domain/solicitante/servidor.model';
import { Solicitante } from 'src/app/domain/solicitante/solicitante.model';
import { TipoSolicitacaoEnum } from 'src/app/domain/tipo-solicitacao/tipo-solicitacao.enum';
import { TipoSolicitanteEnum } from 'src/app/domain/tipo-solicitante/tipo-solicitante.enum';
import { tipoRegimePrevidenciaOptionsStatic } from 'src/app/domain/tipo-regime-previdencia/tipo-regime-previdencia.static';
import { Evento } from 'src/app/domain/evento/evento.model';
import { GrupoTrabalho } from 'src/app/domain/grupo-trabalho/grupo-trabalho.model';
import { IDetalhesServidor } from 'src/app/domain/servidor/servidor-detalhes.interface';

import { FormConfig, dadosCarregadosServidorOrMagistrado, tipoSolicitacao } from './form.config';
import { Bagagem } from 'src/app/domain/bagagem/bagagem.model';

export class FormValues {
  private id: string | number;

  constructor(private formGroup: FormGroup, private formConfig: FormConfig, protected translateService: TranslateService) {}

  public getSolicitacao(): Solicitacao {
    const entity: Solicitacao = {
      tipoDiaria: this.form.tipoDiaria?.value,
      tipoSolicitacao: this.getTipoSolicitacao,
      solicitacaoOriginal: this.form.solicitacaoOriginal?.value,
      documentoComplementacao: this.form.documentoComplementacao?.value,
      justificativaComplementacao: this.form.justificativaComplementacao?.value,
      solicitante: this.getSolicitante,
      situacaoSolicitacao: this.form.situacaoSolicitacao?.value ? this.form.situacaoSolicitacao?.value : null,
      eventos: this.form.eventos?.value,
      participaGrupoTrabalho: this.form.participaGrupoTrabalho?.value,
      grupoTrabalho: this.getGrupoTrabalho,
      assessoraMembroTribunal: this.form.assessoraMembroTribunal?.value,
      justificativaSolicitacao: this.form.justificativaSolicitacao?.value,
      bagagem: this.getBagagem
    };

    return entity;
  }

  private get getTipoSolicitacao(): TipoSolicitacaoEnum {
    if (this.form.viagemPreAutorizada?.value) {
      return TipoSolicitacaoEnum.VIAGEM_PRE_AUTORIZADA;
    }

    if (this.form.solicitacaoComplementacao?.value) {
      return TipoSolicitacaoEnum.SOLICITACAO_COMPLEMENTAR;
    }

    return null;
  }

  private get getSolicitante(): Solicitante {
    const solicitante: Solicitante = new Solicitante();
    solicitante.tipoSolicitante = this.form.tipoSolicitante?.value;
    solicitante.cpf = this.form.cpf?.value?.replaceAll('.', '').replace('-', '');
    solicitante.nome = this.form.nome?.value?.nome ? this.form.nome?.value?.nome : this.form.nome?.value;
    solicitante.contaBancaria = this.getContaBancaria;

    switch (this.form.tipoSolicitante?.value) {
      case TipoSolicitanteEnum.COLABORADOR:
        solicitante.colaborador = this.getColaborador;
        break;

      case TipoSolicitanteEnum.COLABORADOR_EVENTUAL:
        solicitante.colaborador = this.getColaboradorEventual;
        break;

      case TipoSolicitanteEnum.SERVIDOR:
        solicitante.servidor = this.getServidor;
        break;

      case TipoSolicitanteEnum.MAGISTRADO:
        solicitante.magistrado = this.getMagistrado;
        break;

      default:
        return null;
    }

    return solicitante;
  }

  private get getContaBancaria(): ContaBancaria {
    const contaBancaria: ContaBancaria = {
      banco: this.form.banco?.value,
      agencia: this.form.agencia?.value,
      contaCorrente: this.form.contaCorrente?.value,
      codigoOperacao: this.form.codigoOperacao?.value
    };

    return contaBancaria;
  }

  private get getColaborador(): Colaborador {
    const colaborador: Colaborador = {
      dataNascimento: this.form.dataNascimento?.value,
      regimePrevidencia: this.form.regimePrevidencia?.value?.value,
      cargoFuncao: this.form.cargoFuncao?.value,
      classificacaoCargoFuncao: this.form.classificacaoCargoFuncao?.value,
      // TODO, daniel - implementar unidade quando endpoint e perfis e permissões disponíveis
      unidadeResponsavelSolicitacao: 'MOCK TESTE',
      recebeAuxilioAlimentacao: this.form.recebeAuxilioAlimentacao?.value,
      valorAuxilioAlimentacao: this.form.valorAuxilioAlimentacao?.value,
      recebeAuxilioTransporte: this.form.recebeAuxilioTransporte?.value,
      valorAuxilioTransporte: this.form.valorAuxilioTransporte?.value
    };

    return colaborador;
  }

  private get getColaboradorEventual(): Colaborador {
    const colaborador: Colaborador = {
      dataNascimento: this.form.dataNascimento?.value,
      regimePrevidencia: this.form.regimePrevidencia?.value?.value,
      cargoFuncao: this.form.cargoFuncao?.value,
      classificacaoCargoFuncao: this.form.classificacaoCargoFuncao?.value,
      // TODO, daniel - implementar unidade quando endpoint e perfis e permissões disponíveis
      unidadeResponsavelSolicitacao: 'MOCK TESTE'
    };

    return colaborador;
  }

  private get getServidor(): Servidor {
    const servidor: Servidor = {
      matricula: this.form.matricula?.value,
      rg: this.form.rg?.value
    };

    return servidor;
  }

  private get getMagistrado(): Magistrado {
    const magistrado: Magistrado = {
      matricula: this.form.matricula?.value,
      rg: this.form.rg?.value,
      recebeAuxilioAlimentacao: this.form.recebeAuxilioAlimentacao?.value,
      valorAuxilioAlimentacao: this.form.valorAuxilioAlimentacao?.value,
      recebeAuxilioTransporte: this.form.recebeAuxilioTransporte?.value,
      valorAuxilioTransporte: this.form.valorAuxilioTransporte?.value
    };

    return magistrado;
  }

  private get getGrupoTrabalho(): GrupoTrabalho {
    const grupoTrabalho = new GrupoTrabalho();

    if (this.form.participaGrupoTrabalho?.value) {
      grupoTrabalho.maiorCargoFuncaoGrupo = this.form.maiorCargoFuncaoGrupo?.value;
      grupoTrabalho.normativoGrupoTrabalho = this.form.normativoGrupoTrabalho?.value;
    }

    return grupoTrabalho;
  }

  private get getBagagem(): Bagagem {
    const bagagem = new Bagagem();

    if (this.form.bagagem?.value) {
      bagagem.justificativaDespacho = this.form.bagagem?.value;
    }

    return bagagem;
  }

  public setValuesPatchValue(solicitacao: Solicitacao): void {
    this.id = solicitacao.id;

    switch (solicitacao.tipoSolicitacao) {
      case TipoSolicitacaoEnum.VIAGEM_PRE_AUTORIZADA:
        this.form.viagemPreAutorizada.setValue(true);
        break;
      case TipoSolicitacaoEnum.SOLICITACAO_COMPLEMENTAR:
        this.form.solicitacaoComplementacao.setValue(true);
        this.setFormValuesSolicitacaoComplementacao(solicitacao);
        break;
      default:
        this.formConfig.setValueNull(tipoSolicitacao);
    }

    this.setValuesBySolicitacaoAnteriorOrPatchValue(solicitacao);
    this.formConfig.setRegraButtonTipoSolicitacao();
  }

  public setValuesBySolicitacaoAnteriorOrPatchValue(solicitacao: Solicitacao, isSolicitacaoAnterior = false): void {
    if (isSolicitacaoAnterior) {
      const solicitacaoOriginal: Solicitacao = this.form.solicitacaoOriginal?.value;
      solicitacaoOriginal.eventos = solicitacao.eventos;
    }

    const solicitante = solicitacao.solicitante;

    this.form.tipoSolicitante.setValue(solicitante.tipoSolicitante);
    this.form.nome.setValue(solicitante.nome);
    this.form.eventos.setValue(solicitacao.eventos);

    const isColaboradorOrEventual: boolean =
      solicitante.tipoSolicitante === TipoSolicitanteEnum.COLABORADOR ||
      solicitante.tipoSolicitante === TipoSolicitanteEnum.COLABORADOR_EVENTUAL;

    if (!isColaboradorOrEventual) {
      this.formConfig.setDisableControls(dadosCarregadosServidorOrMagistrado);
    }

    isColaboradorOrEventual
      ? this.setFormValuesSolicitanteColaborador(solicitante)
      : this.setFormValuesSolicitanteServidorOrMagistrado(solicitante);

    const listEventos: Evento[] = [];
    if (solicitacao?.eventos?.length > 0) {
      listEventos.push(...solicitacao.eventos);
    }

    // TODO: CASO NÃO PRECISARÁ COPIAR OS EVENTOS DA SOLICITAÇÃO ORIGINAL PARA A COMPLEMENTAR
    // if (solicitacao.solicitacaoOriginal?.eventos?.length > 0) {
    //   listEventos.push(...solicitacao.solicitacaoOriginal.eventos);
    // }

    this.form.eventos.setValue(listEventos);
    this.form.participaGrupoTrabalho.setValue(solicitacao.participaGrupoTrabalho);

    if (solicitacao.participaGrupoTrabalho) {
      this.form.maiorCargoFuncaoGrupo.setValue(solicitacao.grupoTrabalho?.maiorCargoFuncaoGrupo);
      this.form.normativoGrupoTrabalho.setValue(solicitacao.grupoTrabalho?.normativoGrupoTrabalho);
    }

    this.form.assessoraMembroTribunal.setValue(solicitacao.assessoraMembroTribunal);
    this.form.justificativaSolicitacao.setValue(solicitacao.justificativaSolicitacao);
    this.form.bagagem.setValue(solicitacao.bagagem?.justificativaDespacho);
  }

  public setFormValuesSolicitanteColaborador(solicitante: Solicitante): void {
    // TODO, daniel - refatorar depois de implementar API de integração
    const regimePrevidencia = tipoRegimePrevidenciaOptionsStatic.find(x => solicitante.colaborador.regimePrevidencia === x.value);

    const solicitanteNome = new Solicitante();
    solicitanteNome.nome = solicitante.nome;

    this.form.nome.setValue(solicitanteNome);
    this.form.dataNascimento.setValue(new Date(solicitante.colaborador.dataNascimento));
    this.form.regimePrevidencia.setValue(regimePrevidencia);
    this.form.cpf.setValue(solicitante.cpf);
    this.form.cargoFuncao.setValue(solicitante.colaborador.cargoFuncao);
    this.form.classificacaoCargoFuncao.setValue(solicitante.colaborador.classificacaoCargoFuncao);

    this.setFormValuesAuxilios(solicitante);
    this.setFormValuesDadosBancarios(solicitante?.contaBancaria);
  }

  public setFormValuesSolicitanteServidorOrMagistrado(solicitante: Solicitante): void {
    const isServidor = solicitante.tipoSolicitante === TipoSolicitanteEnum.SERVIDOR;
    const tipoSolicitante = isServidor ? 'servidor' : 'magistrado';

    this.form.nome.setValue(solicitante.nome);
    this.form.matricula.setValue(solicitante[tipoSolicitante].matricula);
    this.form.cpf.setValue(solicitante.cpf);
    this.form.rg.setValue(solicitante[tipoSolicitante].rg);

    this.setFormValuesAuxilios(solicitante);
    this.setFormValuesDadosBancarios(solicitante?.contaBancaria);
  }

  private setFormValuesDadosBancarios(contaBancaria: ContaBancaria): void {
    if (contaBancaria) {
      this.form.banco.setValue(contaBancaria?.banco);
      this.form.agencia.setValue(contaBancaria?.agencia);
      this.form.contaCorrente.setValue(contaBancaria?.contaCorrente);
      this.form.codigoOperacao.setValue(contaBancaria?.codigoOperacao);
    }
  }

  private setFormValuesAuxilios(solicitante: Solicitante): void {
    if (this.isColaboradorOrMagistrado) {
      const tipoSolicitante: string = this.isColaborador ? 'colaborador' : 'magistrado';

      this.form.recebeAuxilioAlimentacao.setValue(solicitante[tipoSolicitante].recebeAuxilioAlimentacao);
      this.form.valorAuxilioAlimentacao.setValue(solicitante[tipoSolicitante].valorAuxilioAlimentacao);
      this.form.recebeAuxilioTransporte.setValue(solicitante[tipoSolicitante].recebeAuxilioTransporte);
      this.form.valorAuxilioTransporte.setValue(solicitante[tipoSolicitante].valorAuxilioTransporte);

      this.formConfig.changeAuxilioAlimentacao();
      this.formConfig.changeAuxilioTransporte();
    }
  }

  private setFormValuesSolicitacaoComplementacao(solicitacao: Solicitacao): void {
    this.formConfig.setControlsOptionsTipoSolicitacao();

    this.form.solicitacaoOriginal.setValue(solicitacao.solicitacaoOriginal);
    this.form.documentoComplementacao.setValue(solicitacao.documentoComplementacao);
    this.form.justificativaComplementacao.setValue(solicitacao.justificativaComplementacao);
  }

  get getDetalhesServidor(): IDetalhesServidor {
    // TODO, daniel - implementar detalhes do servidor
    const mock: IDetalhesServidor = {
      situacaoFuncional: 'situacaoFuncional mock',
      funcaoComissionada: 'funcaoComissionada mock',
      cargoSolicitante: 'cargoSolicitante mock',
      unidadeSolicitante: 'unidadeSolicitante mock'
    };

    return mock;
  }

  get getPlaceholderNameServidorOrMagistrado(): string {
    const nome = this.form.nome?.value;
    return nome ? nome : this.translateService.instant('shared.select'.toUpperCase());
  }

  get getTipoSolicitante(): TipoSolicitanteEnum {
    return this.form.tipoSolicitante?.value;
  }

  get isColaborador(): boolean {
    return this.getTipoSolicitante === TipoSolicitanteEnum.COLABORADOR;
  }

  get isMagistrado(): boolean {
    return this.getTipoSolicitante === TipoSolicitanteEnum.MAGISTRADO;
  }

  get isColaboradorOrEventual(): boolean {
    return this.getTipoSolicitante === TipoSolicitanteEnum.COLABORADOR_EVENTUAL || this.isColaborador;
  }

  get isServidorOrMagistrado(): boolean {
    return this.getTipoSolicitante === TipoSolicitanteEnum.SERVIDOR || this.isMagistrado;
  }

  get isColaboradorOrMagistrado(): boolean {
    return this.isColaborador || this.isMagistrado;
  }

  get isServidorAndAdm(): boolean {
    // TODO, daniel - quando add perfis e permissões
    return this.getTipoSolicitante === TipoSolicitanteEnum.SERVIDOR;
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }
}
