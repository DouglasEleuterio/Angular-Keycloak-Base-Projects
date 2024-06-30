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

  procedimentos: Procedimento[];
  clientes: Cliente[];
  formasPagamento: EFormaPagamento[] = [];

  procedimentosInseridos: Procedimento[] = [];

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
    this.formasPagamento.push(EFormaPagamento.CARTAO_CREDITO);
    this.formasPagamento.push(EFormaPagamento.PIX);
    this.formasPagamento.push(EFormaPagamento.EM_ABERTO);
    this.buildFormGroup();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      cliente: [null, [Validators.required]],
      procedimentos: [null],
      dataAquisicao: [null, Validators.required],
      valorAquisicao: [null],
      valorDesconto: [null],
      pagamentos: [null],

      procedimento: [null]
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
      .select((u: Procedimento) => [u.nome, u.id, u.valor, u.quantidadeSessoes, u.intervaloEntreSessoes])
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

  inserirProcedimento() {
    const procedimento = this.formGroup.controls['procedimento'].value;
    this.procedimentosInseridos.push(procedimento);
    const valorTotalProcedimentos = this.procedimentosInseridos.reduce((sum, { valor }) => sum + valor, 0);
    this.formGroup.controls['procedimentos'].setValue(this.procedimentosInseridos);
    this.formGroup.controls['procedimento'].setValue(null);
    this.formGroup.controls['valorAquisicao'].setValue(valorTotalProcedimentos);
  }
}
