import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppMainComponent } from './app.main.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/auth/auth.service';
import { AuthLogout } from '../../core/auth/model/logout.model';

@Component({
  selector: 'app-topbar',
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-left">
        <a
          href="#"
          class="topbar-menu-button"
          (click)="appMain.onMenuButtonClick($event)"
          *ngIf="appMain.isOverlay() || appMain.isMobile()"
        >
          <i class="pi pi-bars"></i>
        </a>

        <a href="#" class="logo">
          <img [src]="'assets/layout/images/logo-' + (app.colorScheme === 'light' ? 'gray' : 'gray') + '.png'" />
        </a>
        <h6 style="alignment-baseline: auto">Clinica</h6>
      </div>

      <app-menu></app-menu>

      <div class="layout-topbar-right">
        <ul class="layout-topbar-right-items">
          <li #profile class="profile-item" [ngClass]="{ 'active-topmenuitem': appMain.activeTopbarItem === profile }">
            <a href="#" (click)="appMain.onTopbarItemClick($event, profile)">
              <img src="assets/layout/images/profile-image.png" />
            </a>

            <ul class="fadeInDown">
              <li role="menuitem">
                <a (click)="logout($event)">
                  <i class="pi pi-fw pi-sign-out"></i>
                  <span>{{ 'action.logout' | appTranslate : 'login' }}</span>
                </a>
              </li>
            </ul>
          </li>
          <!-- Está desativado, caso precise dessas ações, basta descomentar e realizar a implementação -->
          <!--          <li>-->
          <!--            <a href="#">-->
          <!--              <i class="topbar-icon pi pi-fw pi-bell"></i>-->
          <!--              <span class="topbar-badge">2</span>-->
          <!--              <span class="topbar-item-name">Notifications</span>-->
          <!--            </a>-->
          <!--          </li>-->
          <!--          <li>-->
          <!--            <a href="#">-->
          <!--              <i class="topbar-icon pi pi-fw pi-comment"></i>-->
          <!--              <span class="topbar-badge">5</span>-->
          <!--              <span class="topbar-item-name">Messages</span>-->
          <!--            </a>-->
          <!--          </li>-->
        </ul>
      </div>
    </div>
  `
})
export class AppTopbarComponent {
  constructor(
    public app: AppComponent,
    public appMain: AppMainComponent,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  logout(event): void {
    event.preventDefault();
    this.authService.logout().subscribe((authLogout: AuthLogout) => {
      if (authLogout != null && authLogout.redirect && authLogout.redirectUrl) {
        window.location.href = authLogout.redirectUrl;
      } else {
        this.router.navigate(['account/login']).then();
      }
    });
  }
}
