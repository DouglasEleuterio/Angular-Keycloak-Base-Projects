import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { LogService } from './core/log/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends LogService implements OnInit {
  horizontalMenu: boolean;
  darkMode = false;
  menuColorMode = 'light';
  menuColor = 'layout-menu-light';
  themeColor = 'blue';
  layoutColor = 'blue';
  ripple = true;
  inputStyle = 'outlined';

  menuMode = 'sidebar';
  layout = 'blue';
  theme = 'blue';
  colorScheme = 'light';

  constructor(public translate: TranslateService, private primengConfig: PrimeNGConfig) {
    super();
    translate.addLangs(['en', 'fr', 'pt']);
    translate.setDefaultLang('pt');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|pt/) ? browserLang : 'pt');
    translate.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.ripple = true;
  }
}
