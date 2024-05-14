import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { EnvService } from '../../../../env/env.service';

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

  constructor(
    private envService: EnvService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {
    this.urlUpload = `${this.envService.environment.baseUrl}${this.path}`;
  }

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.alertService.defaultSuccess(this.translateService.instant('solicitacao.message.success'.toUpperCase()));
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
}
