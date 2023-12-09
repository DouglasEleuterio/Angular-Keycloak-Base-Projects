import { Component, ViewChild } from '@angular/core';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { IndenizacaoTransporte } from 'src/app/domain/indenizacao-transporte/indenizacao-transporte.model';
import { IndenizacaoTransporteService } from 'src/app/domain/indenizacao-transporte/indenizacao-transporte.service';

@Component({
  selector: 'app-indenizacao-transporte-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: IndenizacaoTransporte[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: IndenizacaoTransporte) => [u.id, u.normativo, u.vigenciaInicial, u.vigenciaFinal, u.situacao, u.dataCriacao];

  constructor(
    public service: IndenizacaoTransporteService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService
  ) {
    super('PaginationIndenizacaoTransporte');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'indenizacao_transporte.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'indenizacao_transporte.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(
      id,
      ativo,
      this.service,
      `indenizacao_transporte.message.${ativo ? 'inactived' : 'actived'}`,
      () => this.fetch(),
      () => this.fetch()
    );
  }

  fetch(): void {
    this.baseController.fetchSelect(this.listSelect, this.pagination, this.service, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
    });
  }

  get exporterConfig(): ExporterTypeConfig {
    return this.generateExporterConfig([
      'id;Código',
      'normativo;Normativo',
      'vigenciaInicial;Vigência Inicial;dd/MM/yyyy',
      'vigenciaFinal;Vigência Final;dd/MM/yyyy'
    ]);
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'dataCriacao',
          order: 'desc'
        }
      ];
    }
  }
}
