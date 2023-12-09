import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { LogService } from '../../../../core/log/log.service';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { PrecoCombustivel } from 'src/app/domain/preco-combustivel/preco-combustivel.model';

@Component({
  selector: 'app-preco-combustivel-form',
  templateUrl: './form.component.html'
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: PrecoCombustivel, formGroup) => void;
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
      normativo: [null, [Validators.required, Validators.maxLength(64)]],
      dataNormativo: [null, [Validators.required]],
      precoGasolina: [null, [Validators.required, Validators.min(0.01), Validators.max(999.99)]],
      precoEtanol: [null, [Validators.required, Validators.min(0.01), Validators.max(999.99)]],
      precoDiesel: [null, [Validators.required, Validators.min(0.01), Validators.max(999.99)]],
      precoGNV: [null, [Validators.required, Validators.min(0.01), Validators.max(999.99)]]
    });
  }

  submit(): void {
    this.submitted = true;

    if (this.formGroup.valid) {
      const entity: PrecoCombustivel = plainToClass(PrecoCombustivel, this.formGroup.value);
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

  patchValue(entity: PrecoCombustivel): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.formGroup.controls.dataNormativo.setValue(new Date(entity.dataNormativo));
    }
  }
}
