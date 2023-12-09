import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/app/core/log/log.service';
import { BaseFormComponent } from 'src/app/core/ui/components/form/base-form.component';
import { ValidationFormFieldService } from 'src/app/core/ui/components/validation/field-focus/validation-form-field.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { Justificativa } from 'src/app/domain/justificativa/justificativa.model';
import { JustificativaService } from 'src/app/domain/justificativa/justificativa.service';
import { from } from 'src/app/core/api/select/select';
import { HistoricoSituacaoSolicitacaoService } from 'src/app/domain/historico-situacao-solicitacao/historico-situacao-solicitacao.service';
import { HistoricoSituacaoSolicitacao } from 'src/app/domain/historico-situacao-solicitacao/historico-situacao-solicitacao.model';
import { SituacaoSolicitacao } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.model';
import { Solicitacao } from 'src/app/domain/solicitacao/solicitacao.model';
import { BaseController } from 'src/app/core/domain/base.controller';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { AppMenuItem, AppMenuModel } from 'src/app/domain/menu/app-menu.model';
import { SituacaoSolicitacaoService } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.service';
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { SituacaoSolicitacaoEnum } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.enum';
import { SituacaoSolicitacaoFaseEnum } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.enum';

@Component({
  selector: 'app-devolver-solicitacao-form',
  templateUrl: './devolver-solicitacao.component.html',
  styles: [
    `
      .form-buttons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 10px;
      }
    `
  ]
})
export class DevolverSolicitacaoComponent extends BaseFormComponent implements OnInit {
  @Input() isNew: boolean;
  menuBack: AppMenuItem = AppMenuModel.itemMenuSolicitacao;

  formGroup: FormGroup;

  private id: number | string;

  justificativaList = [];

  solicitacao: Solicitacao;
  situacaoSolicitacao: SituacaoSolicitacao;

  onSubmit: (entity: HistoricoSituacaoSolicitacao, formGroup) => void;
  onCancel: () => void;

  constructor(
    protected alertService: AlertService,
    protected logService: LogService,
    private baseController: BaseController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private validationService: ValidationService,
    protected translateService: TranslateService,
    protected validationFormFieldService: ValidationFormFieldService,
    protected serviceJustificativa: JustificativaService,
    protected serviceSituacaoSolicitacao: SituacaoSolicitacaoService,
    protected serviceSolicitacao: SolicitacaoService,
    protected serviceHistoricoSituacaoSolicitacao: HistoricoSituacaoSolicitacaoService,
    private formBuilder: FormBuilder
  ) {
    super(logService, alertService, translateService, validationFormFieldService);
  }

  ngOnInit(): void {
    this.buildFormGroup();
    this.getJustificativasList();
    this.getSolicitacao();
    this.getSituacaoSolicitacao();
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      justificativa: [null, [Validators.required]],
      detalhamentoJustificativa: [null, [Validators.maxLength(4000)]]
    });
  }

  getJustificativasList(): void {
    const query = from<Justificativa>()
      .select((u: Justificativa) => [u.id, u.descricao, u.autorizacao])
      .asc(x => x.descricao)
      .getQuery();

    this.serviceJustificativa
      .fetchSelect<Justificativa[]>(query)
      .pipe(map(data => data.filter(justificativa => justificativa.autorizacao === true)))
      .subscribe(filteredData => (this.justificativaList = filteredData));
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
          if (entity.situacaoSolicitacao.chave !== SituacaoSolicitacaoEnum.ANALISADA) {
            this.router
              .navigate(this.menuBack.routerLink)
              .then(() =>
                this.alertService.error(
                  this.translateService.instant('shared.titles.error'.toUpperCase()),
                  this.translateService.instant('solicitacao.message.devolvida_error'.toUpperCase())
                )
              );
          }

          this.solicitacao = entity;
        },
        error: error => this.router.navigate(this.menuBack.routerLink).then(() => this.validationService.handle(null, error))
      });
  }

  getSituacaoSolicitacao(): void {
    this.serviceSituacaoSolicitacao
      .findSituacaoSolicitacaoByFaseAndSituacaoChave(SituacaoSolicitacaoFaseEnum.SOLICITACAO, SituacaoSolicitacaoEnum.DEVOLVIDA)
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
        this.serviceHistoricoSituacaoSolicitacao.create(entity),
        'devolver_solicitacao.message.success',
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
