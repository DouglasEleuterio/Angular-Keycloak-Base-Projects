import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../../domain/cliente/cliente';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs/operators';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ClienteService } from '../../../../domain/cliente/cliente.service';
import { Filter } from '../../../../core/api/filter/filter.model';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { BaseController } from '../../../../core/domain/base.controller';
import { Historico } from '../../../../domain/historico/historico.model';
import { HistoricoService } from '../../../../domain/historico/historico.service';
import { ETipoEntidade } from '../../../../domain/historico/tipo-entidade.enum';
import * as moment from 'moment';
import { AuthenticationService } from '../../../../core/auth/auth.service';
import { PermissionEnum } from '../../../../domain/permission/permission.enum';
import { AuditoriaService } from '../../../../domain/auditoria/auditoria-service';
import { Auditoria } from '../../../../domain/auditoria/auditoria.model';
import { ESituacaoRegistro } from '../../../../domain/auditoria/situacao-registro.enum';
import { EEvento } from '../../../../domain/historico/evento.enum';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends PaginatorComponent implements OnInit {
  private id: number | string;
  public entity: Cliente;
  auditorias: Auditoria[] = [];
  tableData: Historico[] = [];
  dadoAntigo: Cliente;
  dadoAtual: Cliente;

  menuBack: AppMenuItem = AppMenuModel.itemMenuCliente;

  listHistoricoSelect = (u: Historico) => [u.id, u.tipoEvento, u.dataOcorrencia, u.nomeUsuario, u.idEntidadeGeradora, u.tipoEntidade];

  listAuditoriaSelect = (u: Auditoria) => [u.id, u.situacaoRegistro, u.dado];

  constructor(
    private route: ActivatedRoute,
    private service: ClienteService,
    private historicoService: HistoricoService,
    private auditoriaService: AuditoriaService,
    private router: Router,
    private validationService: ValidationService,
    private alertService: AlertService,
    private baseController: BaseController,
    private loadingService: LoadingService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService
  ) {
    super('PaginationHistoricoCliente');
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap((params: Params) => (this.id = params.id)),
        switchMap((params: Params) => this.service.get(params.id))
      )
      .subscribe({
        next: entity => this.onLoad(entity),
        error: error => {
          this.router.navigate(this.menuBack.routerLink).then(() => this.validationService.handle(null, error));
        }
      });
  }

  onLoad(entity: Cliente): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('cliente.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.fetchHistorico();
    }
  }

  cancel(): void {
    this.router.navigate(this.menuBack.routerLink).then();
  }

  convertNumberToString(number: number): string {
    if (number === null) {
      return '';
    }
    return String(number);
  }

  valueString(str: string): string {
    if (str === null) {
      str = '';
    }

    return str;
  }

  fetchHistorico(): void {
    this.loadingService.startLoading();
    if (this.pagination.filter == null) {
      this.pagination.filter = new Filter({ search: `idEntidadeGeradora==${this.id};tipoEntidade==${ETipoEntidade.CLIENTE}` }, null);
      this.pagination.sort = [{ field: 'id', order: 'desc' }];
    }
    this.baseController.fetchSelect(this.listHistoricoSelect, this.pagination, this.historicoService, result => {
      this.tableData = result.content;
      this.pagination.totalRecords = result.totalElements;
      this.loadingService.stopLoading();
    });
  }

  fetch(): void {}

  getHeader(h: Historico) {
    return `Data evento: ${moment(h.dataOcorrencia).format('DD/MM/YYYY HH:mm:ss')} | Tipo de Evento: ${h.tipoEvento} | Nome Usuário: ${
      h.nomeUsuario
    }`;
  }

  obterRegistrosAuditoria(h: Historico) {
    this.pagination.filter = new Filter({ search: `historico.id==${h.id}` }, null);
    this.baseController.fetch(this.pagination, this.auditoriaService, result => {
      this.auditorias = result.content;
      const entity: Cliente = JSON.parse(result.content[0].dado);
      this.dadoAtual = JSON.parse(this.auditorias.find(auditoria => auditoria.situacaoRegistro == ESituacaoRegistro.ATUAL).dado);
      this.dadoAntigo = JSON.parse(this.auditorias.find(auditoria => auditoria.situacaoRegistro == ESituacaoRegistro.ANTERIOR).dado);
    });
  }

  isUsuarioAdminEEventoEdicao(h: Historico) {
    return this.authenticationService.checkPermission([PermissionEnum.ADMINISTRADOR]) && h.tipoEvento == EEvento.EDICAO;
  }

  protected readonly EEvento = EEvento;
}
