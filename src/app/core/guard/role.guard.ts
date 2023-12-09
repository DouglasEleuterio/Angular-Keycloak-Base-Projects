import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const loggedUser = this.authenticationService.loggedUser();
    if (!loggedUser) {
      return this.authenticationService.logoutRedirect(state.url, this.router);
    }

    const isTokenExpired = await this.authenticationService.isAuthenticatedRefresh();
    if (isTokenExpired) {
      return this.authenticationService.logoutRedirect(state.url, this.router);
    }

    if (!route.data.roles || loggedUser.roles.some(x => route.data.roles.includes(x))) {
      return true;
    }
    this.router.navigate(['/errors/403']).then();
    return false;
  }
}
