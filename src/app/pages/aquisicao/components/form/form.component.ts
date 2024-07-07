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
import { FormDatas } from './form-datas';

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
  exemplo: any[] = [];

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
    this.getClientesMock();
    this.getProcedimentosMock();
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
      procedimentosTable: [null],

      regiao: [null],
      regioes: [null],

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

  getProcedimentosMock(): void {
    FormDatas.getProcedimentos()
      .pipe()
      .subscribe(procedimentos => (this.procedimentos = procedimentos));
  }

  getProcedimentoList(): void {
    const query = from<Procedimento>()
      .select((u: any) => [
        u.nome,
        u.id,
        u.valor,
        u.quantidadeSessoes,
        u.intervaloEntreSessoes,
        u.regioes.id,
        u.regioes.nome,
        u.regioes.valor,
        u.regioes.quantidadeSessoes,
        u.regioes.intervaloEntreSessoes
      ])
      .where(u => u.eq('situacao', 'true'))
      .asc(x => x.nome)
      .getQuery();

    this.procedimentoService
      .fetchSelect<Procedimento[]>(query)
      .pipe()
      .subscribe(procedimentos => (this.procedimentos = procedimentos));
  }

  getClientesMock(): void {
    FormDatas.getClientes()
      .pipe()
      .subscribe(clientes => (this.clientes = clientes));
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

  onRegiaoSelect() {
    const regiaoSelecionada: Regiao = this.formGroup.controls['regiao'].value;
    let regioes: Regiao[] = this.formGroup.controls['regioes'].value;

    let backupDosProcedimentosJaInseridos: Procedimento[] = this.formGroup.controls['procedimentos'].value;

    //Existem Procedimentos inseridos na tabela?
    backupDosProcedimentosJaInseridos == null ? (backupDosProcedimentosJaInseridos = []) : backupDosProcedimentosJaInseridos;

    //O procedimento está inserido no formulário?
    if (backupDosProcedimentosJaInseridos.find(proc => proc.id === regiaoSelecionada.procedimento.id)) {
      const procedimentoInserido = backupDosProcedimentosJaInseridos.find(proc => proc.id == regiaoSelecionada.procedimento.id);
      if (procedimentoInserido.regioes.find(reg => reg.id === regiaoSelecionada.id) === undefined) {
        procedimentoInserido.regioes.push(regiaoSelecionada);
      } else {
        this.alertService.defaultWarn('Região já inserida');
        this.formGroup.controls['regiao'].setValue(null);
        return;
      }
    } else {
      //O procedimento ainda não está inserido no formulário
      //Criar um novo procedimento e inserir a região
      const procedimento: Procedimento = this.formGroup.controls['procedimento'].value;
      procedimento.regioes = [];
      procedimento.regioes.push(regiaoSelecionada);
      backupDosProcedimentosJaInseridos.push(procedimento);
    }
    this.formGroup.controls['procedimentos'].setValue(backupDosProcedimentosJaInseridos);
    regioes == null ? (regioes = []) : regioes;
    regioes.push(regiaoSelecionada);
    this.formGroup.controls['regioes'].setValue(regioes);

    this.formGroup.controls['regiao'].setValue(null);
  }

  onRowRemove(regiao: Regiao) {
    const procedimento = this.formGroup.controls['procedimentos'].value.find(procedimento => procedimento.id == regiao.procedimento.id);
    procedimento.regioes.splice(
      procedimento.regioes.findIndex(reg => reg.id == regiao.id),
      1
    );

    if (procedimento.regioes.length < 1) {
      this.formGroup.controls['procedimentos'].value.splice(proc => proc.id == procedimento.id, 1);
    }
    const regioes: Regiao[] = this.formGroup.controls['regioes'].value;
    regioes.splice(regioes.indexOf(regiao), 1);
    this.formGroup.controls['regioes'].setValue(regioes);
  }

  //Carregar lista de Regiões do Procedimento
  procedimentoChange() {
    this.regioes = [];
    const procedimentoSelecionado: Procedimento = this.formGroup.controls['procedimento'].value;
    procedimentoSelecionado.regioes.forEach(reg => this.regioes.push(reg));
  }

}
