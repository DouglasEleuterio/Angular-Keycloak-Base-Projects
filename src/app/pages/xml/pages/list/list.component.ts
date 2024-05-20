import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { XmlService } from '../../../../domain/xml/xml.service';
import { Xml } from '../../../../domain/xml/xml.model';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { Filter } from '../../../../core/api/filter/filter.model';
import { BaseController } from '../../../../core/domain/base.controller';

@Component({
  selector: 'app-xml-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: Xml[] = [];

  listSelect = (u: Xml) => [
    u.id,
    u.NFe.id,
    u.NFe.infNFe.idB,
    u.NFe.infNFe.ide.id,
    u.NFe.infNFe.ide.nNF,
    u.NFe.infNFe.ide.dhEmi,
    u.NFe.infNFe.ide.natOp,
    u.NFe.infNFe.dest.id,
    u.NFe.infNFe.dest.CNPJ,
    u.NFe.infNFe.dest.xNome,
    u.NFe.infNFe.emit.id,
    u.NFe.infNFe.emit.xNome,
    u.NFe.infNFe.total.id,
    u.NFe.infNFe.total.ICMSTot.id,
    u.NFe.infNFe.total.ICMSTot.vNF
  ];

  constructor(
    private loadingService: LoadingService,
    public service: XmlService,
    private baseController: BaseController,
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
          this.alertService.defaultSuccess(this.translateService.instant('xml.message.deleted_success'.toUpperCase()));
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

  fetch(): void {
    // Caso não possua filtro, aplicar filtro padrão
    if (this.pagination.filter == null) {
      this.pagination.filter = new Filter({ search: `id!=0` }, null);
    } else {
      // Caso filtro definido, validar filtro.
      this.isValidate();
    }

    this.baseController.fetchSelect(this.listSelect, this.pagination, this.service, result => {
      console.log(result.content);
      this.tableData = result.content;
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

  private isValidate(): void {
    const filters = this.pagination.filter.filters;
    if (filters.dataEmissaoInicio != null && filters.dataEmissaoFim != null) {
      const isInvalidDatasInicio = filters.dataEmissaoInicio > filters.dataEmissaoFim;
      if (isInvalidDatasInicio) {
        this.alertService.defaultError(this.translateService.instant('xml.message.error_dates_inicio'.toUpperCase()));
      }
    }
  }
}
