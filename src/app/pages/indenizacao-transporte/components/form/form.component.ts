import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { BaseFormComponent } from '../../../../core/ui/components/form/base-form.component';
import { LogService } from '../../../../core/log/log.service';
import { ValidationFormFieldService } from '../../../../core/ui/components/validation/field-focus/validation-form-field.service';
import { IndenizacaoTransporte } from 'src/app/domain/indenizacao-transporte/indenizacao-transporte.model';
import { tipoCombustivelOptionsList } from 'src/app/domain/tipo-combustivel/tipo-combustivel.static';
import { politicaValorTransporteOptionsList } from 'src/app/domain/politica-valor-transporte/politica-valor-transporte.static';
import { PoliticaValorTransporteEnum } from 'src/app/domain/politica-valor-transporte/politica-valor-transporte.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-indenizacao-transporte-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  listarTipoCombustiveis = tipoCombustivelOptionsList;
  listarPoliticaIndenizacaoCombustivel = politicaValorTransporteOptionsList;
  isShowConsumoPadrao = false;
  isShowTipoCombustivel = false;

  formGroup: FormGroup;
  onSubmit: (entity: IndenizacaoTransporte, formGroup) => void;
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
      normativo: [null, [Validators.required, Validators.maxLength(64)]],
      dataNormativo: [null, [Validators.required]],
      vigenciaInicial: [null, [Validators.required]],
      vigenciaFinal: [null, [Validators.required]],
      consumoPadrao: [null, [Validators.min(1.0), Validators.max(999.9)]],
      politicaValorTransporte: [null, [Validators.required]],
      combustivelPadrao: [null, []]
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.isValidDatas()) {
      if (this.formGroup.valid) {
        const entity: IndenizacaoTransporte = plainToClass(IndenizacaoTransporte, this.formGroup.value);
        this.onSubmit(entity, this.formGroup);
      } else {
        this.validationError();
      }
    }
  }

  selectInput() {
    const selecionado = this.formGroup.controls.politicaValorTransporte?.value;
    switch (selecionado) {
      case PoliticaValorTransporteEnum.VALOR_COMBUSTIVEL_PADRAO:
        this.valuesPoliticaValorCombustivelPadrao();
        break;
      case PoliticaValorTransporteEnum.SOLIC_ESCOLHE_COMBUSTIVEL_VEICULO:
        this.valuesPoliticaSolicEscolheCombustivelVeiculo();
        break;
      default:
        this.valuesDefaultPoliticaCombustivel();
    }
  }

  valuesDefaultPoliticaCombustivel() {
    this.isShowConsumoPadrao = false;
    this.isShowTipoCombustivel = false;
    this.formGroup.controls['consumoPadrao'].setValidators([Validators.min(1.0), Validators.max(999.9)]);
    this.formGroup.controls['combustivelPadrao'].setValidators([]);
  }

  valuesPoliticaValorCombustivelPadrao() {
    this.isShowConsumoPadrao = false;
    this.isShowTipoCombustivel = true;
    this.formGroup.controls['consumoPadrao'].setValidators([Validators.required]);
    this.formGroup.controls['combustivelPadrao'].setValidators([Validators.required, Validators.min(1.0), Validators.max(999.9)]);
  }

  valuesPoliticaSolicEscolheCombustivelVeiculo() {
    this.isShowConsumoPadrao = true;
    this.isShowTipoCombustivel = false;
    this.formGroup.controls['consumoPadrao'].setValidators([Validators.required]);
    this.formGroup.controls['combustivelPadrao'].setValidators([Validators.min(1.0), Validators.max(999.9)]);
  }

  changeValuePolitica() {
    const selecionado = this.formGroup.controls.politicaValorTransporte?.value;
    this.formGroup.controls['combustivelPadrao'].setValue(null);
    this.formGroup.controls['consumoPadrao'].setValue(null);
    switch (selecionado) {
      case PoliticaValorTransporteEnum.VALOR_COMBUSTIVEL_PADRAO:
        this.valuesPoliticaValorCombustivelPadrao();
        break;
      case PoliticaValorTransporteEnum.SOLIC_ESCOLHE_COMBUSTIVEL_VEICULO:
        this.valuesPoliticaSolicEscolheCombustivelVeiculo();
        break;
      default:
        this.valuesDefaultPoliticaCombustivel();
    }
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: IndenizacaoTransporte): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.formGroup.controls.dataNormativo.setValue(new Date(entity.dataNormativo));
      this.formGroup.controls.vigenciaInicial.setValue(new Date(entity.vigenciaInicial));
      this.formGroup.controls.vigenciaFinal.setValue(new Date(entity.vigenciaFinal));

      this.selectInput();
    }
  }

  validarPoliticaIndenizacao(politicaIndenizacao): boolean {
    return politicaIndenizacao.value === 'VALOR_COMBUSTIVEL_PADRAO';
  }

  isValidDatas(): boolean {
    const dataInicioForm = this.formGroup.controls.vigenciaInicial?.value;
    const dataTerminoForm = this.formGroup.controls.vigenciaFinal?.value;

    const dataInicio = this.formattedDataString(dataInicioForm, true);
    const dataTermino = this.formattedDataString(dataTerminoForm, false);

    const isInvalidDatas = dataInicio > dataTermino;

    if (isInvalidDatas) {
      this.alertService.defaultError(this.translateService.instant('indenizacao_transporte.message.error_dates'.toUpperCase()));
      return false;
    }
    return true;
  }

  formattedDataString(data: string, isInicio: boolean): string {
    const datepipe: DatePipe = new DatePipe('en-US');
    const maskInicio = 'yyyy-MM-ddT00:00';
    const maskFim = 'yyyy-MM-ddT23:59';

    const dateParse: Date = new Date(Date.parse(data));
    return datepipe.transform(dateParse, isInicio ? maskInicio : maskFim);
  }

  get isValidPolitica(): boolean {
    return this.formGroup.controls.politicaValorTransporte.value != null;
  }
}
