import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { TrechoViagemService } from 'src/app/domain/trecho-viagem/trecho-viagem.service';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs';
import { TrechoViagem } from 'src/app/domain/trecho-viagem/trecho-viagem.model';
import { FormGroup } from '@angular/forms';
import { FormTrechoViagemComponent } from '../../components/form-trecho-viagem/form-trecho-viagem.component';

@Component({
  template: '<app-form-trecho-viagem [isNew]="false" #form></app-form-trecho-viagem>'
})
export class EditTrechoViagemComponent implements AfterViewInit, OnInit {
  @ViewChild('form') form: FormTrechoViagemComponent;
  private idSolicitacao: number | string = null;
  private idTrecho: number | string = null;
  private entity: TrechoViagem;

  menuBack: string[];

  constructor(
    private service: TrechoViagemService,
    private solicitacaoService: SolicitacaoService,
    private breadcrumbService: AppBreadcrumbService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuSolicitacao, { label: 'solicitacao.title.new_page' }]);
  }

  ngOnInit(): void {
    this.getSolicitacao();
    this.setMenuBack();
    this.getTrechoViagem();
  }

  getSolicitacao(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idSolicitacao = params.get('id');
    });
  }

  setMenuBack(): void {
    this.menuBack = [`${AppMenuModel.itemMenuSolicitacao.routerLink.toString()}/edit/${this.idSolicitacao}`];
  }

  getTrechoViagem(): void {
    this.loadingService.startLoading();

    this.route.params
      .pipe(
        tap((params: Params) => {
          this.idTrecho = params.idTrecho;
        }),
        switchMap((params: Params) =>
          this.service.get(params.idTrecho).pipe(
            finalize(() => {
              this.loadingService.stopLoading();
            })
          )
        )
      )
      .subscribe({
        next: entity => this.onLoad(entity),
        error: error => this.router.navigate(this.menuBack).then(() => this.validationService.handle(null, error))
      });
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: TrechoViagem[], formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack).then();
  }

  onSubmit(entity: TrechoViagem[], formGroup: FormGroup): void {
    this.form.startSending();

    this.service.update(entity[0]).subscribe({
      next: () => {
        this.router
          .navigate(this.menuBack)
          .then(() => this.alertService.defaultSuccess(this.translateService.instant('solicitacao.message.success_trecho'.toUpperCase())));
      },
      error: error => this.validationService.handle(formGroup, error),
      complete: () => this.form.stopSending()
    });
  }

  onLoad(entity: TrechoViagem): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack)
        .then(() => this.alertService.defaultError(this.translateService.instant('solicitacao.message.trecho_not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.form.patchValue(this.entity);
    }
  }
}
