import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { CompanhiaAerea } from 'src/app/domain/companhia-aerea/companhia-aerea.model';
import { Contato } from 'src/app/domain/companhia-aerea/contato.model';
import { cnpjValidator } from 'src/app/shared/validators/cnpj.validator';

@Component({
  selector: 'app-companhia-aerea-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;
  formGroup: FormGroup;
  onSubmit: (entity: CompanhiaAerea, formGroup) => void;
  onCancel: () => void;

  listaContato: Contato[] = [];
  contatoEditar: Contato;
  editContato = false;
  posicaoEdicao = -1;

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
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      sigla: ['', [Validators.required, Validators.maxLength(20)]],
      cnpj: ['', [cnpjValidator()]]
    });
    this.editContato = false;
  }

  submit(): void {
    this.submitted = true;

    if (this.formGroup.valid) {
      if (
        this.formGroup.get('cnpj').value !== undefined &&
        this.formGroup.get('cnpj').value !== null &&
        this.formGroup.get('cnpj').value !== ''
      ) {
        const cnpjF = this.formGroup.get('cnpj').value?.toString().replace(/\D/g, '');
        this.formGroup.get('cnpj').patchValue(cnpjF);
      }
      const upperSigla = this.formGroup.get('sigla').value.toUpperCase();
      this.formGroup.get('sigla').patchValue(upperSigla);
      const entity: CompanhiaAerea = plainToClass(CompanhiaAerea, this.formGroup.value);
      entity.listaContato = this.listaContato;
      entity.situacao = true;
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  salvarContatoLista(contato: Contato, posicaoEdicao: number): void {
    if (this.editContato === true) {
      this.listaContato[posicaoEdicao] = contato;
    } else {
      this.listaContato.push(contato);
    }
    this.editContato = false;
  }

  editarContato(event): void {
    this.contatoEditar = event[0];
    this.editContato = true;
    this.posicaoEdicao = event[1];
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: CompanhiaAerea): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
      this.listaContato = entity.listaContato;
      if (this.listaContato === undefined || this.listaContato === null) {
        this.listaContato = [];
      }
    }
  }
}
