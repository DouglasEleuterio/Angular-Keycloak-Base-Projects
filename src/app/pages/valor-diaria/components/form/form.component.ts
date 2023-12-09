import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { from } from 'src/app/core/api/select/select';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { ICargos } from 'src/app/domain/cargos/cargos.interface';
import { cargosEfetivosList, cargosFuncoesList } from 'src/app/domain/cargos/cargos.static';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { ValorDiaria } from 'src/app/domain/valor-diaria/valor-diaria.model';

@Component({
  selector: 'app-valor-diaria-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;
  isSubmitted = false;

  listTipoLocalidade: TipoLocalidade[] = [];

  cargosEfetivos = cargosEfetivosList;
  selectedEfetivos: ICargos[] = [];

  cargosFuncoes = cargosFuncoesList;
  selectedFuncoes: ICargos[] = [];

  formGroup: FormGroup;
  onSubmit: (entity: ValorDiaria, formGroup) => void;
  onCancel: () => void;

  constructor(
    private tipoLocalidadeService: TipoLocalidadeService,
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
      valor: [null, [Validators.required, Validators.maxLength(8), Validators.min(0), Validators.max(100000)]],
      tipoLocalidade: [null, [Validators.required]],
      normativo: [null, [Validators.required, Validators.maxLength(100)]],
      dataNormativo: ['', [Validators.required]],
      cargoValorDiaria: []
    });

    this.getTipoLocalidade();
  }

  getTipoLocalidade(): void {
    const query = from<TipoLocalidade>()
      .select((u: TipoLocalidade) => [u.id, u.descricao])
      .where(x => x.eq('situacao', `${true}`))
      .asc(x => x.descricao)
      .getQuery();

    this.tipoLocalidadeService.fetchSelect<TipoLocalidade[]>(query).subscribe(data => (this.listTipoLocalidade = data));
  }

  submit(): void {
    this.submitted = true;
    this.isSubmitted = true;

    if (this.formGroup.valid && this.isValidCargos) {
      const entity: ValorDiaria = plainToClass(ValorDiaria, this.formGroup.value);
      entity.cargo = this.getCargos();
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
      this.isSubmitted = false;
    }
  }

  getCargos(): string[] {
    const listEfetivos: string[] = this.selectedEfetivos.map(x => x.value);
    const listFuncoes: string[] = this.selectedFuncoes.map(x => x.value);

    return [...listEfetivos, ...listFuncoes];
  }

  get isValidCargos(): boolean {
    return this.selectedEfetivos.length > 0;
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  setCargos(cargos: string[]): void {
    this.selectedEfetivos = cargosEfetivosList.filter(elemList => cargos.find(valueStr => elemList.value === valueStr));
    this.selectedFuncoes = cargosFuncoesList.filter(elemList => cargos.find(valueStr => elemList.value === valueStr));
  }

  setDataNormativo(value: Date): void {
    this.formGroup.controls.dataNormativo.setValue(new Date(value));
  }

  patchValue(entity: ValorDiaria): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.setCargos(entity.cargo);
      this.setDataNormativo(entity.dataNormativo);
    }
  }
}
