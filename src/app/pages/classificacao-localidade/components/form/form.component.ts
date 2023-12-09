import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { LogService } from '../../../../core/log/log.service';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { ClassificacaoLocalidade } from 'src/app/domain/classificacao-localidade/classificacao-localidade.model';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';
import { from } from 'src/app/core/api/select/select';

@Component({
  selector: 'app-classificacao-localidade-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  ufList = ['AM', 'MT', 'PB'];
  localidadeMap = { AM: ['Manaus', 'Cidade'], MT: ['Cuiabá'], PB: ['João Pessoa', 'Campina Grande', 'Souza'] };
  localidadeList = [];
  tipoLocalidadeList = [];
  idsList = [];
  onSubmit: (entity: ClassificacaoLocalidade, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    protected serviceTipoLocalidade: TipoLocalidadeService,
    private formBuilder: FormBuilder
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      uf: ['', [Validators.required]],
      localidade: ['', [Validators.required]],
      tipoLocalidade: ['', [Validators.required]]
    });

    this.getTipoLocalidadeList();
    this.onUfChange();
  }

  getTipoLocalidadeList(): void {
    const query = from<TipoLocalidade>()
      .select((u: TipoLocalidade) => [u.id, u.descricao])
      .asc(x => x.descricao)
      .getQuery();

    this.serviceTipoLocalidade.fetchSelect<TipoLocalidade[]>(query).subscribe(data => (this.tipoLocalidadeList = data));
  }

  submit(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      const entity: ClassificacaoLocalidade = plainToClass(ClassificacaoLocalidade, this.formGroup.value);
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  onUfChange(): void {
    const selectedUf = this.formGroup.get('uf').value;
    if (selectedUf) {
      const selectedLocalidades = this.localidadeMap[selectedUf];
      this.formGroup.get('localidade').setValue(null);
      this.localidadeList = selectedLocalidades.map(label => ({ value: label, label }));
      this.formGroup.controls.localidade.enable();
    } else {
      this.formGroup.get('localidade').setValue(null);
      this.localidadeList = [];
      this.formGroup.controls.localidade.disable();
    }
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: ClassificacaoLocalidade): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.onUfChange();
      this.formGroup.patchValue(entity);
    }
  }
}
