import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OAuthLoginComponent } from './oauth-login.component';
import { OAuthAuthorizeCallbackComponent } from './callback/oauth-callback.component';

const routes: Routes = [
  {
    path: 'login',
    component: OAuthLoginComponent
  },
  {
    path: 'authorize/callback',
    component: OAuthAuthorizeCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OAuthRoutingModule {}
