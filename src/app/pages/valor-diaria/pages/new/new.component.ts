import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ValorDiariaService } from 'src/app/domain/valor-diaria/valor-diaria.service';
import { ValorDiaria } from 'src/app/domain/valor-diaria/valor-diaria.model';

@Component({
  selector: 'app-valor-diaria-new',
  template: '<app-valor-diaria-form [isNew]="true" #form></app-valor-diaria-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuValorDiaria;

  constructor(
    private service: ValorDiariaService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuValorDiaria,
      { label: 'valor_diaria.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: ValorDiaria, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: ValorDiaria, formGroup: FormGroup): void {
    this.form.startSending();

    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'valor_diaria.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
