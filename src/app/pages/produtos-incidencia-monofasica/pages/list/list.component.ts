import { Component } from '@angular/core';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { ProdutoIncidenciaMonofasica } from '../../../../domain/produtos-incidencia-monofasica/produtos-incidencia-monofasica-model';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { ProdutosIncidenciaMonofasicaService } from '../../../../domain/produtos-incidencia-monofasica/produtos-incidencia-monofasica.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: ProdutoIncidenciaMonofasica[] = [];

  constructor(
    private service: ProdutosIncidenciaMonofasicaService,
    private loadingService: LoadingService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    super('PaginationProdutosIncidenciaMonofasica');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'produtos_incidencia_monofasica.title.page'
      }
    ]);
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
