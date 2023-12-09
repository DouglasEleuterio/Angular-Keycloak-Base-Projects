import { Component, ViewChild } from '@angular/core';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';
import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: TipoLocalidade[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: TipoLocalidade) => [u.id, u.descricao, u.situacao, u.dataCriacao];

  constructor(
    public service: TipoLocalidadeService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService
  ) {
    super('PaginationTipoLocalidade');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'tipo_localidade.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'tipo_localidade.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(
      id,
      ativo,
      this.service,
      ativo ? 'tipo_localidade.message.inactived' : 'tipo_localidade.message.actived',
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
    const baseColumns = ['id;Código', 'descricao;Descrição', 'situacao;Ativo;Sim,Não'];
    const pdfColumns = [...baseColumns, 'dataCriacao;Data de Cadastro;dd/MM/yyyy'];

    return this.generateExporterConfig(baseColumns, pdfColumns);
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'descricao',
          order: 'asc'
        }
      ];
    }
  }
}
