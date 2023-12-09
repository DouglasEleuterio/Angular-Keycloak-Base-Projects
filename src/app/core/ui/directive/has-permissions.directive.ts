import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '../../auth/auth.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private permissions = [];

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticationService
  ) {}

  @Input()
  set appHasPermission(permissions: string[]) {
    this.permissions = permissions;
    this.updateView();
  }

  private updateView(): void {
    if (this.authenticationService.checkPermission(this.permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
