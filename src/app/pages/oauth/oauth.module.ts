import { NgModule } from '@angular/core';
import { OAuthLoginComponent } from './oauth-login.component';
import { OAuthRoutingModule } from './oauth-routing.module';
import { OAuthAuthorizeCallbackComponent } from './callback/oauth-callback.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UIModule } from '../../core/ui/ui.module';

@NgModule({
  declarations: [OAuthLoginComponent, OAuthAuthorizeCallbackComponent],
  imports: [OAuthRoutingModule, ProgressSpinnerModule, MessageModule, NgIf, ButtonModule, UIModule]
})
export class OAuthModule {}
