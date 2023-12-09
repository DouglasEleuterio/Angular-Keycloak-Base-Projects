import { Component, Input } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { ArquivoUtils } from '../util/arquivo.utils';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-file-upload-button',
  templateUrl: './file-upload-button.component.html',
  styleUrls: ['./file-upload-button.component.scss']
})
export class FileUploadButtonComponent {
  @Input() control: AbstractControl;
  @Input() tiposArquivosValidos: string[];
  @Input() controlName: string;
  @Input() page: string;
  @Input() submitted = false;
  @Input() isDetail = false;

  constructor(protected alertService: AlertService, protected translateService: TranslateService) {}

  onSelectFile(event, documento): void {
    this.control.reset();

    const file: File = event.files[0];
    let arquivoDoTipoValido = false;

    this.tiposArquivosValidos.forEach(tipo => {
      if (file.name.slice(-5).includes(tipo)) arquivoDoTipoValido = true;
    });

    let errorType = null;

    if (file.size >= 11000000) {
      errorType = { max_size: true };
    }
    if (file.size <= 0) {
      errorType = { invalid_size: true };
    }
    if (!arquivoDoTipoValido) {
      errorType = { invalid_type: true };
    }

    this.control.setErrors(errorType);

    if (!errorType) {
      this.inputFile(file);
      this.control.setValue(file);
    } else {
      const keyValidation = Object.keys(this.control.errors)[0];
      this.invalidFormPoupup(`validation.${keyValidation}`);
      this.control.setValue(null);
    }

    documento.clear();
  }

  inputFile(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.control.setValue({
        nomeArquivo: file.name,
        extensaoArquivo: file.type,
        anexoDocumento: reader.result.toString().split(',')[1]
      });
    };
  }

  resetSelectedFile(documento): void {
    if (this.control?.value) {
      documento.clear();
      this.control.setValue(null);
      this.control.setValidators(Validators.required);
      this.control.updateValueAndValidity();
    }
  }

  download(): void {
    const file = this.control?.value;

    const data = ArquivoUtils.base64ToArrayBuffer(file.anexoDocumento);
    const blob = new Blob([data], { type: file.extensaoArquivo });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = file.nomeArquivo;
    link.click();
    document.close();
  }

  invalidFormPoupup(key: string): void {
    this.alertService.error(
      this.translateService.instant('shared.titles.error'.toUpperCase()),
      this.translateService.instant(key.toUpperCase())
    );
  }

  get translateFieldName(): string {
    return `field.${this.controlName}`;
  }

  get getArquivoLabel(): string {
    const nome = this.control?.value?.nomeArquivo;
    const tamanho = ArquivoUtils.fileSizeFormated(this.control?.value?.anexoDocumento?.length);

    return nome && tamanho ? nome + ' - ' + tamanho : null;
  }
}
