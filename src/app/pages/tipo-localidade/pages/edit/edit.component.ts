import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { FormComponent } from '../../components/form/form.component';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-tipo-localidade-edit',
  template: '<app-tipo-localidade-form [isNew]="false" #form></app-tipo-localidade-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuTipoLocalidade;

  private id: number | string;
  private entity: TipoLocalidade;

  constructor(
    private service: TipoLocalidadeService,
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
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuTipoLocalidade,
      { label: 'tipo_localidade.title.new_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: TipoLocalidade) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: TipoLocalidade): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('tipo_localidade.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: TipoLocalidade, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'tipo_localidade.message.updated', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
