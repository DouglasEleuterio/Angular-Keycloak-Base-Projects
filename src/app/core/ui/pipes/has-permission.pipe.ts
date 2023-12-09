import { Pipe, PipeTransform } from '@angular/core';
import { PermissionEnum } from '../../../domain/permission/permission.enum';
import { AuthenticationService } from '../../auth/auth.service';

@Pipe({ name: 'appHasPermissionPipe' })
export class HasPermissionPipe implements PipeTransform {
  constructor(private authenticationService: AuthenticationService) {}

  transform(value: PermissionEnum[]): boolean {
    if (value == null || value.length === 0) {
      return false;
    }
    return !this.authenticationService.checkPermission(value.map(x => x.toString()));
  }
}
