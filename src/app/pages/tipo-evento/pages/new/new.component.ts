import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormComponent } from '../../components/form/form.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { TipoEventoService } from 'src/app/domain/tipo-evento/tipo-evento.service';
import { TipoEvento } from 'src/app/domain/tipo-evento/tipo-evento.model';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-tipo-evento-new',
  template: '<app-tipo-evento-form [isNew]="true" #form></app-tipo-evento-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuTipoEvento;

  constructor(
    private service: TipoEventoService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuTipoEvento, { label: 'tipo_evento.title.new_page' }]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: TipoEvento, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: TipoEvento, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'tipo_evento.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
