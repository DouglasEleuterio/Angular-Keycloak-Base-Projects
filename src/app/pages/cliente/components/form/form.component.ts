import { Component, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../../domain/cliente/cliente';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ValidationFormFieldService
} from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: Cliente, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      nome: [null, [Validators.required]],
      cpf: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
      fimVigencia: [null],
      email: [null, Validators.required],
      telefone: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      genero: [null, Validators.required],
      logradouro: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null, Validators.required],
      bairro: [null, Validators.required],
      cep: [null, Validators.required],
      cidadeId: [null, Validators.required]
    });
  }

  submit(): void {
    this.submitted = true;
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
}
