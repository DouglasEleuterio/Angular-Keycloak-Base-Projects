import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormComponent } from '../../components/form/form.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { IndenizacaoTransporteService } from 'src/app/domain/indenizacao-transporte/indenizacao-transporte.service';
import { IndenizacaoTransporte } from 'src/app/domain/indenizacao-transporte/indenizacao-transporte.model';

@Component({
  selector: 'app-indenizacao-transporte-new',
  template: '<app-indenizacao-transporte-form [isNew]="true" #form></app-indenizacao-transporte-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuPoliticaIndenizacaoTransporte;

  constructor(
    private service: IndenizacaoTransporteService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuPoliticaIndenizacaoTransporte,
      { label: 'indenizacao_transporte.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: IndenizacaoTransporte, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: IndenizacaoTransporte, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'indenizacao_transporte.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
