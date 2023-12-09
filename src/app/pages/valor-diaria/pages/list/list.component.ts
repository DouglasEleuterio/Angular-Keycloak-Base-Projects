import { Component, ViewChild } from '@angular/core';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';
import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { ValorDiaria } from 'src/app/domain/valor-diaria/valor-diaria.model';
import { ValorDiariaService } from 'src/app/domain/valor-diaria/valor-diaria.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: ValorDiaria[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: ValorDiaria) => [u.id, u.valor, u.tipoLocalidade.descricao, u.normativo, u.dataNormativo, u.cargo, u.situacao];

  constructor(public service: ValorDiariaService, private baseController: BaseController, private breadcrumbService: AppBreadcrumbService) {
    super('PaginationValorDiaria');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'valor_diaria.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'valor_diaria.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(id, ativo, this.service, ativo ? 'valor_diaria.message.inactived' : 'valor_diaria.message.actived', () =>
      this.fetch()
    );
  }

  fetch(): void {
    this.baseController.fetch(this.pagination, this.service, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
    });
  }

  get exporterConfig(): ExporterTypeConfig {
    return this.generateExporterConfig([
      'valor;Valor;real',
      'tipoLocalidade.descricao;Tipo de Localidade',
      'cargo;Inclui',
      'normativo;Normativo',
      'dataNormativo;Data da Publicação do Normativo;dd/MM/yyyy',
      'situacao;Ativo;Sim,Não'
    ]);
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'tipoLocalidade.descricao',
          order: 'asc'
        }
      ];
    }
  }
}
