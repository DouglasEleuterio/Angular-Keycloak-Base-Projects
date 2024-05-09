import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppMainComponent } from './app.main.component';
import { AppMenuItem, AppMenuModel } from '../../domain/menu/app-menu.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
  public model: AppMenuItem[] = [];

  constructor(
    public app: AppComponent,
    public appMain: AppMainComponent,
    protected translateService: TranslateService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    AppMenuModel.menu.forEach(menu => {
      if (menu.permissions && this.authenticationService.checkPermission(menu.permissions)) {
        // this.model.push(menu);
        if (menu.items) {
          const itensComPermissao: AppMenuItem[] = [];
          menu.items.forEach(menuInterno => {
            if (menuInterno.permissions && this.authenticationService.checkPermission(menuInterno.permissions)) {
              itensComPermissao.push(menuInterno);
            }
          });

          menu.items = itensComPermissao;
        }
      }
      if (menu.dontNeedPermission || (menu.permissions && this.authenticationService.checkPermission(menu.permissions))) {
        this.model.push(menu);
      }
    });
  }
}
