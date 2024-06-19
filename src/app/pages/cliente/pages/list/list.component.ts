import { Component } from '@angular/core';
import { Cliente } from '../../../../domain/cliente/cliente';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { ClienteService } from '../../../../domain/cliente/cliente.service';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { Filter } from '../../../../core/api/filter/filter.model';
import { BaseController } from '../../../../core/domain/base.controller';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Cliente[] = [];

  listSelect = (u: Cliente) => [u.id, u.nome, u.cpf, u.email, u.genero, u.dataNascimento, u.telefone];

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private service: ClienteService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private loadingService: LoadingService
  ) {
    super('PaginationCliente');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'cliente.title.page'
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
          this.alertService.defaultSuccess(this.translateService.instant('exemplo.message.deleted_success'.toUpperCase()));
          this.fetch();
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }

  valueString(str: string): string {
    if (str === null) {
      str = '';
    }

    return str;
  }

  convertNumberToString(number: number): string {
    if (number === null) {
      return '';
    }
    return String(number);
  }
}
