import { Component, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { plainToClass } from 'class-transformer';
import { Termo } from '../../../../domain/termo/termo-model';
import { from } from '../../../../core/api/select/select';
import { Procedimento } from '../../../../domain/procedimento/procedimento-model';
import { ProcedimentoService } from '../../../../domain/procedimento/procedimento.service';
import { ProcedimentoCreateRequest } from '../../../../domain/procedimento/create/procedimento-create-request-model';

@Component({
  selector: 'app-termo-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: Termo, formGroup) => void;
  onCancel: () => void;
  public procedimentosForSelect: { id: string; name: string }[] = [];

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder,
    private procedimentoService: ProcedimentoService
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.buildFormGroup();
    this.getProcedimentos();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      id: [null],
      procedimento: [null],
      documento: this.formBuilder.group({
        id: [null],
        conteudo: [null, Validators.required]
      })
    });
  }

  submit(): void {
    this.submitted = true;
    this.log(this.formGroup.value);
    if (this.formGroup.valid) {
      const entity: Termo = plainToClass(Termo, this.formGroup.value);
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  cancel(): void {
    this.onCancel();
  }

  patchValue(entity: Procedimento): void {
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
}
