import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../layouts/atlantis/app.breadcrumb.service';
import { XmlService } from '../../domain/xml/xml.service';
import { LoadingService } from '../../domain/loading/loading.service';
import { FileService } from '../../domain/file/file.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  xmlProcessado: number;
  arquivosEnviados: number;
  arquivosErro: number;

  constructor(
    private loadingService: LoadingService,
    private fileService: FileService,
    private xmlService: XmlService,
    private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([{ label: '' }, { label: '', routerLink: [''] }]);
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.xmlService.getQuantidadeXmlProcessado().subscribe(total => {
      this.xmlProcessado = total;
    });
    this.fileService.getQuantidadeXmlProcessado().subscribe(total => {
      this.arquivosEnviados = total;
    });
    this.fileService.getQuantidadeXmlErro().subscribe(total => {
      this.arquivosErro = total;
    });
  }
}
