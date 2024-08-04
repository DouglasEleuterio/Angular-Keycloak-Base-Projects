import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from '../pre-agendamento/pages/list/list.component';
import { DetailComponent } from '../pre-agendamento/pages/detail/detail.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'detail/:id',
    component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendamentoRoutingModule {}