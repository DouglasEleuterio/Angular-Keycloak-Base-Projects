import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { LogService } from '../../../../core/log/log.service';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { DistanciaLocalidade } from 'src/app/domain/distancia-localidade/distancia-localidades.model';
import { IntegradorLocalidade } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.model';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';

@Component({
  selector: 'app-distancia-localidade-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  ufList = ['AM', 'MT', 'PB'];
  localidadeList = [];
  localidadeDestinoList = [];
  onSubmit: (entity: DistanciaLocalidade, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    protected serviceTipoLocalidade: TipoLocalidadeService,
    protected integradorLocalidadeService: IntegradorLocalidadeService,
    private formBuilder: FormBuilder
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ufOrigem: ['', [Validators.required]],
      localidadeOrigem: ['', [Validators.required]],
      ufDestino: ['', [Validators.required]],
      localidadeDestino: ['', [Validators.required]],
      distancia: ['', [Validators.required]]
    });

    this.onUfDestinoChange();
    this.onUfChange();
  }

  submit(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      const entity: DistanciaLocalidade = plainToClass(DistanciaLocalidade, this.formGroup.value);
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  onUfChange(): void {
    const selectedUf = this.formGroup.get('ufOrigem').value;
    if (selectedUf) {
      this.formGroup.get('localidadeOrigem').setValue(null);
      this.filterLocalidadesOrigem(selectedUf);
      this.formGroup.controls.localidadeOrigem.enable();
    } else {
      this.formGroup.get('localidadeOrigem').setValue(null);
      this.localidadeList = [];
      this.formGroup.controls.localidadeOrigem.disable();
    }
  }

  onUfDestinoChange(): void {
    const selectedUfDestino = this.formGroup.get('ufDestino').value;
    if (selectedUfDestino) {
      this.formGroup.get('localidadeDestino').setValue(null);
      this.filterLocalidadesDestino(selectedUfDestino);
      this.formGroup.controls.localidadeDestino.enable();
    } else {
      this.formGroup.get('localidadeDestino').setValue(null);
      this.localidadeDestinoList = [];
      this.formGroup.controls.localidadeDestino.disable();
    }
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: DistanciaLocalidade): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.onUfChange();
      this.onUfDestinoChange();
      this.formGroup.patchValue(entity);
    }
  }

  filterLocalidadesOrigem(uf: string): void {
    this.integradorLocalidadeService.getLocalidadesByUf(uf).subscribe(data => {
      this.localidadeList = data.sort((a, b) => (a.descricaoLocalidade > b.descricaoLocalidade ? 1 : -1));
    });
  }

  filterLocalidadesDestino(uf: string): void {
    this.integradorLocalidadeService.getLocalidadesByUf(uf).subscribe(data => {
      this.localidadeDestinoList = data.sort((a, b) => (a.descricaoLocalidade > b.descricaoLocalidade ? 1 : -1));
    });
  }
}
