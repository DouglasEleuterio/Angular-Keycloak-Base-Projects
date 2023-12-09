import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { TableStateClearGuard } from './core/guard/table-state.guard';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'oauth',
    loadChildren: () => import('./pages/oauth/oauth.module').then(m => m.OAuthModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
