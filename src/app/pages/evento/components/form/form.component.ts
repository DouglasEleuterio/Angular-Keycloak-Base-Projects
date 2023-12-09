import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { from } from 'src/app/core/api/select/select';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { Evento } from 'src/app/domain/evento/evento.model';
import { TipoEvento } from 'src/app/domain/tipo-evento/tipo-evento.model';
import { TipoEventoService } from 'src/app/domain/tipo-evento/tipo-evento.service';

@Component({
  selector: 'app-evento-form',
  templateUrl: './form.component.html'
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;

  listTipoEvento: TipoEvento[] = [];
  unidadeList = ['Unidade 1', 'Unidade 2', 'Unidade 3'];

  formGroup: FormGroup;
  onSubmit: (entity: Evento, formGroup) => void;
  onCancel: () => void;

  constructor(
    private tipoEventoService: TipoEventoService,
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
      nomeEvento: [null, [Validators.required, Validators.maxLength(100)]],
      tipoEvento: [null, [Validators.required]],
      descricao: [null, [Validators.maxLength(500)]],
      dataInicio: [null, [Validators.required]],
      dataTermino: [null, [Validators.required]],
      numeroDocumento: [null, [Validators.required, Validators.maxLength(25)]],
      numeroProcesso: [null, [Validators.required, Validators.maxLength(25)]],
      organizadora: [null, [Validators.maxLength(100)]],
      condicoes: [null, [Validators.maxLength(500)]],
      unidade: [null, [Validators.required]],
      permiteDiasManutencao: [false]
    });

    this.getTipoEvento();
  }

  getTipoEvento(): void {
    const query = from<TipoEvento>()
      .select((u: TipoEvento) => [u.id, u.descricao, u.situacao])
      .asc(x => x.descricao)
      .getQuery();

    this.tipoEventoService.fetchSelect<TipoEvento[]>(query).subscribe(data => {
      this.listTipoEvento = data.filter(item => item.situacao === true);
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.isValidDatas) {
      if (this.formGroup.valid) {
        const entity: Evento = plainToClass(Evento, this.formGroup.value);
        this.onSubmit(entity, this.formGroup);
      } else {
        this.validationError();
      }
    }
  }

  get isValidDatas(): boolean {
    const dataInicioForm = this.formGroup.controls.dataInicio?.value;
    const dataTerminoForm = this.formGroup.controls.dataTermino?.value;

    const dataInicio = this.formattedDataString(dataInicioForm, true);
    const dataTermino = this.formattedDataString(dataTerminoForm, false);

    const isInvalidDatas = dataInicio > dataTermino;

    if (isInvalidDatas) {
      this.alertService.defaultError(this.translateService.instant('evento.message.error_dates'.toUpperCase()));
      return false;
    }
    return true;
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: Evento): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.formGroup.controls.dataInicio.setValue(new Date(entity.dataInicio));
      this.formGroup.controls.dataTermino.setValue(new Date(entity.dataTermino));
    }
  }

  formattedDataString(data: string, isInicio: boolean): string {
    const datepipe: DatePipe = new DatePipe('en-US');
    const maskInicio = 'yyyy-MM-ddT00:00';
    const maskFim = 'yyyy-MM-ddT23:59';

    const dateParse: Date = new Date(Date.parse(data));
    return datepipe.transform(dateParse, isInicio ? maskInicio : maskFim);
  }
}
