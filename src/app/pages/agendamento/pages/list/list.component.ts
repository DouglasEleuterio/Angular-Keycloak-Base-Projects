import { Component } from '@angular/core';
import { Evento } from '../../../../domain/pre-agendamento/evento';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { Filter } from '../../../../core/api/filter/filter.model';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { BaseController } from '../../../../core/domain/base.controller';
import { EventoService } from '../../../../domain/pre-agendamento/evento.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Evento[] = [];

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private loadingService: LoadingService,
    private service: EventoService,
    private baseController: BaseController
  ) {
    super('PaginationAgendamento');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'pre-agendamento.title.page'
      }
    ]);
  }

  listSelect = (u: any) => [
    u.id,
    u.allDay,
    u.title,
    u.start,
    u.end,
    u.confirmado,
    u.backgroundColor,
    u.aquisicaoProcedimento.id,
    u.aquisicaoProcedimento.nome,
    u.aquisicaoProcedimento.profissional.id,
    u.aquisicaoProcedimento.profissional.nome,
    u.aquisicaoProcedimento.procedimento,
    u.aquisicaoProcedimento.aquisicao.id,
    u.aquisicaoProcedimento.aquisicao.cliente.id,
    u.aquisicaoProcedimento.aquisicao.cliente.nome
  ];

  fetch(): void {
    this.loadingService.startLoading();
    if (this.pagination.filter == null) {
      this.pagination.filter = new Filter({ search: `situacao==true;confirmado==true` }, null);
      this.pagination.sort = [{ field: 'start', order: 'asc' }];
    }
    this.baseController.fetchSelect(this.listSelect, this.pagination, this.service, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
      this.loadingService.stopLoading();
    });
  }
}
