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
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { DistanciaLocalidadeService } from 'src/app/domain/distancia-localidade/distancia-localidade.service';
import { DistanciaLocalidade } from 'src/app/domain/distancia-localidade/distancia-localidades.model';

@Component({
  selector: 'app-distancia-localidade-new',
  template: '<app-distancia-localidade-form [isNew]="true" #form></app-distancia-localidade-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuDistanciaLocalidade;

  constructor(
    private service: DistanciaLocalidadeService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuDistanciaLocalidade,
      AppMenuModel.itemMenuDistanciaLocalidade,
      { label: 'distancia-localidade.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: DistanciaLocalidade, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: DistanciaLocalidade, formGroup: FormGroup): void {
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
            .then(() =>
              this.alertService.defaultSuccess(this.translateService.instant('distancia-localidade.message.success'.toUpperCase()))
            );
        },
        error: error => {
          this.validationService.handle(formGroup, error);
        }
      });
  }
}
