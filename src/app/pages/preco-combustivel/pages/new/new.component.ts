import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormComponent } from '../../components/form/form.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { PrecoCombustivelService } from 'src/app/domain/preco-combustivel/preco-combustivel.service';
import { PrecoCombustivel } from 'src/app/domain/preco-combustivel/preco-combustivel.model';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-preco-combustivel-new',
  template: '<app-preco-combustivel-form [isNew]="true" #form></app-preco-combustivel-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuPrecoCombustivel;

  constructor(
    private service: PrecoCombustivelService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuPrecoCombustivel,
      { label: 'preco_combustivel.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: PrecoCombustivel, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: PrecoCombustivel, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'preco_combustivel.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
