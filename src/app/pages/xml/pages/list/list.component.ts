import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { XmlService } from '../../../../domain/xml/xml.service';
import { Xml } from '../../../../domain/xml/xml.model';
import { ExporterTypeConfig } from '../../../../core/domain/model/exporter-request.model';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';

@Component({
  selector: 'app-xml-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Xml[] = [];

  constructor(
    private loadingService: LoadingService,
    public service: XmlService,
    private translateService: TranslateService,
    private validationService: ValidationService,
    private alertService: AlertService
  ) {
    super('PaginationXml');
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
          this.alertService.defaultSuccess(this.translateService.instant('classificacao_localidade.message.deleted_success'.toUpperCase()));
          this.fetch();
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }

  get exporterConfig(): ExporterTypeConfig {
    const baseColumns = ['id;Código', 'versao;Versão', 'situacao;Ativo;Sim,Não'];
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
}
