import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { LogService } from '../../../../core/log/log.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ValidationFormFieldService
} from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { plainToClass } from 'class-transformer';
import { Procedimento } from '../../../../domain/procedimento/procedimento-model';
import { Options } from '../../../../domain/options/options.interface';
import { ETipoProcedimento } from '../../../../domain/procedimento/tipo-procedimento.enum';
import { Regiao } from '../../../../domain/procedimento/regiao.model';

@Component({
  selector: 'app-procedimento-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  formGroup: FormGroup;
  onSubmit: (entity: Procedimento, formGroup) => void;
  onCancel: () => void;
  regioesInseridas: Regiao[] = [];
  tipoProcedimentoList: Options[] = [
    { label: 'Aplicação Única região', value: ETipoProcedimento.APLICACAO_UNICA.toString() },
    { label: 'Aplicação Multiplas regiões', value: ETipoProcedimento.APLICACAO_MULTIPLA.toString() }
  ];

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
    this.buildFormGroup();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      nome: [null, [Validators.required]],
      valor: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
      quantidadeSessoes: [null],
      intervaloEntreSessoes: [null],
      tipoProcedimento: [null],
      nomeRegiao: [null]
    });
    this.formGroup.get('tipoProcedimento').setValue(ETipoProcedimento.APLICACAO_UNICA);
    this.formGroup.get('quantidadeSessoes').setValue(1);
    this.formGroup.get('intervaloEntreSessoes').setValue(7);
  }

  submit(): void {
    this.submitted = true;
    this.log(this.formGroup.value);
    if (this.formGroup.valid) {
      const entity: Procedimento = plainToClass(Procedimento, this.formGroup.value);
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

  patchValue(entity: Procedimento): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }

  definirRegrasFormulario(value: string | boolean) {
    console.log('Tipo procedimento :: ' + value);
  }

  protected readonly ETipoProcedimento = ETipoProcedimento;

  adicionarRegiao() {
    const regiao = new Regiao();
    regiao.nome = this.formGroup.get('nomeRegiao').value;
    regiao.valor = 0;
    regiao.id = Math.random().valueOf();
    regiao.quantidadeSessoes = 1;
    regiao.intervaloEntreSessoes = 7;
    this.regioesInseridas.push(regiao);
    this.formGroup.get('nomeRegiao').setValue(null);
  }

  onRowRemove(regiao: Regiao) {
    const indexRegiao = this.regioesInseridas.findIndex(value => value.id === regiao.id);
    this.regioesInseridas.splice(indexRegiao, 1);
  }
}
