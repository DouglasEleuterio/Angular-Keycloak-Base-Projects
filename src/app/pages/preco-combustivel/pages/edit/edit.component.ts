import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '../../components/form/form.component';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { PrecoCombustivel } from 'src/app/domain/preco-combustivel/preco-combustivel.model';
import { PrecoCombustivelService } from 'src/app/domain/preco-combustivel/preco-combustivel.service';
import { BaseController } from 'src/app/core/domain/base.controller';

@Component({
  selector: 'app-preco-combustivel-edit',
  template: '<app-preco-combustivel-form [isNew]="false" #form></app-preco-combustivel-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuPrecoCombustivel;

  private id: number | string;

  private entity: PrecoCombustivel;

  constructor(
    private service: PrecoCombustivelService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuPrecoCombustivel,
      { label: 'preco_combustivel.title.edit_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: PrecoCombustivel) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: PrecoCombustivel): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('preco_combustivel.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: PrecoCombustivel, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'preco_combustivel.message.updated', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
