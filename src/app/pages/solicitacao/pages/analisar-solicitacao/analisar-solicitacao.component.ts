import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { HistoricoSituacaoSolicitacaoService } from 'src/app/domain/historico-situacao-solicitacao/historico-situacao-solicitacao.service';
import { HistoricoSituacaoSolicitacao } from 'src/app/domain/historico-situacao-solicitacao/historico-situacao-solicitacao.model';
import { SituacaoSolicitacao } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.model';
import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { SituacaoSolicitacaoService } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.service';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { SituacaoSolicitacaoEnum } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.enum';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { finalize, switchMap, tap } from 'rxjs';
import { SituacaoSolicitacaoFaseEnum } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.enum';
import { Options } from 'src/app/domain/options/options.interface';

@Component({
  selector: 'app-analisar-solicitacao-form',
  templateUrl: './analisar-solicitacao.component.html',
  styles: [
    `
      .form-buttons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 10px;
      }

      .label {
        margin-bottom: 7px !important;
        width: 100%;
      }
    `
  ]
})
export class AnalisarSolicitacaoComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;
  menuBack: AppMenuItem = AppMenuModel.itemMenuSolicitacao;

  formGroup: FormGroup;

  private id: number | string;

  solicitacao: Solicitacao;
  situacaoSolicitacao: SituacaoSolicitacao;

  recomendacaoList: Options[] = [
    { label: 'Autorizar', value: true },
    { label: 'Não Autorizar', value: false }
  ];

  onSubmit: (entity: HistoricoSituacaoSolicitacao, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private router: Router,
    protected translateService: TranslateService,
    private loadingService: LoadingService,
    private validationService: ValidationService,
    protected validationFormFieldService: ValidationFormFieldService,
    protected serviceSituacaoSolicitacao: SituacaoSolicitacaoService,
    protected serviceSolicitacao: SolicitacaoService,
    protected serviceHistorico: HistoricoSituacaoSolicitacaoService,
    private formBuilder: FormBuilder
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.buildFormGroup();
    this.getSolicitacao();
    this.getSituacaoSolicitacao();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      analise: [null, [Validators.maxLength(4000), Validators.required]],
      statusAnaliseSolicitacao: [null, [Validators.required]]
    });
  }

  getSolicitacao(): void {
    this.loadingService.startLoading();
    this.route.params
      .pipe(
        tap((params: Params) => {
          this.id = params.id;
        }),
        switchMap((params: Params) =>
          this.serviceSolicitacao.get(params.id).pipe(
            finalize(() => {
              this.loadingService.stopLoading();
            })
          )
        )
      )
      .subscribe({
        next: entity => {
          if (
            !(
              entity.situacaoSolicitacao.chave === SituacaoSolicitacaoEnum.APROVADA_PARA_AUTORIZAR ||
              entity.situacaoSolicitacao.chave === SituacaoSolicitacaoEnum.EM_ANALISE
            )
          ) {
            this.router
              .navigate(this.menuBack.routerLink)
              .then(() =>
                this.alertService.error(
                  this.translateService.instant('shared.titles.error'.toUpperCase()),
                  this.translateService.instant('solicitacao.message.analisar_error'.toUpperCase())
                )
              );
          }

          this.solicitacao = entity;
        },
        error: error => this.router.navigate(this.menuBack.routerLink).then(() => this.validationService.handle(null, error))
      });

    this.serviceSolicitacao.get(this.id.toString()).subscribe(solicitacao => {
      this.solicitacao = solicitacao;
    });
  }

  getSituacaoSolicitacao(): void {
    this.serviceSituacaoSolicitacao
      .findSituacaoSolicitacaoByFaseAndSituacaoChave(SituacaoSolicitacaoFaseEnum.AUTORIZACAO, SituacaoSolicitacaoEnum.ANALISADA)
      .subscribe(situacao => (this.situacaoSolicitacao = situacao));
  }

  submit(): void {
    this.submitted = true;

    if (this.formGroup.valid) {
      const entity: HistoricoSituacaoSolicitacao = plainToClass(HistoricoSituacaoSolicitacao, this.formGroup.value);
      entity.solicitacao = this.solicitacao;
      entity.situacaoSolicitacaoNova = this.situacaoSolicitacao;
      this.onSubmit(entity, this.formGroup);
    } else {
      this.validationError();
    }
  }

  ngAfterViewInit(): void {
    this.onSubmit = (entity: HistoricoSituacaoSolicitacao, formGroup) => {
      this.startSending();
      this.baseController.saveRedirect(
        formGroup,
        this.serviceHistorico.create(entity),
        'analisar_solicitacao.message.success',
        this.menuBack,
        () => this.stopSending()
      );
    };

    this.onCancel = () => this.router.navigate(this.menuBack.routerLink).then();
  }

  cancel(): void {
    this.onCancel();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  patchValue(entity: HistoricoSituacaoSolicitacao): void {
    if (entity != null) {
      this.formGroup.patchValue(entity);
    }
  }
}
