import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { AquisicaoService } from '../../../../domain/aquisicao/aquisicao.service';
import { FormGroup } from '@angular/forms';
import { FormComponent } from '../../components/form/form.component';
import { Aquisicao } from '../../../../domain/aquisicao/aquisicao-model';
import { Regiao } from '../../../../domain/procedimento/regiao.model';
import { Pagamento } from '../../../../domain/pagamento/pagamento.model';

@Component({
  selector: 'app-procedimento-edit',
  template: '<app-aquisicao-form [isNew]="false" #form></app-aquisicao-form>'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('form')
  form: FormComponent;

  menuBack: AppMenuItem = AppMenuModel.itemMenuAquisicao;

  private id: number;
  private entity: Aquisicao;

  constructor(
    private service: AquisicaoService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuAquisicao, { label: 'aquisicao.title.edit_page' }]);
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

  onLoad(entity: Aquisicao): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('aquisicao.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
      this.carregarFormulario(this.form);
    }
  }

  onSubmit(entity: Aquisicao, formGroup: FormGroup): void {
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
            .then(() => this.alertService.defaultSuccess(this.translateService.instant('aquisicao.message.updated'.toUpperCase())));
        },
        error: error => this.validationService.handle(formGroup, error)
      });
  }

  private carregarFormulario(form: FormComponent) {
    form.formGroup.controls['cliente'].setValue(this.entity.cliente.id);
    form.formGroup.controls['dataAquisicao'].setValue(this.entity.dataAquisicao);
    const regioes: Regiao[] = [];
    this.entity.procedimentos.forEach(proc => {
      proc.regioes.forEach(reg => regioes.push(reg));
    });
    form.formGroup.controls['regioes'].setValue(regioes);

    const pagamentos: Pagamento[] = [];
    this.entity.pagamentos.forEach(pagamento => {
      pagamentos.push(pagamento);
    });
  }
}
