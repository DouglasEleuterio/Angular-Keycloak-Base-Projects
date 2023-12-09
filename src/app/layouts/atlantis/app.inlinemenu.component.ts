import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '../../core/auth/auth.service';
import { AuthUser } from '../../core/auth/model/user.model';
import { AuthLogout } from '../../core/auth/model/logout.model';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inlinemenu',
  templateUrl: './app.inlinemenu.component.html',
  animations: [
    trigger('inline', [
      state(
        'hidden',
        style({
          height: '0px',
          overflow: 'hidden'
        })
      ),
      state(
        'visible',
        style({
          height: '*'
        })
      ),
      state(
        'hiddenAnimated',
        style({
          height: '0px',
          overflow: 'hidden'
        })
      ),
      state(
        'visibleAnimated',
        style({
          height: '*'
        })
      ),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppInlineMenuComponent implements OnInit {
  loggedUser: AuthUser;

  constructor(
    public appMain: AppMainComponent,
    private router: Router,
    private authService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loggedUser = this.authService.loggedUser();
  }

  logout(): void {
    this.authService.logout().subscribe((authLogout: AuthLogout) => {
      if (authLogout != null && authLogout.redirect && authLogout.redirectUrl) {
        window.location.href = authLogout.redirectUrl;
      } else {
        this.router.navigate(['account/login']).then();
      }
    });
  }

  emitLogout(event: Event): void {
    event.preventDefault();

    this.confirmationService.confirm({
      message: this.translateService.instant(`login.label.logout`.toUpperCase()),
      header: this.translateService.instant('login.title.logout'.toUpperCase()),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.logout();
      }
    });
  }
}
