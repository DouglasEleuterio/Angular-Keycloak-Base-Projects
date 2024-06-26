import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { EnvService } from '../../env/env.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  template: `
    <div class="layout-footer">
      <div class="footer-logo-container">
        <img
          id="footer-logo"
          [src]="'assets/layout/images/logo-' + (app.colorScheme === 'light' ? 'dark' : 'light') + '.png'"
          alt="atlantis-layout"
        />
        <span class="app-name">{{ 'name' | appTranslate : 'application' }}</span>
      </div>
      <span class="copyright">&#169; {{ 'organization' | appTranslate : 'application' }} - {{ version }}</span>
    </div>
  `
})
export class AppFooterComponent {
  constructor(public app: AppComponent, public envService: EnvService, protected translateService: TranslateService) {}

  get version(): string {
    return this.translateService.instant('application.version'.toUpperCase(), {
      version: this.envService.environment.version
    });
  }
}
