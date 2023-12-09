import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseController } from 'src/app/core/domain/base.controller';
import { AuxilioAlimentacaoService } from 'src/app/domain/auxilio-alimentacao/auxilio-alimentacao.service';
import { AuxilioAlimentacao } from 'src/app/domain/auxilio-alimentacao/auxilio-alimentacao.model';

@Component({
  selector: 'app-auxilio-alimentacao-new',
  template: '<app-auxilio-alimentacao-form [isNew]="true" #form></app-auxilio-alimentacao-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuAuxilioAlimentacao;

  constructor(
    private service: AuxilioAlimentacaoService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuAuxilioAlimentacao,
      { label: 'auxilio_alimentacao.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: AuxilioAlimentacao, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: AuxilioAlimentacao, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'auxilio_alimentacao.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
