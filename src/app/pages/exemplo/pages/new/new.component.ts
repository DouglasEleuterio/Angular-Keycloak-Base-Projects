import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { FormComponent } from '../../components/form/form.component';
import { finalize } from 'rxjs/operators';
import { ExemploService } from '../../../../domain/exemplo/exemplo.service';
import { Exemplo } from '../../../../domain/exemplo/exemplo.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';

@Component({
  selector: 'app-exemplo-new',
  template: '<app-exemplo-form [isNew]="true" #form></app-exemplo-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuExemplo;

  constructor(
    private service: ExemploService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuExemplo, { label: 'exemplo.title.new_page' }]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: Exemplo, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: Exemplo, formGroup: FormGroup): void {
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
            .then(() => this.alertService.defaultSuccess(this.translateService.instant('exemplo.message.success'.toUpperCase())));
        },
        error: error => {
          this.validationService.handle(formGroup, error);
        }
      });
  }
}
