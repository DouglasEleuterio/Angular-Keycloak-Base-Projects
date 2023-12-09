import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CalendarModule } from 'primeng/calendar';
import { UIModule } from '../core/ui/ui.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { LoadingComponent } from './loading/loading.component';
import { DropdownModule } from 'primeng/dropdown';
import { NgxLoadingModule } from 'ngx-loading';
import { LoadingService } from '../domain/loading/loading.service';

import { AppConfigComponent } from './atlantis/app.config.component';
import { AppInlineMenuComponent } from './atlantis/app.inlinemenu.component';
import { AppRightMenuComponent } from './atlantis/app.rightmenu.component';
import { AppBreadcrumbComponent } from './atlantis/app.breadcrumb.component';
import { AppMenuitemComponent } from './atlantis/app.menuitem.component';
import { AppFooterComponent } from './atlantis/app.footer.component';
import { AppMainComponent } from './atlantis/app.main.component';
import { MenuService } from './atlantis/app.menu.service';
import { AppMenuComponent } from './atlantis/app.menu.component';
import { AppTopbarComponent } from './atlantis/app.topbar.component';
import { AppBreadcrumbService } from './atlantis/app.breadcrumb.service';
import { ConfigService } from './atlantis/config/app.config.service';

@NgModule({
  declarations: [
    AppMainComponent,
    AppBreadcrumbComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopbarComponent,
    AppRightMenuComponent,
    AppInlineMenuComponent,
    AppConfigComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UIModule,
    TranslateModule,
    AvatarModule,
    TooltipModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    RadioButtonModule,
    BreadcrumbModule,
    ButtonModule,
    RippleModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    TabViewModule,
    InputSwitchModule,
    DropdownModule,
    NgxLoadingModule.forRoot({
      fullScreenBackdrop: true
    })
  ],
  exports: [AppMainComponent],
  providers: [MessageService, MenuService, AppBreadcrumbService, LoadingService, ConfigService]
})
export class LayoutsModule {}
