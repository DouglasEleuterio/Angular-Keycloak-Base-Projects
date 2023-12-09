import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';

import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';

import { FormComponent } from '../../components/form/form.component';

@Component({
  template: '<app-solicitacao-form [isNew]="true" #form></app-solicitacao-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuSolicitacao;

  constructor(
    private service: SolicitacaoService,
    private breadcrumbService: AppBreadcrumbService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuSolicitacao, { label: 'solicitacao.title.new_page' }]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: Solicitacao, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: Solicitacao, formGroup: FormGroup): void {
    this.form.startSending();

    this.service.create(entity).subscribe({
      next: entity => {
        this.router
          .navigate([this.menuBack.routerLink.toString() + '/edit/' + entity.id])
          .then(() => this.alertService.defaultSuccess(this.translateService.instant('solicitacao.message.success'.toUpperCase())));
      },
      error: error => this.validationService.handle(formGroup, error),
      complete: () => this.form.stopSending()
    });
  }
}
