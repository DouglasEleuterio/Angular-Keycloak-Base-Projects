import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { FormComponent } from '../../components/form/form.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { Exemplo } from '../../../../domain/exemplo/exemplo.model';
import { ExemploService } from '../../../../domain/exemplo/exemplo.service';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';

@Component({
  selector: 'app-exemplo-edit',
  template: '<app-exemplo-form [isNew]="false" #form></app-exemplo-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuExemplo;

  private id: number | string;

  private entity: Exemplo;

  constructor(
    private service: ExemploService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuExemplo, { label: 'exemplo.title.edit_page' }]);
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

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: Exemplo): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('exemplo.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: Exemplo, formGroup: FormGroup): void {
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
            .then(() => this.alertService.defaultSuccess(this.translateService.instant('exemplo.message.updated'.toUpperCase())));
        },
        error: error => this.validationService.handle(formGroup, error)
      });
  }
}
