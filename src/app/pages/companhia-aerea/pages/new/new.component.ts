import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseController } from 'src/app/core/domain/base.controller';
import { CompanhiaAerea } from 'src/app/domain/companhia-aerea/companhia-aerea.model';
import { CompanhiaAereaService } from 'src/app/domain/companhia-aerea/companhia-aerea.service';

@Component({
  selector: 'app-companhia-aerea-new',
  template: '<app-companhia-aerea-form [isNew]="true" #form></app-companhia-aerea-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuCompanhiaAerea;

  constructor(
    private service: CompanhiaAereaService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuCompanhiaAerea,
      { label: 'companhia-aerea.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: CompanhiaAerea, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: CompanhiaAerea, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'companhia-aerea.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
