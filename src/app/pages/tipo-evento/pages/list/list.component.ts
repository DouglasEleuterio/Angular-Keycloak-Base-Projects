import { Component, ViewChild } from '@angular/core';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { TipoEventoService } from 'src/app/domain/tipo-evento/tipo-evento.service';
import { TipoEvento } from 'src/app/domain/tipo-evento/tipo-evento.model';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';

@Component({
  selector: 'app-tipo-evento-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: TipoEvento[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: TipoEvento) => [u.id, u.descricao, u.situacao, u.dataCriacao];

  constructor(public service: TipoEventoService, private baseController: BaseController, private breadcrumbService: AppBreadcrumbService) {
    super('PaginationTipoEvento');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'tipo_evento.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'tipo_evento.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(id, ativo, this.service, ativo ? 'tipo_evento.message.inactived' : 'tipo_evento.message.actived', () =>
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
