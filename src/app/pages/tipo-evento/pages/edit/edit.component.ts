import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '../../components/form/form.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { TipoEvento } from 'src/app/domain/tipo-evento/tipo-evento.model';
import { TipoEventoService } from 'src/app/domain/tipo-evento/tipo-evento.service';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-tipo-evento-edit',
  template: '<app-tipo-evento-form [isNew]="false" #form></app-tipo-evento-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuTipoEvento;

  private id: number | string;

  private entity: TipoEvento;

  constructor(
    private service: TipoEventoService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuTipoEvento, { label: 'tipo_evento.title.edit_page' }]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: TipoEvento) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: TipoEvento): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('tipo_evento.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: TipoEvento, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'tipo_evento.message.updated', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
