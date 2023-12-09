import { ValidationService } from './../../../../core/ui/notifications/validation.service';
import { ContatoService } from './../../../../domain/companhia-aerea/contato.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { Contato } from 'src/app/domain/companhia-aerea/contato.model';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';

@Component({
  selector: 'app-contato-form',
  templateUrl: './contato-form.component.html'
})
export class ContatoFormComponent extends BaseFormComponent implements OnInit, OnChanges {
  @Input() isNew: boolean;
  listaContato: Contato[] = [];
  formGroup: FormGroup;
  ufList = ['AM', 'MT', 'PB'];
  localidadeList = [];

  @Output()
  onAdicionar = new EventEmitter<Contato>();

  @Input()
  contatoEditar: Contato;

  constructor(
    protected alertService: AlertService,
    protected contatoService: ContatoService,
    protected validationService: ValidationService,
    protected logService: LogService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    protected integradorLocalidadeService: IntegradorLocalidadeService,
    private formBuilder: FormBuilder
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.init();
    this.onUfChange();
  }

  init(): void {
    this.submitted = false;
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      telefone: [''],
      email: ['', [Validators.maxLength(50)]],
      uf: [''],
      cidade: [''],
      cargo: ['', [Validators.maxLength(100)]]
    });
  }

  adicionarContato(contato: Contato): void {
    this.listaContato.push(contato);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contatoEditar != null && this.contatoEditar != null) {
      this.filterLocalidades(this.contatoEditar.uf);
      this.formGroup.controls.cidade.enable();

      this.formGroup.controls.nome.setValue(this.contatoEditar.nome);
      this.formGroup.controls.telefone.setValue(this.contatoEditar.telefone);
      this.formGroup.controls.email.setValue(this.contatoEditar.email);
      this.formGroup.controls.uf.setValue(this.contatoEditar.uf);
      this.formGroup.controls.cidade.setValue(this.contatoEditar.cidade);
      this.formGroup.controls.cargo.setValue(this.contatoEditar.cargo);
      this.contatoEditar = null;
    }
  }

  submit(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      if (
        this.formGroup.get('telefone').value !== undefined &&
        this.formGroup.get('telefone').value !== null &&
        this.formGroup.get('telefone').value !== ''
      ) {
        const telefoneF = this.formGroup.get('telefone').value?.toString().replace(/\D/g, '');
        this.formGroup.get('telefone').patchValue(telefoneF);
      }
      if (this.validateTelefoneEmail()) {
        this.alertService.error(
          this.translateService.instant('shared.titles.error'.toUpperCase()),
          this.translateService.instant('contato.validation.telefoneemail.required'.toUpperCase()),
          () => {
            this.validationFormFieldService.goFirst();
          }
        );
      } else {
        const entity: Contato = plainToClass(Contato, this.formGroup.value);
        entity.situacao = true;
        if (entity.cidade === undefined) {
          entity.cidade = null;
        }
        this.onAdicionar.emit(entity);
        this.init();
        this.onUfChange();
      }
    } else {
      this.validationError();
    }
  }

  validateTelefoneEmail(): boolean {
    return (
      (this.formGroup.get('telefone').value === undefined ||
        this.formGroup.get('telefone').value === null ||
        this.formGroup.get('telefone').value === '') &&
      (this.formGroup.get('email').value === undefined ||
        this.formGroup.get('email').value === null ||
        this.formGroup.get('email').value === '')
    );
  }

  onUfChange(): void {
    const selectedUf = this.formGroup.get('uf').value;
    if (selectedUf) {
      this.formGroup.get('cidade').setValue(null);
      this.filterLocalidades(selectedUf);
      this.formGroup.controls.cidade.enable();
    } else {
      this.formGroup.get('cidade').setValue(null);
      this.localidadeList = [];
      this.formGroup.controls.cidade.disable();
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: Contato): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }

  filterLocalidades(uf: string): void {
    this.integradorLocalidadeService.getLocalidadesByUf(uf).subscribe(data => {
      this.localidadeList = data.sort((a, b) => (a.descricaoLocalidade > b.descricaoLocalidade ? 1 : -1));
    });
  }
}
