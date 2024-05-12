import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [MessageService]
})
export class FormComponent {
  urlUpload = 'http://localhost:8070/upload/list';

  uploadedFiles: any[] = [];

  constructor(private alertService: AlertService, private translateService: TranslateService, private messageService: MessageService) {}

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.alertService.defaultSuccess(this.translateService.instant('solicitacao.message.success'.toUpperCase()));
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
}
