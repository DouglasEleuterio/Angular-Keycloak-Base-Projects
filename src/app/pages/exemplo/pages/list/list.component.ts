import { Component } from '@angular/core';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { finalize } from 'rxjs/operators';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { Exemplo } from '../../../../domain/exemplo/exemplo.model';
import { ExemploService } from '../../../../domain/exemplo/exemplo.service';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';

@Component({
  selector: 'app-exemplo-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Exemplo[] = [];

  constructor(
    private service: ExemploService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService,
    private validationService: ValidationService,
    private loadingService: LoadingService
  ) {
    super('PaginationExemplo');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'exemplo.title.page'
      }
    ]);
  }

  remove(id: string): void {
    this.loadingService.startLoading();
    this.service
      .remove(id)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe({
        next: () => {
          this.alertService.defaultSuccess(this.translateService.instant('exemplo.message.deleted_success'.toUpperCase()));
          this.fetch();
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }

  fetch(): void {
    this.loadingService.startLoading();
    this.service
      .paginate(this.pagination)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe(result => {
        this.tableData = result.content;
        this.pagination.totalRecords = result.totalElements;
      });
  }
}
