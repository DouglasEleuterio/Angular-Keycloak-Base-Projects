import { Component } from '@angular/core';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { Termo } from '../../../../domain/termo/termo-model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { BaseController } from '../../../../core/domain/base.controller';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { TermoService } from '../../../../domain/termo/termo.service';
import { Filter } from '../../../../core/api/filter/filter.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Termo[] = [];

  listSelect = (u: Termo) => [u.id, u.versao, u.procedimento, u.documento.id, u.documento.conteudo];

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private service: TermoService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private loadingService: LoadingService
  ) {
    super('PaginatorTermo');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'termo.title.page'
      }
    ]);
    this.fetch();
  }

  fetch(): void {
    this.loadingService.startLoading();
    if (this.pagination.filter == null) {
      this.pagination.filter = new Filter({ search: `situacao==true` }, null);
      this.pagination.sort = [{ field: 'versao', order: 'desc' }];
    }
    this.baseController.fetchSelect(this.listSelect, this.pagination, this.service, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
      this.loadingService.stopLoading();
    });
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
          this.alertService.defaultSuccess(this.translateService.instant('termo.message.deleted_success'.toUpperCase()));
          this.fetch();
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }
}
