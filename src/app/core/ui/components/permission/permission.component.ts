import { PermissionEnum } from '../../../../domain/permission/permission.enum';

export abstract class PermissionComponent {
  get p(): typeof PermissionEnum {
    return PermissionEnum;
  }
}
