import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabelaAliquotaDiferenciadaService } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.service';
import { FormGroup, NgForm } from '@angular/forms';
import { TabelaAliquotaDiferenciada } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.model';
import { finalize } from 'rxjs/operators';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'app-new',
  template: '<app-tabela-aliquota-diferenciada-form [isNew]="true" #form></app-tabela-aliquota-diferenciada-form>',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemTabelaAliquotaDiferenciada;

  constructor(
    private loadingService: LoadingService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private validationService: ValidationService,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService,
    private service: TabelaAliquotaDiferenciadaService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemTabelaAliquotaDiferenciada,
      { label: 'page.title.tabela_aliquota_diferenciada' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: TabelaAliquotaDiferenciada, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onSubmit(entity: TabelaAliquotaDiferenciada, formGroup: FormGroup): void {
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
              this.alertService.defaultSuccess(this.translateService.instant('tabela_aliquota_diferenciada.message.success'.toUpperCase()))
            );
        },
        error: error => {
          this.validationService.handle(formGroup, error);
        }
      });
  }
}
