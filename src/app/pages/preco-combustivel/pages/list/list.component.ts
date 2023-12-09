import { Component, ViewChild } from '@angular/core';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { PrecoCombustivelService } from 'src/app/domain/preco-combustivel/preco-combustivel.service';
import { PrecoCombustivel } from 'src/app/domain/preco-combustivel/preco-combustivel.model';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';

@Component({
  selector: 'app-preco-combustivel-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: PrecoCombustivel[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: PrecoCombustivel) => [
    u.id,
    u.precoGasolina,
    u.precoEtanol,
    u.precoDiesel,
    u.precoGNV,
    u.normativo,
    u.situacao,
    u.dataCriacao
  ];

  constructor(
    public service: PrecoCombustivelService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService
  ) {
    super('PaginationPrecoCombustivel');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'preco_combustivel.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'preco_combustivel.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(id, ativo, this.service, `preco_combustivel.message.${ativo ? 'inactived' : 'actived'}`, () => this.fetch());
  }

  fetch(): void {
    this.baseController.fetchSelect(this.listSelect, this.pagination, this.service, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
    });
  }

  get exporterConfig(): ExporterTypeConfig {
    const baseColumns = [
      'id;Código',
      'precoGasolina;Preço Gasolina;real',
      'precoEtanol;Preço Etanol;real',
      'precoDiesel;Preço Diesel;real',
      'precoGNV;Preço GNV;real',
      'normativo;Normativo',
      'situacao;Ativo;Sim,Não'
    ];
    const pdfColumns = [...baseColumns, 'dataCriacao;Data de Cadastro;dd/MM/yyyy'];

    return this.generateExporterConfig(baseColumns, pdfColumns);
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
