import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertService } from '../../../../core/ui/notifications/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../../core/ui/notifications/validation.service';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';
import { BaseController } from 'src/app/core/domain/base.controller';
import { Contato } from 'src/app/domain/companhia-aerea/contato.model';

@Component({
  selector: 'app-contato-list',
  templateUrl: './contato-list.component.html',
  styleUrls: ['./contato-list.component.scss']
})
export class ContatoListComponent {
  @Input()
  listaContato: Contato[];

  @Output()
  onEditar = new EventEmitter<unknown>();

  constructor(
    private alertService: AlertService,
    private baseController: BaseController,
    private translateService: TranslateService,
    private breadcrumbService: AppBreadcrumbService,
    private validationService: ValidationService,
    private loadingService: LoadingService
  ) {
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuClassificacaoLocalidade,
      {
        label: 'contato.title.page'
      }
    ]);
  }

  valueString(str: string): string {
    if (str === null) {
      str = '';
    }

    return str;
  }

  convertNumberToString(number: number): string {
    if (number === null) {
      return '';
    }
    return String(number);
  }

  remove(id: number): void {
    this.loadingService.startLoading();
    const indexContato = this.listaContato.findIndex(x => x.id === id);
    this.listaContato.splice(indexContato, 1);
  }

  edit(entity: Contato, index: number): void {
    this.onEditar.emit([entity, index]);
  }
}
