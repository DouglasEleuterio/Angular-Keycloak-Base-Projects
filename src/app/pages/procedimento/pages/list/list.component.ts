import { Component } from '@angular/core';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
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
import { ProcedimentoCreateRequest } from '../../../../domain/procedimento/create/procedimento-create-request-model';
import { RegiaoCreateRequest } from '../../../../domain/procedimento/create/regiao-create-request-model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: ProcedimentoCreateRequest[] = [];

  listSelect = (u: any) => [
    u.id,
    u.nome,
    u.regioes.id,
    u.regioes.nome,
    u.regioes.profissional.id,
    u.regioes.profissional.nome,
    u.situacao,
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

  getTotalRegioes(regioes: RegiaoCreateRequest[]): number {
    return regioes.filter(reg => reg.nome !== null).length;
  }
}
