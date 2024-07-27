import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
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
import { Pagamento } from '../../../../domain/pagamento/pagamento.model';
import { FormaPagamento } from '../../../../domain/forma-pagamento.model';
import { ProcedimentoEnum } from '../../../../domain/procedimento/procedimento-enum';
import { ProcedimentoCreateRequest } from '../../../../domain/procedimento/create/procedimento-create-request-model';

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
  proceEnum: ProcedimentoEnum[] = [];
  clientes: Cliente[];
  formasPagamento: FormaPagamento[] = [
    { value: 'PIX', label: 'Pix' },
    { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { value: 'EM_ABERTO', label: 'Em Aberto' }
  ];
  procedimentosInseridos: Procedimento[] = [];
  regioes: Regiao[] = [];
  exemplo: any[] = [];
  disabledAdicionarPagamento = true;

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
    this.proceEnum.push(ProcedimentoEnum.BOTOX);
    this.proceEnum.push(ProcedimentoEnum.BOTOX_NEFERTITI);
  }

  ngOnInit(): void {
    this.getClientes();
    this.getProcedimentos();
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

      formaPagamento: [null],
      valorPagamento: [null],
      valorTaxa: [null],
      dataPagamento: [null]
    });
  }

  submit(): void {
    this.submitted = true;
    this.log(this.formGroup.value);
    this.tratarDatas();
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

  getProcedimentos(): void {
    const query = from<ProcedimentoCreateRequest>()
      .select((u: ProcedimentoCreateRequest) => [u.nome, u.id])
      .where(u => u.eq('situacao', 'true'))
      .asc(x => x.nome)
      .getQuery();

    this.procedimentoService
      .fetchSelect<Procedimento[]>(query)
      .pipe()
      .subscribe(procedimentos => (this.procedimentos = procedimentos));
  }

  getClientes(): void {
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

  onRegiaoSelect() {}

  onRowRemove(regiao: Regiao) {}

  //Carregar lista de Regiões do Procedimento
  procedimentoChange() {}

  getValorTotalProcedimentos(): number {
    return 0;
  }

  getProcedimentosInForm(): Procedimento[] {
    return this.formGroup.controls['procedimentos'].value;
  }

  onAddPagamento(): void {
    this.getPagamentosInForm() === null ? this.formGroup.controls['pagamentos'].setValue([]) : this.getPagamentosInForm();

    this.setPagamentoInPagamentosForm({
      formaPagamento: this.getFormaPagamentoInForm(),
      valorPagamento: this.getValorPagamentoInForm(),
      taxa: Number.parseFloat(this.getValorTaxaInForm()),
      dataPagamento: this.getDataPagamentoInForm()
    });
    this.atualizaValorDesconto();
    this.formGroup.controls['valorAquisicao'].setValue(this.getValorTotalProcedimentos());
  }

  atualizaValorDesconto() {
    this.formGroup.controls['valorDesconto'].setValue(
      this.getValorTotalProcedimentos() - this.getValorTotalPagamentos() == null
        ? 0
        : this.getValorTotalProcedimentos() - this.getValorTotalPagamentos()
    );
  }

  onValorDePagamentoAlterado() {
    this.disabledAdicionarPagamento =
      this.getFormaPagamentoInForm() == null ||
      this.getDataPagamentoInForm() == null ||
      this.getValorPagamentoInForm() == null ||
      this.getValorTaxaInForm() == null;
  }

  onRowRemovePagamento(index: any) {
    const procedimentos: Procedimento[] = this.getPagamentosInForm();
    procedimentos.splice(index, 1);
    this.formGroup.controls['pagamentos'].setValue(procedimentos);
  }

  getValorTotalPagamentos(): number {
    return this.getPagamentosInForm().reduce(function (valorTotal, obj) {
      return valorTotal + obj.valorPagamento;
    }, 0);
  }

  getPagamentosInForm(): any {
    return this.formGroup.controls['pagamentos'].value;
  }

  setPagamentoInPagamentosForm(pagamento: Pagamento): void {
    const backupPagamentos: Pagamento[] = this.getPagamentosInForm();
    backupPagamentos.push(pagamento);
    this.formGroup.controls['pagamentos'].setValue(backupPagamentos);
  }

  getFormaPagamentoInForm(): any {
    return this.formGroup.controls['formaPagamento'].value;
  }

  getValorPagamentoInForm(): any {
    return this.formGroup.controls['valorPagamento'].value;
  }

  getValorTaxaInForm(): any {
    return this.formGroup.controls['valorTaxa'].value;
  }

  getDataPagamentoInForm(): any {
    return this.formGroup.controls['dataPagamento'].value;
  }

  getDataAquisicao(): any {
    return this.formGroup.controls['dataAquisicao'].value;
  }

  private tratarDatas() {
    const dataAquisicao = this.getDataAquisicao().toISOString().split('T')[0];
    this.formGroup.controls['dataAquisicao'].setValue(dataAquisicao);
  }

  formatarNomePagamento(formaPagamento: any) {
    return this.formasPagamento.find(forma => forma.value == formaPagamento).label;
  }

  enumToArray = (enumObj: any) => {
    return Object.entries(enumObj).map(([key, value]) => ({ key, value }));
  };

  getNomeProcedimento(nome: any) {
    const enums = this.enumToArray(this.proceEnum);
    return enums.filter(value => value.key == nome);
  }
}
