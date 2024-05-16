import { Component, OnInit } from '@angular/core';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { XmlService } from '../../../../domain/xml/xml.service';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Xml } from '../../../../domain/xml/xml.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  private id: number | string;
  tableData: any[] = [];
  menuBack: AppMenuItem = AppMenuModel.itemMenuXML;
  public entity: Xml;

  constructor(
    private route: ActivatedRoute,
    private service: XmlService,
    private router: Router,
    private validationService: ValidationService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

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
  }

  onLoad(entity: Xml): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('xml.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.tableData.push(this.entity.NFe.infNFe.det.prod);
    }
  }
}
