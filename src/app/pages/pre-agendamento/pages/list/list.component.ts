import { Component } from '@angular/core';
import { PreAgendamento } from '../../../../domain/pre-agendamento/pre-agendamento';
import { PaginatorComponent } from '../../../../core/ui/components/pagination/paginator.component';
import { ListDatas } from './list-datas';
import { AppMenuModel } from '../../../../domain/menu/app-menu.model';
import { AppBreadcrumbService } from '../../../../layouts/atlantis/app.breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends PaginatorComponent {
  tableData: PreAgendamento[] = [];

  constructor(private breadcrumbService: AppBreadcrumbService) {
    super('PaginationPreAgendamento');
    this.breadcrumbService.setItems([
      AppMenuModel.itemMenuHome,
      {
        label: 'procedimento.title.page'
      }
    ]);
  }

  fetch(): void {
    ListDatas.getAgendamentos()
      .pipe()
      .subscribe(value => {
        this.tableData = value;
      });
  }
}
