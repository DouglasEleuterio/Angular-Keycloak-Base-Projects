import { Component, ViewChild } from '@angular/core';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';
import { LocalDificilAcesso } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.model';
import { LocalDificilAcessoService } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.service';
import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: LocalDificilAcesso[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  listSelect = (u: LocalDificilAcesso) => [u.id, u.localidade, u.nome, u.distancia, u.tempo, u.condicoes, u.situacao];

  constructor(
    public service: LocalDificilAcessoService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService
  ) {
    super('PaginationLocalDificilAcesso');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'local_dificil_acesso.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'local_dificil_acesso.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(
      id,
      ativo,
      this.service,
      ativo ? 'local_dificil_acesso.message.inactived' : 'local_dificil_acesso.message.actived',
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
      'localidade.descricaoLocalidade;Localidade',
      'nome;Nome',
      'distancia;Distância da Sede (km)',
      'tempo;Tempo médio de Viagem (horas)',
      'condicoes;Condições de acesso',
      'situacao;Ativo;Sim,Não'
    ]);
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'localidade',
          order: 'asc'
        }
      ];
    }
  }
}
