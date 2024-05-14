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

  download(id: string) {
    this.service.onDownload(id, 'download').subscribe(res => {
      const a = document.createElement('a');
      const contentDisposition = res.headers.get('content-disposition');
      a.download = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
      a.href = window.URL.createObjectURL(res.body);
      a.click();
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
        console.log(this.tableData);
        this.pagination.totalRecords = result.totalElements;
      });
  }

  getNatureza(natOp: string) {
    if (natOp.toLowerCase().includes('venda') || natOp.toLowerCase().includes('vda')) return 'VENDA';
    if (natOp.toLowerCase().includes('bonificacao')) return 'BONIFICAÇÃO';
    if (natOp.toLowerCase().includes('brinde')) return 'BRINDE';
    if (natOp.toLowerCase().includes('troca')) return 'TROCA';
    else {
      return natOp;
    }
  }

}
