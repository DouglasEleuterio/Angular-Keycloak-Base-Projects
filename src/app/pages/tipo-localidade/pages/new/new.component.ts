import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-tipo-localidade-new',
  template: '<app-tipo-localidade-form [isNew]="true" #form></app-tipo-localidade-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuTipoLocalidade;

  constructor(
    private service: TipoLocalidadeService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuTipoLocalidade,
      { label: 'tipo_localidade.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: TipoLocalidade, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: TipoLocalidade, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'tipo_localidade.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
