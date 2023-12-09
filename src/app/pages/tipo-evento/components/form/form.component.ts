import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { LogService } from '../../../../core/log/log.service';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { TipoEvento } from 'src/app/domain/tipo-evento/tipo-evento.model';

@Component({
  selector: 'app-tipo-evento-form',
  templateUrl: './form.component.html'
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: TipoEvento, formGroup) => void;
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
      descricao: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  submit(): void {
    this.submitted = true;

    if (this.formGroup.valid) {
      const entity: TipoEvento = plainToClass(TipoEvento, this.formGroup.value);
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

  patchValue(entity: TipoEvento): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }
}
