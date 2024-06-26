import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { Router } from '@angular/router';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { ProcedimentoService } from '../../../../domain/procedimento/procedimento.service';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Procedimento } from '../../../../domain/procedimento/procedimento-model';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'app-new',
  template: '<app-procedimento-form [isNew]="true" #form></app-procedimento-form>',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuProcedimento;

  constructor(
    private loadingService: LoadingService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private validationService: ValidationService,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService,
    private service: ProcedimentoService
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuProcedimento, { label: 'page.title.procedimento' }]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: Procedimento, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: Procedimento, formGroup: FormGroup): void {
    this.form.startSending();
    this.loadingService.startLoading();
    this.service
      .create(entity)
      .pipe(
        finalize(() => {
          this.form.stopSending();
          this.loadingService.stopLoading();
        })
      )
      .subscribe({
        next: () => {
          this.router
            .navigate(this.menuBack.routerLink)
            .then(() => this.alertService.defaultSuccess(this.translateService.instant('procedimento.message.success'.toUpperCase())));
        },
        error: error => {
          this.validationService.handle(formGroup, error);
        }
      });
  }
}
