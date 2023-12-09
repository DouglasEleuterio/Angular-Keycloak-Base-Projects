import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

type OnAfterClose = () => void;

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private messageService: MessageService, private translate: TranslateService) {}

  info(title: string, message: string, onAfterClose?: OnAfterClose): void {
    this.messageService.add({ severity: 'info', summary: title, detail: message });
    if (onAfterClose != null) {
      onAfterClose();
    }
  }

  success(title: string, message: string, onAfterClose?: OnAfterClose): void {
    this.messageService.add({ severity: 'success', summary: title, detail: message });
    if (onAfterClose != null) {
      onAfterClose();
    }
  }

  error(title: string, message: string, onAfterClose?: OnAfterClose): void {
    this.messageService.add({ severity: 'error', summary: title, detail: message });
    if (onAfterClose != null) {
      onAfterClose();
    }
  }

  warn(title: string, message: string, onAfterClose?: OnAfterClose): void {
    this.messageService.add({ severity: 'warn', summary: title, detail: message });
    if (onAfterClose != null) {
      onAfterClose();
    }
  }

  defaultError(message: string, onAfterClose?: OnAfterClose): void {
    this.error(this.translate.instant('shared.titles.error'.toUpperCase()), message, onAfterClose);
  }

  defaultSuccess(message: string, onAfterClose?: OnAfterClose): void {
    this.success(this.translate.instant('shared.titles.success'.toUpperCase()), message, onAfterClose);
  }

  defaultWarn(message: string, onAfterClose?: OnAfterClose): void {
    this.warn(this.translate.instant('shared.titles.warn'.toUpperCase()), message, onAfterClose);
  }

  defaultInfo(message: string, onAfterClose?: OnAfterClose): void {
    this.info(this.translate.instant('shared.titles.info'.toUpperCase()), message, onAfterClose);
  }

  error404(onAfterClose?: OnAfterClose): void {
    this.error(this.translate.instant('shared.titles.error'.toUpperCase()), this.translate.instant('shared.error.404'), onAfterClose);
  }

  error500(onAfterClose?: OnAfterClose): void {
    this.error(this.translate.instant('shared.titles.error'.toUpperCase()), this.translate.instant('shared.error.500'), onAfterClose);
  }
}
