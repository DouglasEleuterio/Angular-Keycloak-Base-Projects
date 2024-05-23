import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { XmlService } from '../../../../domain/xml/xml.service';
import { AppMenuItem, AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Xml } from '../../../../domain/xml/xml.model';
import { Det } from '../../../../domain/xml/det.model';
import { NcmService } from '../../../../domain/ncm/ncm.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  private id: number | string;
  tableData: Det[] = [];
  menuBack: AppMenuItem = AppMenuModel.itemMenuXML;
  public entity: Xml;
  public isExibirMonofasico: boolean;

  constructor(
    private ncmService: NcmService,
    private route: ActivatedRoute,
    private service: XmlService,
    private router: Router,
    private validationService: ValidationService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.isExibirMonofasico = true;
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
  }

  onLoad(entity: Xml): void {
    if (entity == null) {
      this.router
        .navigate(this.menuBack.routerLink)
        .then(() => this.alertService.defaultError(this.translateService.instant('xml.message.not_found'.toUpperCase())));
    } else {
      this.entity = entity;
      this.tableData = this.entity.nfe.inf.det;
    }
  }

  isMonofasico(ncm: string, vCOFINS: number, dataEmissao: Date) {
    if (!this.isExibirMonofasico) {
      return '';
    }
    dataEmissao = new Date(dataEmissao);
    if (vCOFINS < 0.01) {
      return '';
    }

    const ncmList = this.ncmService.getMonoList();
    if (ncmList == null) {
      return '';
    }

    const resultList = ncmList.filter(value => value.codigo === ncm);
    if (resultList.length < 1) {
      return '';
    }

    const result = resultList[0];
    if (dataEmissao.getTime() > result.inicio.getTime() && dataEmissao.getTime() < result.fim.getTime()) {
      return 'background-color: rgb(179, 251, 174)';
    }
    return '';
  }

  cancel(): void {
    this.router.navigate(this.menuBack.routerLink).then();
  }
}
