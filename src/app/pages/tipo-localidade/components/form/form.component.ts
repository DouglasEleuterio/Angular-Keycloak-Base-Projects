import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';

@Component({
  selector: 'app-tipo-localidade-form',
  templateUrl: './form.component.html'
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: TipoLocalidade, formGroup) => void;
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
      const entity: TipoLocalidade = plainToClass(TipoLocalidade, this.formGroup.value);
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

  patchValue(entity: TipoLocalidade): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }
}
