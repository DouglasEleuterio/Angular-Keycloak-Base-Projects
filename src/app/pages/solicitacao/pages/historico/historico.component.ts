import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Filter } from 'src/app/core/api/filter/filter.model';
import { BaseController } from 'src/app/core/domain/base.controller';
import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { HistoricoSituacaoSolicitacao } from 'src/app/domain/historico-situacao-solicitacao/historico-situacao-solicitacao.model';
import { HistoricoSituacaoSolicitacaoService } from 'src/app/domain/historico-situacao-solicitacao/historico-situacao-solicitacao.service';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';

@Component({
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss']
})
export class HistoricoComponent extends PaginatorComponent {
  menuBack: AppMenuItem = AppMenuModel.itemMenuSolicitacao;

  tableData: HistoricoSituacaoSolicitacao[] = [new HistoricoSituacaoSolicitacao()];
  idSolicitacao: string | number;

  visibleModal = false;
  contentModal = '';

  constructor(
    public service: HistoricoSituacaoSolicitacaoService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService,
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super('PaginationHistoricoSolicitacao');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'solicitacao.title.historic'
      }
    ]);
    this.setDefaultSort(true);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idSolicitacao = params.get('id');
    });
  }

  showDialog(content: string): void {
    this.contentModal = content;
    this.visibleModal = true;
  }

  fetch(): void {
    this.pagination.filter = new Filter({ search: `solicitacao.id==${this.idSolicitacao}` }, null);

    this.service.paginate(this.pagination).subscribe({
      next: result => {
        this.tableData = result.content;
        this.pagination.totalRecords = result.totalElements;
      },
      error: error => this.validationService.handleErrorAlert(error)
    });
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

  cancel(): void {
    this.router.navigate(this.menuBack.routerLink).then();
  }
}
