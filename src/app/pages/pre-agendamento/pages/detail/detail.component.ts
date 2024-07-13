import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { PreAgendamento } from '../../../../domain/pre-agendamento/pre-agendamento';
import { PreAgendamentoService } from '../../../../domain/pre-agendamento/pre-agendamento.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public entity: PreAgendamento;
  private id: number;

  menuBack: AppMenuItem = AppMenuModel.itemPreAgendamento;
  dataInicial: Date = new Date('1990-09-24');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private service: PreAgendamentoService
  ) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap((params: Params) => (this.id = params.id)),
        switchMap((params: Params) => this.service.get(params.id))
      )
      .subscribe({
        next: entity => this.onLoad(entity),
        error: error => {
          this.router.navigate(this.menuBack.routerLink).then(() => this.validationService.handle(null, error));
        }
      });

    this.dataInicial = new Date('1990-09-24');
  }

  onLoad(entity: PreAgendamento): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('pre_agendamento.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
    }
  }
}
