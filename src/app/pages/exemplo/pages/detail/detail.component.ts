import { Component, OnInit } from '@angular/core';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { Exemplo } from '../../../../domain/exemplo/exemplo.model';
import { ExemploService } from '../../../../domain/exemplo/exemplo.service';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';

@Component({
  selector: 'app-exemplo-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  menuBack: AppMenuItem = AppMenuModel.itemMenuExemplo;
  private id: number | string;
  public entity: Exemplo;

  constructor(
    private service: ExemploService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService,
    private loadingService: LoadingService
  ) {
    this.breadcrumbService.setItems([AppMenuModel.itemMenuHome, AppMenuModel.itemMenuExemplo, { label: 'exemplo.title.detail' }]);
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

  onLoad(entity: Exemplo): void {
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
