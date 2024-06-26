import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { PermissionEnum } from '../../domain/permission/permission.enum';

@Component({
  selector: 'app-table-buttons',
  templateUrl: './table-buttons.component.html',
  styleUrls: ['./table-buttons.component.scss']
})
export class TableButtonsComponent {
  @Input()
  entityId: number | string;

  @Input()
  page: string;

  @Input()
  detailPermission?: PermissionEnum;

  @Input()
  editPermission?: PermissionEnum;

  @Input()
  removePermission?: PermissionEnum;

  @Input()
  disabled = false;

  @Output()
  onRemove: EventEmitter<number | string> = new EventEmitter<number | string>();

  constructor(private translateService: TranslateService, private confirmationService: ConfirmationService) {}

  routerLink(route: string): string {
    return `../${route}/${this.entityId}`;
  }

  remove(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant(`${this.page}.message.delete`.toUpperCase()),
      header: this.translateService.instant('shared.titles.delete'.toUpperCase()),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemove.emit(this.entityId);
      }
    });
  }
}
