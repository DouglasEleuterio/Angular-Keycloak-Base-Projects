import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../layouts/atlantis/app.breadcrumb.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
  xmlProcessado: number;
  arquivosEnviados: number;
  arquivosErro: number;

  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([{ label: '' }, { label: '', routerLink: [''] }]);
  }
}
