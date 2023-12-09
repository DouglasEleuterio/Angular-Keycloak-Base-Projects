import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { FormComponent } from '../../components/form/form.component';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ValorDiaria } from 'src/app/domain/valor-diaria/valor-diaria.model';
import { ValorDiariaService } from 'src/app/domain/valor-diaria/valor-diaria.service';

@Component({
  selector: 'app-valor-diaria-edit',
  template: '<app-valor-diaria-form [isNew]="false" #form></app-valor-diaria-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuValorDiaria;

  private id: number | string;
  private entity: ValorDiaria;

  constructor(
    private service: ValorDiariaService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuValorDiaria,
      { label: 'valor_diaria.title.new_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: ValorDiaria) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: ValorDiaria): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('valor_diaria.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: ValorDiaria, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'valor_diaria.message.updated', this.menuBack, () =>
      this.form.stopSending()
    );
  }
}
