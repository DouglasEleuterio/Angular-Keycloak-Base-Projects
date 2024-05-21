import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnvService } from '../../../../env/env.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [MessageService]
})
export class FormComponent {
  path = '/upload';
  urlUpload: string;

  uploadedFiles: any[] = [];

  constructor(private envService: EnvService, private messageService: MessageService) {
    this.urlUpload = `${this.envService.environment.baseUrl}${this.path}`;
  }

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    // this.alertService.defaultSuccess(this.translateService.instant('solicitacao.message.success'.toUpperCase()));
    this.messageService.add({
      severity: 'info',
      summary: this.uploadedFiles.length > 1 ? 'Arquivos enviados' : 'Arquivo enviado',
      detail: ''
    });
    this.uploadedFiles = [];
  }

  envioError(upload: FileUpload) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro no envio do arquivo',
      detail: ''
    });
  }
}
