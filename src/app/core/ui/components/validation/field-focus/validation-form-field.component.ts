import { Component, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ValidationFormFieldService } from './validation-form-field.service';

@Component({
  selector: 'app-validation-form-field',
  template: '<span></span>',
  encapsulation: ViewEncapsulation.None
})
export class ValidationFormFieldComponent implements OnDestroy {
  subscription: Subscription;

  constructor(private el: ElementRef, public validationFormFieldService: ValidationFormFieldService) {
    this.subscription = validationFormFieldService.gotoHandler.subscribe(fieldId => {
      if (fieldId == null) {
        this.scrollToFirstInvalidControl();
      } else {
        this.scrollToControlId(fieldId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  scrollToControlId(id: string): void {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.parentNode.querySelector('#' + id);

    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollToFirstInvalidControl(): void {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.parentNode.querySelector('.ng-invalid:not(form)');

    window.focus();

    firstInvalidControl.focus();

    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
  }

  getTopOffset(controlEl: HTMLElement): number {
    if (controlEl != null) {
      const labelOffset = 220;
      const domRect = controlEl.getBoundingClientRect();
      if (domRect) {
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
      }
    }
    return 0;
  }
}
