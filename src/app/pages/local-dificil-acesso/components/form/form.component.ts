import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { IntegradorLocalidade } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.model';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';
import { LocalDificilAcesso } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.model';

@Component({
  selector: 'app-local-dificil-acesso-form',
  templateUrl: './form.component.html'
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  localidadeMap = { MT: ['Cuiabá', 'Rondonópolis', 'Alta Floresta'] };
  selectedLocalidades = this.localidadeMap['MT'];
  localidadeList = [];

  filteredLocalidades: IntegradorLocalidade[];

  onSubmit: (entity: LocalDificilAcesso, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder,
    private integradorLocalidadeService: IntegradorLocalidadeService
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      localidade: ['', [Validators.required]],
      distancia: ['', [Validators.required, Validators.max(9999), this.validateNumber]],
      tempo: ['', [Validators.required, this.validateNumber]],
      condicoes: ['', [Validators.required, Validators.maxLength(500)]],
      resolucao: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.localidadeList = this.selectedLocalidades.map(label => ({ value: label, label }));
  }

  submit(): void {
    this.submitted = true;

    if (this.formGroup.valid) {
      const entity: LocalDificilAcesso = plainToClass(LocalDificilAcesso, this.formGroup.value);
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  validateNumber(control: FormControl): { [key: string]: unknown } | null {
    const value = control.value;
    if (isNaN(value)) {
      return { nonNumeric: true };
    }
    return null;
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: LocalDificilAcesso): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }

  filterLocalidades(event: any): void {
    setTimeout(() => {
      const nome = event.query;
      const uf = 'MT';

      this.integradorLocalidadeService.getLocalidadesByUfAndNome(uf, nome).subscribe(data => {
        this.filteredLocalidades = data.sort((a, b) => (a.descricaoLocalidade > b.descricaoLocalidade ? 1 : -1));
      });
    }, 500);
  }

  onSelectAutoComplete(integradorLocalidade: IntegradorLocalidade): void {
    this.formGroup.controls.localidade.setValue(integradorLocalidade);
  }
}
