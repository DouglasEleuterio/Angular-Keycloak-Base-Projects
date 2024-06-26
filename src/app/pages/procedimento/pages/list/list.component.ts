import { Component } from '@angular/core';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { Procedimento } from '../../../../domain/procedimento/procedimento-model';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { BaseController } from '../../../../core/domain/base.controller';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { ProcedimentoService } from '../../../../domain/procedimento/procedimento.service';
import { Filter } from '../../../../core/api/filter/filter.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Procedimento[] = [];

  listSelect = (u: Procedimento) => [
    u.id,
    u.nome,
    u.valor,
    u.situacao,
    u.quantidadeSessoes,
    u.intervaloEntreSessoes,
    u.dataCriacao,
    u.dataAtualizacao
  ];

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private service: ProcedimentoService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private loadingService: LoadingService
  ) {
    super('PaginationProcedimento');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'procedimento.title.page'
      }
    ]);
  }

  fetch(): void {
    this.loadingService.startLoading();
    if (this.pagination.filter == null) {
      this.pagination.filter = new Filter({ search: `situacao==true` }, null);
      this.pagination.sort = [{ field: 'nome', order: 'asc' }];
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
          this.alertService.defaultSuccess(this.translateService.instant('procedimento.message.deleted_success'.toUpperCase()));
          this.fetch();
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }
}
