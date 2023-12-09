import { Component } from '@angular/core';

import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';

import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';

import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';

import { SituacaoSolicitacaoEnum } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.enum';
import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitacao-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Solicitacao[] = [new Solicitacao()];

  constructor(
    public service: SolicitacaoService,
    private baseController: BaseController,
    private breadcrumbService: AppBreadcrumbService,
    private validationService: ValidationService,
    private router: Router
  ) {
    super('PaginationSolicitacao');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'solicitacao.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  remove(id: string): void {
    this.baseController.remove(id, this.service, 'solicitacao.message.deleted_success', () => this.fetch());
  }

  historic(id: string | number): void {
    const link = `${AppMenuModel.itemMenuSolicitacao.routerLink.toString()}/historic/${id}`;
    this.router.navigate([link]).then();
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(id, ativo, this.service, ativo ? 'solicitacao.message.inactived' : 'solicitacao.message.actived', () =>
      this.fetch()
    );
  }

  fetch(): void {
    this.service.paginateWithEventos(this.pagination).subscribe({
      next: result => {
        this.tableData = result.content;
        this.pagination.totalRecords = result.totalElements;
      },
      error: error => this.validationService.handleErrorAlert(error)
    });
  }

  showEdit(chave: string): boolean {
    const show = chave === SituacaoSolicitacaoEnum.INICIADA || chave === SituacaoSolicitacaoEnum.DEVOLVIDA;
    return chave ? show : false;
  }

  showDel(chave: string): boolean {
    const show = chave === SituacaoSolicitacaoEnum.INICIADA;
    return chave ? show : false;
  }

  get exporterConfig(): ExporterTypeConfig {
    const pdfColumns = [
      'id;Número',
      'solicitante.nome;Solicitante',
      'situacaoSolicitacao.situacaoSolicitacaoFase.descricao;Fase',
      'situacaoSolicitacao.descricao;Situação da Solicitação',
      'situacao;Ativo;Sim,Não'
    ];

    const baseColumns = [...pdfColumns, 'dataCriacao;Data de Cadastro;dd/MM/yyyy', 'dataAtualizacao;Data de Atualização;dd/MM/yyyy'];

    return this.generateExporterConfig(baseColumns, pdfColumns);
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'id',
          order: 'asc'
        }
      ];
    }
  }
}
