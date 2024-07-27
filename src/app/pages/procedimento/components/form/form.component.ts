import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { plainToClass } from 'class-transformer';
import { Regiao } from '../../../../domain/procedimento/regiao.model';
import { ProcedimentoCreateRequest } from '../../../../domain/procedimento/create/procedimento-create-request-model';
import { RegiaoCreateRequest } from '../../../../domain/procedimento/create/regiao-create-request-model';

@Component({
  selector: 'app-procedimento-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: ProcedimentoCreateRequest, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    private formBuilder: FormBuilder
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
    this.buildFormGroup();
  }

  ngOnInit(): void {
    this.buildFormGroup();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      nome: [null, [Validators.required]],
      id: [null],
      regioes: [null],

      nomeRegiao: [null]
    });
    this.formGroup.controls['regioes'].setValue([]);
  }

  submit(): void {
    this.submitted = true;
    if (this.isFormValid() && this.formGroup.valid) {
      const entity: ProcedimentoCreateRequest = plainToClass(ProcedimentoCreateRequest, this.formGroup.value);
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

  patchValue(entity: ProcedimentoCreateRequest): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }

  public adicionarRegiao() {
    const nomeRegiaoInput = this.getNomeRegiaoInForm();
    const regioesBkp = this.getRegioesInForm();
    if (this.filtrarRegiaoPorNome(nomeRegiaoInput).length > 0) {
      this.alertService.error('Inválido', 'Região já inserida');
      return;
    }
    const regiaoCreate: RegiaoCreateRequest = {
      nome: this.getNomeRegiaoInForm(),
      quantidadeSessoes: 1,
      intervaloEntreSessoes: 30,
      valor: 0
    };
    regioesBkp.push(regiaoCreate);
    this.formGroup.get('regioes').setValue(regioesBkp);
    this.formGroup.get('nomeRegiao').setValue(null);
  }

  public onRowRemove(regiao: RegiaoCreateRequest): void {
    const regioesBkp = this.getRegioesInForm();
    regioesBkp.splice(regioesBkp.indexOf(regiao), 1);
    this.formGroup.get('regioes').setValue(regioesBkp);
  }

  private isFormValid(): boolean {
    let isValid = true;
    const regioes: RegiaoCreateRequest[] = this.formGroup.get('regioes').value;
    for (const regiao of regioes) {
      if (regiao.valor == undefined || regiao.valor == 0) {
        this.alertService.error('Erro', `Região ${regiao.nome} sem valor definido`);
        isValid = false;
      }
      if (regiao.nome == undefined || null || '') {
        this.alertService.error('Erro', `Nome da região não informado`);
        isValid = false;
      }
    }
    return isValid;
  }
  private getNomeRegiaoInForm(): string {
    return this.formGroup.controls['nomeRegiao'].value;
  }

  public getRegioesInForm(): RegiaoCreateRequest[] {
    return this.formGroup.controls['regioes'].value;
  }

  private filtrarRegiaoPorNome(nomeRegiaoInput: string): Regiao[] {
    return this.getRegioesInForm().filter(reg => reg.nome == nomeRegiaoInput);
  }
}
