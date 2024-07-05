import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ValidationFormFieldService
} from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { plainToClass } from 'class-transformer';
import { from } from '../../../../core/api/select/select';
import { Aquisicao } from '../../../../domain/aquisicao/aquisicao-model';
import { Procedimento } from '../../../../domain/procedimento/procedimento-model';
import { ProcedimentoService } from '../../../../domain/procedimento/procedimento.service';
import { Cliente } from '../../../../domain/cliente/cliente';
import { ClienteService } from '../../../../domain/cliente/cliente.service';
import { EFormaPagamento } from '../../../../domain/pagamento/forma-pagamento.enum';
import { Regiao } from '../../../../domain/procedimento/regiao.model';

@Component({
  selector: 'app-aquisicao-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: Aquisicao, formGroup) => void;
  onCancel: () => void;
  protected readonly eFormaPagamento = EFormaPagamento;

  procedimentos: Procedimento[];
  clientes: Cliente[];
  formasPagamento: EFormaPagamento[] = [];
  procedimentosInseridos: Procedimento[] = [];
  regioes: Regiao[] = [];

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder,
    private procedimentoService: ProcedimentoService,
    private clienteService: ClienteService
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.getClienteList();
    this.getProcedimentoList();
    this.formasPagamento.push(EFormaPagamento.CARTAO_CREDITO);
    this.formasPagamento.push(EFormaPagamento.CARTAO_DEBITO);
    this.formasPagamento.push(EFormaPagamento.PIX);
    this.formasPagamento.push(EFormaPagamento.EM_ABERTO);
    this.buildFormGroup();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      cliente: [null, [Validators.required]],
      dataAquisicao: [null, Validators.required],
      valorAquisicao: [null],
      valorDesconto: [null],

      procedimento: [null],
      procedimentos: [null],

      pagamentos: [null],
      pagamento: [null],

      dataPagamento: [null],
      valorPagamento: [null],
      formaPagamento: [null],
      quantidadeParcelas: [null],
      taxa: [null],

      parcelas: [null],
      parcela: [null],

      dataCredito: [null],
      valorCredito: [null],
      valorTaxa: [null],
      numeroParcela: [null]
    });
  }

  submit(): void {
    this.submitted = true;
    this.log(this.formGroup.value);
    if (this.formGroup.valid) {
      const entity: Aquisicao = plainToClass(Aquisicao, this.formGroup.value);
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: Aquisicao): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }

  getProcedimentoList(): void {
    const query = from<Procedimento>()
      .select((u: any) => [u.nome, u.id, u.valor, u.quantidadeSessoes, u.intervaloEntreSessoes, u.regioes.id, u.regioes.nome])
      .where(u => u.eq('situacao', 'true'))
      .asc(x => x.nome)
      .getQuery();

    this.procedimentoService
      .fetchSelect<Procedimento[]>(query)
      .pipe()
      .subscribe(procedimentos => (this.procedimentos = procedimentos));
  }

  getClienteList(): void {
    const query = from<Cliente>()
      .select((u: Cliente) => [u.nome, u.id])
      .where(u => u.eq('situacao', 'true'))
      .asc(x => x.nome)
      .getQuery();

    this.clienteService
      .fetchSelect<Cliente[]>(query)
      .pipe()
      .subscribe(clientes => (this.clientes = clientes));
  }

  inserirProcedimentoComRegiao() {
    this.regioes = [];
    //Recupera procedimento do formulário
    const procedimentosInseridosNoFormulario: Procedimento[] = this.formGroup.controls['procedimentos'].value;

    //Se o procedimento não possuir regiões, retiro ele da lista de procedimentos para selecionar quando já selecionado.
    const procedimentoSelecionadoDrop: Procedimento = this.formGroup.controls['procedimento'].value;
    // Existe regiao com id != null nesse procedimento
    if (procedimentoSelecionadoDrop.regioes.find(proc => proc.id != null) == undefined) {
      const indexProcedimento = this.procedimentos.findIndex(value => value.id === procedimentoSelecionadoDrop.id);
      this.procedimentos.splice(indexProcedimento, 1);
      this.formGroup.controls['procedimento'].setValue(null);
    }
    // const indexProcedimento = this.procedimentos.findIndex(
    //   value => value.regioes && value.regioes.length > 0 && value.regioes[0].id != null && value.id === procedimentoSelecionadoDrop.id
    // );
    //
    // this.procedimentos.splice(indexProcedimento, 1);
    // this.formGroup.controls['procedimento'].setValue(null);
    //
    // Se exitir procedimentos no formulario, Verifica se o procedimento já foi inserido, para validar se inclui região no procedimento
    // if (procedimentosInseridosNoFormulario && procedimentosInseridosNoFormulario.length > 0) {
    // }
    //
    // this.formGroup.controls['procedimentos'].setValue(procedimentosInseridosNoFormulario);

    //Coisas velhas
    // const procedimento = this.formGroup.controls['procedimento'].value;
    // this.procedimentosInseridos.push(procedimento);
    // const valorTotalProcedimentos = this.procedimentosInseridos.reduce((sum, { valor }) => sum + valor, 0);
    // this.formGroup.controls['procedimentos'].setValue(this.procedimentosInseridos);
    // this.formGroup.controls['procedimento'].setValue(null);
    // this.formGroup.controls['valorAquisicao'].setValue(valorTotalProcedimentos);
    // const indexProcedimento = this.procedimentos.findIndex(value => value.id === procedimento.id);
    // this.procedimentos.splice(indexProcedimento, 1);
  }

  onRowRemoveAA(procedimento: Procedimento) {
    const indexProcedimento = this.procedimentosInseridos.findIndex(value => value.id === procedimento.id);
    this.procedimentos.push(procedimento);
    this.procedimentosInseridos.splice(indexProcedimento, 1);
    this.formGroup.controls['procedimentos'].setValue(this.procedimentosInseridos);
  }

  procedimentoChange() {
    const procedimentoSelecionado: Procedimento = this.formGroup.controls['procedimento'].value;
    // Existe regiao com id != null nesse procedimento
    if (procedimentoSelecionado.regioes.find(regiao => regiao.id == null)) {
      this.inserirProcedimentoSemRegiao(procedimentoSelecionado);
    } else {
      this.inserirRegioesDadoProcedimento(procedimentoSelecionado);
    }
  }

  inserirRegioesDadoProcedimento(procedimento: Procedimento) {
    this.regioes = procedimento.regioes;
  }

  inserirProcedimentoSemRegiao(procedimentoSelecionado: Procedimento) {
    //O procedimento selecionado, não possui regiao.
    let backupDosProcedimentosJaInseridos: Procedimento[] = this.formGroup.controls['procedimentos'].value;
    backupDosProcedimentosJaInseridos == null ? (backupDosProcedimentosJaInseridos = []) : backupDosProcedimentosJaInseridos;
    procedimentoSelecionado.regioes = null;
    backupDosProcedimentosJaInseridos.push(procedimentoSelecionado);
    this.formGroup.controls['procedimentos'].setValue(backupDosProcedimentosJaInseridos);
    this.formGroup.controls['procedimento'].setValue(null);
    const indexProcedimento = this.procedimentos.findIndex(value => value.id === procedimentoSelecionado.id);
    this.procedimentos.splice(indexProcedimento, 1);
  }

  exibirSelectRegiao() {
    const procedimentoSelecionado: Procedimento = this.formGroup.controls['procedimento'].value;
    if (
      procedimentoSelecionado &&
      procedimentoSelecionado.regioes &&
      procedimentoSelecionado.regioes.length > 0 &&
      procedimentoSelecionado.regioes[0].id
    ) {
      return true;
    }
    return false;
  }
}
