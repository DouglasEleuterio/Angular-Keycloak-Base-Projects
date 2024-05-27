import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { TabelaAliquotaDiferenciada } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { TabelaAliquotaDiferenciadaService } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { FormComponent } from '../../components/form/form.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemTabelaAliquotaDiferenciada;

  private id: number;

  private entity: TabelaAliquotaDiferenciada;

  constructor(
    private service: TabelaAliquotaDiferenciadaService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemTabelaAliquotaDiferenciada,
      { label: 'tabela_aliquota_diferenciada.title.edit_page' }
    ]);
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.route.params
      .pipe(
        tap((params: Params) => {
          this.id = params.id;
        }),
        switchMap((params: Params) =>
          this.service.get(params.id).pipe(
            finalize(() => {
              this.loadingService.stopLoading();
            })
          )
        )
      )
      .subscribe({
        next: entity => this.onLoad(entity),
        error: error => this.router.navigate(this.menuBack.routerLink).then(() => this.validationService.handle(null, error))
      });
  }

  onLoad(entity: TabelaAliquotaDiferenciada): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() =>
          this.alertService.defaultError(this.translateService.instant('tabela_aliquota_diferenciada.message.not_found'.toUpperCase()))
        );
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: TabelaAliquotaDiferenciada, formGroup: FormGroup): void {
    this.form.startSending();
    this.loadingService.startLoading();
    entity.id = this.id;
    this.service
      .update(entity)
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
              this.alertService.defaultSuccess(this.translateService.instant('tabela_aliquota_diferenciada.message.updated'.toUpperCase()))
            );
        },
        error: error => this.validationService.handle(formGroup, error)
      });
  }
}
