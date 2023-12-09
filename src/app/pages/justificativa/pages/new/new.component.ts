import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { Justificativa } from 'src/app/domain/justificativa/justificativa.model';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JustificativaService } from 'src/app/domain/justificativa/justificativa.service';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-justificativa-new',
  template: '<app-justificativa-form [isNew]="true" #form></app-justificativa-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuJustificativa;

  constructor(
    private service: JustificativaService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuJustificativa,
      { label: 'justificativa.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: Justificativa, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: Justificativa, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'justificativa.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
