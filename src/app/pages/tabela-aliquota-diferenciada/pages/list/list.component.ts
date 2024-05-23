import { Component } from '@angular/core';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { finalize } from 'rxjs/operators';
import { TabelaAliquotaDiferenciadaService } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.service';
import { TabelaAliquotaDiferenciada } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.model';
import { Filter } from '../../../../core/api/filter/filter.model';
import { BaseController } from '../../../../core/domain/base.controller';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: TabelaAliquotaDiferenciada[] = [];

  constructor(
    private service: TabelaAliquotaDiferenciadaService,
    private baseController: BaseController,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService,
    private validationService: ValidationService,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {
    super('PaginationTabelaIncidencia');
    this.breadcrumbService.setItems([
      AppMenuModel.itemTabelaAliquotaDiferenciada,
      {
        label: 'tabela-aliquota-diferenciada.title.page'
      }
    ]);
  }

  listSelect = (u: TabelaAliquotaDiferenciada) => [u.id, u.ncm, u.inicioVigencia, u.fimVigencia, u.situacao, u.enumSituacao];

  fetch3(): void {
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

  fetch(): void {
    // Caso não possua filtro, aplicar filtro padrão
    this.loadingService.startLoading();
    if (this.pagination.filter == null) {
      this.pagination.filter = new Filter({ search: `id!=0;situacao==true;enumSituacao==ATIVO` }, null);
      this.pagination.sort = [{ field: 'inicioVigencia', order: 'desc' }];
    } else {
      // Caso filtro definido, validar filtro e adicionar situação = true.
      this.pagination.filter.filters['search'] = `${this.pagination.filter.filters['search']};situacao==true`;
    }

    this.baseController.fetchSelect(this.listSelect, this.pagination, this.service, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
      this.loadingService.stopLoading();
    });
  }

  remove($event: number) {
    this.loadingService.startLoading();
    this.service
      .remove($event)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe({
        next: () => {
          this.alertService.defaultSuccess(
            this.translateService.instant('tabela_aliquota_diferenciada.message.deleted_success'.toUpperCase())
          );
          this.fetch();
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }

  private isValidate(): void {
    const filters = this.pagination.filter.filters;
    if (filters.inicioVigencia != null && filters.fimVigencia != null) {
      const isInvalidDatasInicio = filters.inicioVigencia > filters.fimVigencia;
      if (isInvalidDatasInicio) {
        this.alertService.defaultError(
          this.translateService.instant('tabela_aliquota_diferenciada.message.error_dates_inicio'.toUpperCase())
        );
      }
    }
  }
}
