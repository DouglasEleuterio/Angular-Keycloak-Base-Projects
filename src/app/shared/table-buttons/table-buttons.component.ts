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
  downloadPermission?: PermissionEnum;

  @Input()
  disabled = false;

  @Input()
  showEdit: boolean | null = true;

  @Input()
  isDownloadVisivel: boolean;

  @Output()
  onRemove: EventEmitter<number | string> = new EventEmitter<number | string>();

  @Output()
  onDownload: EventEmitter<number | string> = new EventEmitter<number | string>();

  constructor(private translateService: TranslateService, private confirmationService: ConfirmationService) {}

  routerLink(route: string): string {
    return `../${route}/${this.entityId}`;
  }

  remove(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant(`${this.page}.message.delete_confirm`.toUpperCase()),
      header: this.translateService.instant('shared.titles.delete'.toUpperCase()),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemove.emit(this.entityId);
      }
    });
  }

  download() {
    this.confirmationService.confirm({
      message: this.translateService.instant(`${this.page}.message.download`.toUpperCase()),
      header: this.translateService.instant('shared.titles.download'.toUpperCase()),
      icon: 'pi pi-download',
      accept: () => {
        this.onDownload.emit(this.entityId);
      }
    });
  }
}
