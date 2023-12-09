import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { OAuthModule } from '../oauth/oauth.module';
import { AppLoginComponent } from './login/app.login.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from '../../core/ui/ui.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [AppLoginComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    OAuthModule,
    CheckboxModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    UIModule,
    ReactiveFormsModule,
    ToastModule
  ]
})
export class AccountModule {}
