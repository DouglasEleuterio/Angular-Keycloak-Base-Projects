import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ListComponent
  }
  /*
  ,
 {
   path: 'new',
   component: NewComponent
 },
 {
   path: 'edit/:id',
   component: EditComponent
 },
 {
   path: 'detail/:id',
   component: DetailComponent
 }*/
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)]
})
export class TabelaAliquotaDiferenciadaRountingModule {}
