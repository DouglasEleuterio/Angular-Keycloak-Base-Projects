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
  protected readonly eTipoProcedimento = ETipoProcedimento;

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
      valor: [null],
      quantidadeSessoes: [null],
      intervaloEntreSessoes: [null],
      tipoProcedimento: [null],
      nomeRegiao: [null],
      regioes: [null]
    });

    //Valores iniciais
    this.formGroup.get('tipoProcedimento').setValue(ETipoProcedimento.APLICACAO_UNICA);
    this.definirRegrasFormulario();
  }

  submit(): void {
    this.submitted = true;
    if (this.isFormValid() && this.formGroup.valid) {
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

  definirRegrasFormulario() {
    if (this.formGroup.get('tipoProcedimento').value == ETipoProcedimento.APLICACAO_UNICA) {
      this.formGroup = this.formBuilder.group({
        nome: [null, Validators.required],
        valor: [null, Validators.required],
        quantidadeSessoes: [null, Validators.required],
        intervaloEntreSessoes: [null, Validators.required],
        tipoProcedimento: [null, Validators.required],
        nomeRegiao: [null],
        regioes: [null]
      });
      this.formGroup.get('regioes').setValue(null);
      this.regioesInseridas = [];
      this.formGroup.get('tipoProcedimento').setValue(ETipoProcedimento.APLICACAO_UNICA);
      this.formGroup.get('quantidadeSessoes').setValue(1);
      this.formGroup.get('intervaloEntreSessoes').setValue(30);
    }
    if (this.formGroup.get('tipoProcedimento').value == ETipoProcedimento.APLICACAO_MULTIPLA) {
      this.formGroup = this.formBuilder.group({
        nome: [null, Validators.required],
        valor: [null],
        quantidadeSessoes: [null],
        intervaloEntreSessoes: [null],
        tipoProcedimento: [null, Validators.required],
        nomeRegiao: [null],
        regioes: [null, Validators.required]
      });
      this.formGroup.get('valor').setValue(null);
      this.formGroup.get('tipoProcedimento').setValue(ETipoProcedimento.APLICACAO_MULTIPLA);
      this.formGroup.get('quantidadeSessoes').setValue(1);
      this.formGroup.get('intervaloEntreSessoes').setValue(30);
    }
  }

  adicionarRegiao() {
    const regiao: Regiao = {
      id: Math.random().valueOf(),
      nome: this.formGroup.get('nomeRegiao').value,
      quantidadeSessoes: this.formGroup.get('quantidadeSessoes').value,
      intervaloEntreSessoes: this.formGroup.get('intervaloEntreSessoes').value,
      valor: this.formGroup.get('valor').value,
    };
    this.regioesInseridas.push(regiao);
    this.formGroup.get('nomeRegiao').setValue(null);
    this.formGroup.get('regioes').setValue(this.regioesInseridas);
  }

  onRowRemove(regiao: Regiao) {
    const indexRegiao = this.regioesInseridas.findIndex(value => value.id === regiao.id);
    this.regioesInseridas.splice(indexRegiao, 1);
    this.formGroup.get('regioes').setValue(this.regioesInseridas);
  }

  isFormValid(): boolean {
    //Validar se dados das regiões foram informados
    let isValid = true;
    const regioes: Regiao[] = this.formGroup.get('regioes').value;
    for (const regiao of regioes) {
      if (regiao.valor == undefined || regiao.valor == 0) {
        this.alertService.error('Erro', `Região ${regiao.nome} sem valor definido`);
        isValid = false;
      }
      if (regiao.nome == undefined || null) {
        this.alertService.error('Erro', `Nome da região não informado`);
        isValid = false;
      }
    }
    return isValid;
  }
}
