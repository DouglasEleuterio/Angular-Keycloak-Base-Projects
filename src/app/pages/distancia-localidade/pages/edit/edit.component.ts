import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormComponent } from '../../components/form/form.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { DistanciaLocalidade } from 'src/app/domain/distancia-localidade/distancia-localidades.model';
import { DistanciaLocalidadeService } from 'src/app/domain/distancia-localidade/distancia-localidade.service';

@Component({
  selector: 'app-distancia-localidade-edit',
  template: '<app-distancia-localidade-form [isNew]="false" #form></app-distancia-localidade-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuDistanciaLocalidade;

  private id: number | string;

  private entity: DistanciaLocalidade;

  constructor(
    private service: DistanciaLocalidadeService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuDistanciaLocalidade,
      AppMenuModel.itemMenuDistanciaLocalidade,
      { label: 'distancia-localidade.title.edit_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: DistanciaLocalidade) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: DistanciaLocalidade): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('distancia-localidade.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  /*
  onSubmit(entity: DistanciaLocalidade, formGroup: FormGroup): void {
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
              this.alertService.defaultSuccess(this.translateService.instant('distancia-localidade.message.updated'.toUpperCase()))
            );
        },
        error: error => this.validationService.handle(formGroup, error)
      });
  }
  */
  onSubmit(entity: DistanciaLocalidade, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'distancia-localidade.message.updated', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
