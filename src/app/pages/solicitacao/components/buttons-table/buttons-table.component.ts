import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-buttons-table-solicitacao',
  templateUrl: './buttons-table.component.html',
  styleUrls: ['./buttons-table.component.scss']
})
export class ButtonsTableSolicitacaoComponent {
  @Input()
  entityId: number | string;

  @Input()
  showEdit = true;

  @Input()
  showDel = true;

  @Output()
  onRemove: EventEmitter<number | string> = new EventEmitter<number | string>();

  @Output()
  onHistoric: EventEmitter<void> = new EventEmitter<void>();

  constructor(private translateService: TranslateService, private confirmationService: ConfirmationService) {}

  routerLink(route: string): string {
    return `../${route}/${this.entityId}`;
  }

  remove(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant(`solicitacao.message.delete`.toUpperCase()),
      header: this.translateService.instant('shared.titles.delete'.toUpperCase()),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemove.emit(this.entityId);
      }
    });
  }

  historic(): void {
    this.onHistoric.emit();
  }
}
