import { Component, OnInit } from '@angular/core';
import { TabelaAliquotaDiferenciada } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.model';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoadingService } from '../../../../domain/loading/loading.service';
import { TabelaAliquotaDiferenciadaService } from '../../../../domain/tabela-incidencia/tabela-aliquota-diferenciada.service';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  menuBack: AppMenuItem = AppMenuModel.itemTabelaAliquotaDiferenciada;
  public entity: TabelaAliquotaDiferenciada;
  private id: number | string;

  constructor(
    private service: TabelaAliquotaDiferenciadaService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private validationService: ValidationService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService,
    private loadingService: LoadingService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      AppMenuModel.itemTabelaAliquotaDiferenciada,
      { label: 'page.title.tabela_aliquota_diferenciada' }
    ]);
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.route.params
      .pipe(
        tap((params: Params) => (this.id = params.id)),
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
        error: error => {
          this.router.navigate(this.menuBack.routerLink).then(() => this.validationService.handle(null, error));
        }
      });
  }

  onLoad(entity: TabelaAliquotaDiferenciada): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('exemplo.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
    }
  }

  cancel(): void {
    this.router.navigate(this.menuBack.routerLink).then();
  }
}
