import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TableStateClearGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    Object.entries(localStorage)
      .map(x => x[0])
      .filter(x => x.startsWith('table_'))
      .map(x => localStorage.removeItem(x));
    return true;
  }
}
