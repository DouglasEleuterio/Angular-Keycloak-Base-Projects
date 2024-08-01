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
import { RegiaoCreateRequest } from '../../../../domain/procedimento/create/regiao-create-request-model';
import { ProcedimentoAquisicaoRequest } from '../../../../domain/procedimento/create/procedimento-aquisicao-create-request';

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
  regioesProcedimentoSelecionado: RegiaoCreateRequest[] = [];
  formasPagamento: FormaPagamento[] = [
    { value: 'PIX', label: 'Pix' },
    { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { value: 'EM_ABERTO', label: 'Em Aberto' }
  ];
  regioes: Regiao[] = [];
  disabledAdicionarPagamento = true;
  public procedimentosForSelect: { id: string; name: string }[] = [];

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

      procedimentoSelecionadoForm: [null],

      regiao: [null],

      pagamentos: [null],

      formaPagamento: [null],
      valorPagamento: [null],
      valorTaxa: [null],
      dataPagamento: [null],

      procedimentosDaAquisicao: [null]
    });

    this.formGroup.controls['procedimentosDaAquisicao'].setValue([]);
    this.formGroup.controls['pagamentos'].setValue([]);
    this.formGroup.controls['valorDesconto'].setValue(0);
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
      .fetchSelect<any[]>(query)
      .pipe()
      .subscribe(procedimentos => {
        procedimentos = procedimentos.filter(p => p.id != null);

        procedimentos.forEach(value => {
          this.procedimentosForSelect.push({ id: value.id, name: value.nome });
        });
      });
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

  getRegioesFromProcedimento(): void {
    const query = from<ProcedimentoCreateRequest>()
      .select((u: any) => [
        u.nome,
        u.id,
        u.regioes.id,
        u.regioes.nome,
        u.regioes.intervaloEntreSessoes,
        u.regioes.valor,
        u.regioes.quantidadeSessoes
      ])
      .where(u => u.eq('id', this.getProcedimentoInForm().id))
      .asc(x => x.nome)
      .getQuery();

    this.procedimentoService
      .fetchSelect<any[]>(query)
      .pipe()
      .subscribe(procedimentos =>
        procedimentos.forEach(value => {
          this.regioesProcedimentoSelecionado = [];
          value.regioes.forEach(regiao => this.regioesProcedimentoSelecionado.push(regiao));
        })
      );
  }

  onRegiaoSelect() {
    const idRegiaoSelecionada = this.getRegiaoSelecionadaInForm().id;
    if (this.getProcedimentosDaAquisicao().find(value => value.id === idRegiaoSelecionada)) {
      return;
    }
    const procedimentoDaAquisicao: ProcedimentoAquisicaoRequest = {
      procedimentoOrigemId: this.getRegiaoSelecionadaInForm().id,
      nome: this.getRegiaoSelecionadaInForm().nome,
      intervaloEntreSessoes: this.getRegiaoSelecionadaInForm().intervaloEntreSessoes,
      valor: this.getRegiaoSelecionadaInForm().valor,
      quantidadeSessoes: this.getRegiaoSelecionadaInForm().quantidadeSessoes,
      procedimento: this.getProcedimentoInForm().name
    };
    this.getProcedimentosDaAquisicao().push(procedimentoDaAquisicao);
    this.atualizaValorDesconto();
  }

  onRowRemove(regiao: Regiao) {
    const regiaoOnList = this.getProcedimentosDaAquisicao().filter(value => value.id == regiao.id);
    const index = this.getProcedimentosDaAquisicao().indexOf(regiaoOnList[0]);
    this.getProcedimentosDaAquisicao().splice(index, 1);
    this.atualizaValorDesconto();
  }

  onRowRemovePagamento(index: number) {
    this.getPagamentosInForm().splice(index, 1);
    this.atualizaValorDesconto();
  }

  //Carregar lista de Regiões do Procedimento
  procedimentoChange() {
    this.getRegioesFromProcedimento();
  }

  getValorTotalProcedimentos(): number {
    const valorAquisicao = this.getProcedimentosDaAquisicao().reduce(
      (previousValue, currentValue) => previousValue + currentValue.valor * currentValue.quantidadeSessoes,
      0
    );
    this.formGroup.controls['valorAquisicao'].setValue(valorAquisicao);
    return valorAquisicao;
  }

  onAddPagamento(): void {
    this.setPagamentoInPagamentosForm({
      formaPagamento: this.getFormaPagamentoInForm(),
      valorPagamento: this.getValorPagamentoInForm(),
      taxa: Number.parseFloat(this.getValorTaxaInForm()),
      dataPagamento: this.getDataPagamentoInForm()
    });
    this.atualizaValorDesconto();
  }

  atualizaValorDesconto() {
    this.formGroup.controls['valorDesconto'].setValue(this.getValorTotalProcedimentos() - this.getValorTotalPagamentos());
  }

  onValorDePagamentoAlterado() {
    this.disabledAdicionarPagamento =
      this.getFormaPagamentoInForm() == null ||
      this.getDataPagamentoInForm() == null ||
      this.getValorPagamentoInForm() == null ||
      this.getValorTaxaInForm() == null;
  }

  getValorTotalPagamentos(): number {
    return this.getPagamentosInForm().reduce(function (valorTotal, obj) {
      return valorTotal + obj.valorPagamento;
    }, 0);
  }

  setPagamentoInPagamentosForm(pagamento: Pagamento): void {
    const pagamentosAnterior = this.getPagamentosInForm();
    pagamentosAnterior.push(pagamento);
    this.formGroup.controls['pagamentos'].setValue(pagamentosAnterior);
  }

  getPagamentosInForm(): Pagamento[] {
    return this.formGroup.controls['pagamentos'].value;
  }

  getFormaPagamentoInForm(): any {
    return this.formGroup.controls['formaPagamento'].value;
  }

  getRegiaoSelecionadaInForm(): RegiaoCreateRequest {
    return this.formGroup.controls['regiao'].value;
  }

  getValorPagamentoInForm(): any {
    return this.formGroup.controls['valorPagamento'].value;
  }

  getProcedimentoInForm(): { id: string; name: string } {
    return this.formGroup.controls['procedimentoSelecionadoForm'].value;
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

  getProcedimentosDaAquisicao(): ProcedimentoAquisicaoRequest[] {
    return this.formGroup.controls['procedimentosDaAquisicao'].value;
  }

  getValorDesconto(): number {
    return this.formGroup.controls['valorDesconto'].value;
  }

  getValorAquisicao(): number {
    return this.formGroup.controls['valorAquisicao'].value;
  }

  private tratarDatas() {
    const dataAquisicao = this.getDataAquisicao().toISOString().split('T')[0];
    this.formGroup.controls['dataAquisicao'].setValue(dataAquisicao);
  }

  formatarNomePagamento(formaPagamento: any) {
    return this.formasPagamento.find(forma => forma.value == formaPagamento).label;
  }
}
