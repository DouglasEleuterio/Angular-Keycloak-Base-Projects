import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { FormComponent } from '../../components/form/form.component';
import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { FormGroup } from '@angular/forms';

@Component({
  template: '<app-solicitacao-form [isNew]="false" #form></app-solicitacao-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form') form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuSolicitacao;

  private id: number | string;
  private entity: Solicitacao;

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private router: Router,
    private service: SolicitacaoService,
    private translateService: TranslateService,
    private alertService: AlertService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemMenuSolicitacao,
      { label: 'solicitacao.title.edit_page' }
    ]);
  }

  ngOnInit(): void {
    this.baseController.load(this.route, this.service, this.menuBack, (entity: Solicitacao) => {
      this.id = entity.id;
      this.onLoad(entity);
    });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity, formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  onLoad(entity: Solicitacao): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('solicitacao.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }

  onSubmit(entity: Solicitacao, formGroup: FormGroup): void {
    this.form.startSending();
    entity.id = this.id;
    this.baseController.saveRedirect(formGroup, this.service.update(entity), 'solicitacao.message.updated', this.menuBack, () => {
      this.form.stopSending();
    });
  }
}
