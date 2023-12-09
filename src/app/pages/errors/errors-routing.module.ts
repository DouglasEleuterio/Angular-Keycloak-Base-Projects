import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page403Component } from './page403/page403.component';

const routes: Routes = [
  {
    path: '403',
    component: Page403Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule {}
