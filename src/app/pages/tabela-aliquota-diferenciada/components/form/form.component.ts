import { Component, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabelaAliquotaDiferenciada } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.model';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { plainToClass } from 'class-transformer';
import { Exemplo } from '../../../../domain/exemplo/exemplo.model';

@Component({
  selector: 'app-tabela-aliquota-diferenciada-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: TabelaAliquotaDiferenciada, formGroup) => void;
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
      ncm: [null, [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      inicioVigencia: [null, [Validators.required]],
      fimVigencia: [null, [Validators.required]]
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      const entity: TabelaAliquotaDiferenciada = plainToClass(TabelaAliquotaDiferenciada, this.formGroup.value);
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

  patchValue(entity: Exemplo): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }
}
