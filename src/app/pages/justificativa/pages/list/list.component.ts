import { Component, ViewChild } from '@angular/core';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';
import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { Justificativa } from 'src/app/domain/justificativa/justificativa.model';
import { JustificativaService } from 'src/app/domain/justificativa/justificativa.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Justificativa[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: Justificativa) => [u.id, u.descricao, u.situacao, u.dataCriacao];

  constructor(
    public service: JustificativaService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService
  ) {
    super('PaginationJustificativa');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'justificativa.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'justificativa.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(id, ativo, this.service, ativo ? 'justificativa.message.inactived' : 'justificativa.message.actived', () =>
      this.fetch()
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
