import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '../../components/form/form.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { IndenizacaoTransporte } from 'src/app/domain/indenizacao-transporte/indenizacao-transporte.model';
import { IndenizacaoTransporteService } from 'src/app/domain/indenizacao-transporte/indenizacao-transporte.service';

@Component({
  selector: 'app-indenizacao-transporte-edit',
  template: '<app-indenizacao-transporte-form [isNew]="false" #form></app-indenizacao-transporte-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuPoliticaIndenizacaoTransporte;

  private id: number | string;

  private entity: IndenizacaoTransporte;

  constructor(
    private service: IndenizacaoTransporteService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuPoliticaIndenizacaoTransporte,
      { label: 'indenizacao_transporte.title.edit_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: IndenizacaoTransporte) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: IndenizacaoTransporte): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() =>
          this.alertService.defaultError(this.translateService.instant('indenizacao_transporte.message.not_found'.toUpperCase()))
        );
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: IndenizacaoTransporte, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'indenizacao_transporte.message.updated', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
