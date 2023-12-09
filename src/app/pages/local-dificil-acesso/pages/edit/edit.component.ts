import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { FormComponent } from '../../components/form/form.component';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { LocalDificilAcesso } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.model';
import { LocalDificilAcessoService } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.service';

@Component({
  selector: 'app-local-dificil-acesso-edit',
  template: '<app-local-dificil-acesso-form [isNew]="false" #form></app-local-dificil-acesso-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuLocalDificilAcesso;

  private id: number | string;
  private entity: LocalDificilAcesso;

  constructor(
    private service: LocalDificilAcessoService,
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
      AppMenuModel.itemMenuLocalDificilAcesso,
      { label: 'local_dificil_acesso.title.new_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: LocalDificilAcesso) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: LocalDificilAcesso): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('local_dificil_acesso.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: LocalDificilAcesso, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'local_dificil_acesso.message.updated', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
