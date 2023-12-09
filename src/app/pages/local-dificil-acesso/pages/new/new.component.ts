import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseController } from 'src/app/core/domain/base.controller';
import { LocalDificilAcessoService } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.service';
import { LocalDificilAcesso } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.model';

@Component({
  selector: 'app-local-dificil-acesso-new',
  template: '<app-local-dificil-acesso-form [isNew]="true" #form></app-local-dificil-acesso-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuLocalDificilAcesso;

  constructor(
    private service: LocalDificilAcessoService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuLocalDificilAcesso,
      { label: 'local_dificil_acesso.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: LocalDificilAcesso, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: LocalDificilAcesso, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'local_dificil_acesso.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
