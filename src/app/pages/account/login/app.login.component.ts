import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { EnvService } from '../../../env/env.service';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  styleUrls: ['./app.login.component.scss']
})
export class AppLoginComponent implements OnInit {
  dark: boolean;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    protected translateService: TranslateService,
    public app: AppComponent,
    public envService: EnvService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit(): void {
    this.authenticationService.autorize();
  }

  get version(): string {
    return this.translateService.instant('application.version'.toUpperCase(), {
      version: this.envService.environment.version
    });
  }
}
