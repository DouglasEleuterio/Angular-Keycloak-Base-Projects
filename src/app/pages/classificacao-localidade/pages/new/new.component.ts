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
import { ClassificacaoLocalidadeService } from 'src/app/domain/classificacao-localidade/classificacao-localidade.service';
import { ClassificacaoLocalidade } from 'src/app/domain/classificacao-localidade/classificacao-localidade.model';

@Component({
  selector: 'app-classificacao-localidade-new',
  template: '<app-classificacao-localidade-form [isNew]="true" #form></app-classificacao-localidade-form>'
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuClassificacaoLocalidade;

  constructor(
    private service: ClassificacaoLocalidadeService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuClassificacaoLocalidade,
      AppMenuModel.itemMenuClassificacaoLocalidade,
      { label: 'classificacao-localidade.title.new_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: ClassificacaoLocalidade, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: ClassificacaoLocalidade, formGroup: FormGroup): void {
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
              this.alertService.defaultSuccess(this.translateService.instant('classificacao_localidade.message.success'.toUpperCase()))
            );
        },
        error: error => {
          this.validationService.handle(formGroup, error);
        }
      });
  }
}
