import { Component, ViewChild } from '@angular/core';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { Evento } from 'src/app/domain/evento/evento.model';
import { EventoService } from 'src/app/domain/evento/evento.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { ListIdEventosRequest } from 'src/app/domain/evento/eventoIds.dto';
import { SituacaoCondicaoEnum } from 'src/app/domain/situacao-condicao/situacao-condicao.enum';
import { TranslateService } from '@ngx-translate/core';
import { Filter } from 'src/app/core/api/filter/filter.model';

@Component({
  selector: 'app-evento-list',
  templateUrl: './list.component.html'
})
export class ListComponent extends PaginatorComponent {
  tableData: Evento[] = [];

  @ViewChild('filterRef') filterRef: FilterRefDirective;

  situacaoAberto = SituacaoCondicaoEnum.ABERTO;
  selected: number | string[] = [];

  listSelect = (u: Evento) => [
    u.id,
    u.nomeEvento,
    u.tipoEvento,
    u.descricao,
    u.dataInicio,
    u.dataTermino,
    u.organizadora,
    u.situacaoCondicao,
    u.situacao
  ];

  constructor(
    public service: EventoService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    super('PaginationEvento');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'evento.title.page'
      }
    ]);
    this.setDefaultSort(true);
    this.clearFilter();
  }

  finalizar(): void {
    this.alterarSituacaoCondicao(SituacaoCondicaoEnum.FINALIZADO);
  }

  cancelar(): void {
    this.alterarSituacaoCondicao(SituacaoCondicaoEnum.CANCELADO);
  }

  alterarSituacaoCondicao(acao: SituacaoCondicaoEnum) {
    const listIdEventosRequest = new ListIdEventosRequest();
    listIdEventosRequest.listIdsEvento = this.selected;

    if (this.selected.toString() === '') {
      this.alertService.warn(
        this.translateService.instant(`shared.titles.error`.toUpperCase()),
        this.translateService.instant(`evento.message.no_selected`.toUpperCase())
      );
      return;
    }

    this.service.alterarSituacaoCondicao(listIdEventosRequest, acao).subscribe({
      next: () => {
        this.alertService.success('', this.translateService.instant(`evento.message.${acao}`.toUpperCase()));
        this.fetch();
      },
      error: error => this.alertService.defaultError(error)
    });
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'evento.message.deleted_success', () => this.fetch());
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(id, ativo, this.service, ativo ? 'evento.message.inactived' : 'evento.message.actived', () => this.fetch());
  }

  fetch(): void {
    if (this.pagination.filter == null) {
      this.pagination.filter = new Filter({ search: `situacaoCondicao==${SituacaoCondicaoEnum.ABERTO}` }, null);
    } else {
      this.isValidate();
    }

    this.baseController.fetchSelect(this.listSelect, this.pagination, this.service, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
    });
  }

  get exporterConfig(): ExporterTypeConfig {
    return this.generateExporterConfig([
      'nomeEvento;Evento',
      'tipoEvento.descricao;Tipo de Evento',
      'descricao;Descrição',
      'dataInicio;Data de Início;dd/MM/yyyy',
      'dataTermino;Data de Término;dd/MM/yyyy',
      'organizadora;Organizadora',
      'situacaoCondicao;Situação',
      'situacao;Ativo;Sim,Não'
    ]);
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'nomeEvento',
          order: 'asc'
        }
      ];
    }
  }

  isValidate(): void {
    const filters = this.pagination.filter.filters;
    if (filters.dataInicioInicial != null && filters.dataInicioFinal != null) {
      const isInvalidDatasInicio = filters.dataInicioInicial > filters.dataInicioFinal;

      if (isInvalidDatasInicio) {
        this.alertService.defaultError(this.translateService.instant('evento.message.error_dates_inicio'.toUpperCase()));
      }
    }
    if (filters.dataTerminoInicial != null && filters.dataTerminoFinal != null) {
      const isInvalidDatasTermino = filters.dataTerminoInicial > filters.dataTerminoFinal;

      if (isInvalidDatasTermino) {
        this.alertService.defaultError(this.translateService.instant('evento.message.error_dates_termino'.toUpperCase()));
      }
    }
  }
}
