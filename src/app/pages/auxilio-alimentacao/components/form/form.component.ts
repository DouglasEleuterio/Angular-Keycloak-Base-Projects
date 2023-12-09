import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { AuxilioAlimentacao } from 'src/app/domain/auxilio-alimentacao/auxilio-alimentacao.model';

@Component({
  selector: 'app-auxilio-alimentacao-form',
  templateUrl: './form.component.html'
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  public orgaoList = [{ descricao: 'O1' }, { descricao: 'O2' }, { descricao: 'O3' }, { descricao: 'O4' }, { descricao: 'O5' }];
  onSubmit: (entity: AuxilioAlimentacao, formGroup) => void;
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
      dias: [null, [Validators.required, Validators.maxLength(2), Validators.max(99)]],
      orgao: [null, [Validators.required]]
    });
  }

  submit(): void {
    this.submitted = true;

    if (this.formGroup.valid) {
      this.formGroup.controls.orgao.setValue(this.formGroup.controls.orgao?.value['descricao']);
      const entity: AuxilioAlimentacao = plainToClass(AuxilioAlimentacao, this.formGroup.value);
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

  patchValue(entity: AuxilioAlimentacao): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.formGroup.controls.orgao.setValue({ descricao: entity.orgao });
    }
  }
}
