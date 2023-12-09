import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormComponent } from '../../components/form/form.component';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { Evento } from 'src/app/domain/evento/evento.model';
import { EventoService } from 'src/app/domain/evento/evento.service';

@Component({
  selector: 'app-evento-new',
  template: '<app-evento-form [isNew]="true" #form></app-evento-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuEvento;

  constructor(
    private service: EventoService,
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private router: Router
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuEvento, { label: 'evento.title.new_page' }]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: Evento, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: Evento, formGroup: FormGroup): void {
    this.form.startSending();
    this.baseController.saveRedirect(formGroup, this.service.create(entity), 'evento.message.success', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
