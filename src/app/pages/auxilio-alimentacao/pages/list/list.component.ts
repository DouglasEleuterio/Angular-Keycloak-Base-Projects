import { Component, ViewChild } from '@angular/core';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';
import { AuxilioAlimentacao } from 'src/app/domain/auxilio-alimentacao/auxilio-alimentacao.model';
import { AuxilioAlimentacaoService } from 'src/app/domain/auxilio-alimentacao/auxilio-alimentacao.service';
import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: AuxilioAlimentacao[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: AuxilioAlimentacao) => [u.id, u.orgao, u.dias, u.situacao, u.dataCriacao];

  constructor(
    public service: AuxilioAlimentacaoService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService
  ) {
    super('PaginationAuxilioAlimentacao');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'auxilio_alimentacao.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'auxilio_alimentacao.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(
      id,
      ativo,
      this.service,
      ativo ? 'auxilio_alimentacao.message.inactived' : 'auxilio_alimentacao.message.actived',
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
    const baseColumns = ['id;Código', 'orgao;Órgão Externo', 'dias;Dias de Recebimento de Auxílio Alimentação', 'situacao;Ativo;Sim,Não'];
    const pdfColumns = [...baseColumns, 'dataCriacao;Data de Cadastro;dd/MM/yyyy'];

    return this.generateExporterConfig(baseColumns, pdfColumns);
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'orgao',
          order: 'asc'
        }
      ];
    }
  }
}
