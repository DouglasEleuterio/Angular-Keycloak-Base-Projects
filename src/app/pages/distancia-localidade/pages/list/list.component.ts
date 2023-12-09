import { Component } from '@angular/core';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { finalize } from 'rxjs/operators';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { ExporterTypeConfig } from 'src/app/core/domain/model/exporter-request.model';
import { BaseController } from 'src/app/core/domain/base.controller';
import { DistanciaLocalidade } from 'src/app/domain/distancia-localidade/distancia-localidades.model';
import { DistanciaLocalidadeService } from 'src/app/domain/distancia-localidade/distancia-localidade.service';

@Component({
  selector: 'app-distancia-localidade-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: DistanciaLocalidade[] = [];

  constructor(
    public service: DistanciaLocalidadeService,
    private alertService: AlertService,
    private baseController: BaseController,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService,
    private validationService: ValidationService,
    private loadingService: LoadingService
  ) {
    super('PaginationDistanciaLocalidade');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuDistanciaLocalidade,
      {
        label: 'distancia-localidade.title.page'
      }
    ]);
    this.setDefaultSort(true);
  }

  updateStatus(id: string, ativo: boolean): void {
    this.baseController.active(
      id,
      ativo,
      this.service,
      ativo ? 'distancia-localidade.message.inactived' : 'distancia-localidade.message.actived',
      () => this.fetch()
    );
  }

  remove(id: string): void {
    this.loadingService.startLoading();
    this.service
      .remove(id)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe({
        next: () => {
          this.alertService.defaultSuccess(this.translateService.instant('distancia-localidade.message.deleted_success'.toUpperCase()));
          this.fetch();
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }

  get exporterConfig(): ExporterTypeConfig {
    const baseColumns = [
      'id;Código',
      'ufOrigem;UF Origem',
      'localidadeOrigem.descricaoLocalidade;Localidade Origem',
      'ufDestino;UF Destino',
      'localidadeDestino.descricaoLocalidade;Localidade Destino',
      'distancia;Distância',
      'situacao;Ativo;Sim,Não'
    ];
    const pdfColumns = [...baseColumns, 'dataCriacao;Data de Cadastro;dd/MM/yyyy'];

    return this.generateExporterConfig(baseColumns, pdfColumns);
  }

  fetch(): void {
    this.loadingService.startLoading();
    this.service
      .paginate(this.pagination)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe(result => {
        this.tableData = result.content;
        this.pagination.totalRecords = result.totalElements;
      });
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'localidadeOrigem.descricaoLocalidade',
          order: 'asc'
        }
      ];
    }
  }
}
