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
import { ClassificacaoLocalidade } from 'src/app/domain/classificacao-localidade/classificacao-localidade.model';
import { ClassificacaoLocalidadeService } from 'src/app/domain/classificacao-localidade/classificacao-localidade.service';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-classificacao-localidade-edit',
  template: '<app-classificacao-localidade-form [isNew]="false" #form></app-classificacao-localidade-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuClassificacaoLocalidade;

  private id: number | string;

  private entity: ClassificacaoLocalidade;

  constructor(
    private service: ClassificacaoLocalidadeService,
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
      AppMenuModel.itemMenuClassificacaoLocalidade,
      AppMenuModel.itemMenuClassificacaoLocalidade,
      { label: 'classificacao-localidade.title.edit_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: ClassificacaoLocalidade) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: ClassificacaoLocalidade): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() =>
          this.alertService.defaultError(this.translateService.instant('classificacao_localidade.message.not_found'.toUpperCase()))
        );
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: ClassificacaoLocalidade, formGroup: FormGroup): void {
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
              this.alertService.defaultSuccess(this.translateService.instant('classificacao_localidade.message.updated'.toUpperCase()))
            );
        },
        error: error => this.validationService.handle(formGroup, error)
      });
  }
}
