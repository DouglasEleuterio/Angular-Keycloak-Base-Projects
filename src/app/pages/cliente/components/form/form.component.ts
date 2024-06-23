import { Component, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../../domain/cliente/cliente';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { plainToClass } from 'class-transformer';
import { from } from '../../../../core/api/select/select';
import { Estado } from '../../../../domain/endereco/estado.model';
import { EstadoService } from '../../../../domain/endereco/estado.service';
import { Cidade } from '../../../../domain/endereco/cidade.model';
import { CidadeService } from '../../../../domain/endereco/cidade.service';
import { EGenero } from '../../../../domain/cliente/genero.enum';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  public estado: Estado;

  formGroup: FormGroup;
  onSubmit: (entity: Cliente, formGroup) => void;
  onCancel: () => void;
  estadoList: Estado[] = [];
  cidadeList: Cidade[] = [];
  generoList: any[] = [];
  cidadeSelecionada: Cidade;
  estadoSelecionado: Estado;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private cidadeService: CidadeService
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.getEstadosList();
    this.buildFormGroup();
    this.generoList.push(EGenero.MASCULINO.toUpperCase());
    this.generoList.push(EGenero.FEMININO.toUpperCase());
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      nome: [null, [Validators.required]],
      cpf: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
      telefone: [null, Validators.required],
      genero: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      email: [null, Validators.required],
      endereco: this.formBuilder.group({
        logradouro: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        bairro: [null],
        cep: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }

  submit(): void {
    this.submitted = true;
    this.log(this.formGroup.value);
    if (this.formGroup.valid && this.isValidDatas()) {
      const entity: Cliente = plainToClass(Cliente, this.formGroup.value);
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

  patchValue(entity: Cliente): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }

  private isValidDatas(): boolean {
    if (this.formGroup.controls.dataNascimento?.value === null || this.formGroup.controls.dataNascimento.value === undefined) {
      return true;
    }

    const dataNascimento = new Date(this.formGroup.controls.dataNascimento?.value).getTime();
    const isInvalidDatas = dataNascimento > Date.now();

    if (isInvalidDatas) {
      this.alertService.defaultError(this.translateService.instant('tabela_aliquota_diferenciada.message.error_dates'.toUpperCase()));
      return false;
    }
    return true;
  }

  getEstadosList(): void {
    const query = from<Estado>()
      .select((u: Estado) => [u.id, u.nome, u.uf])
      .asc(x => x.nome)
      .getQuery();

    this.estadoService
      .fetchSelect<Estado[]>(query)
      .pipe()
      .subscribe(filteredData => (this.estadoList = filteredData));
  }

  getCidadesList() {
    const query = from<Cidade>()
      .select((u: Cidade) => [u.id, u.nome])
      .where(x => x.eq('estado.id', this.formGroup.get('endereco.estado').value.id))
      .asc(x => x.nome)
      .getQuery();

    this.cidadeService
      .fetchSelect<Cidade[]>(query)
      .pipe()
      .subscribe(filteredData => (this.cidadeList = filteredData));
  }
}