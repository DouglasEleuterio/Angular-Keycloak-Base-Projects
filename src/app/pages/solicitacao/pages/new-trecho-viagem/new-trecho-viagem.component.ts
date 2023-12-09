import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { TrechoViagem } from 'src/app/domain/trecho-viagem/trecho-viagem.model';
import { AppBreadcrumbService } from 'src/app/layouts/atlantis/app.breadcrumb.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TrechoViagemService } from 'src/app/domain/trecho-viagem/trecho-viagem.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { finalize, switchMap, tap } from 'rxjs';
import { FormTrechoViagemComponent } from '../../components/form-trecho-viagem/form-trecho-viagem.component';

@Component({
  template: '<app-form-trecho-viagem [isNew]="true" #form></app-form-trecho-viagem>'
})
export class NewTrechoViagemComponent implements AfterViewInit, OnInit {
  @ViewChild('form') form: FormTrechoViagemComponent;
  private idSolicitacao: number | string = null;

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
  }

  getSolicitacao(): void {
    this.loadingService.startLoading();
    this.route.params
      .pipe(
        tap((params: Params) => {
          this.idSolicitacao = params.id;
        }),
        switchMap((params: Params) =>
          this.solicitacaoService.get(params.id).pipe(
            finalize(() => {
              this.loadingService.stopLoading();
            })
          )
        )
      )
      .subscribe({
        error: error => this.router.navigate(this.menuBack).then(() => this.validationService.handle(null, error))
      });
  }

  setMenuBack(): void {
    this.menuBack = [`${AppMenuModel.itemMenuSolicitacao.routerLink.toString()}/edit/${this.idSolicitacao}`];
  }

  ngAfterViewInit(): void {
    this.form.onSubmit = (entity: TrechoViagem[], formGroup) => this.onSubmit(entity, formGroup);
    this.form.onCancel = () => this.router.navigate(this.menuBack).then();
  }

  onSubmit(entity: TrechoViagem[], formGroup: FormGroup): void {
    this.form.startSending();

    this.service.createList(entity).subscribe({
      next: () => {
        this.router
          .navigate(this.menuBack)
          .then(() => this.alertService.defaultSuccess(this.translateService.instant('solicitacao.message.success_trecho'.toUpperCase())));
      },
      error: error => this.validationService.handle(formGroup, error),
      complete: () => this.form.stopSending()
    });
  }
}
