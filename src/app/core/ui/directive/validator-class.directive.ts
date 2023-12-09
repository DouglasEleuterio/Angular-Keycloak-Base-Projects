import { Directive, ElementRef } from '@angular/core';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({
  selector: '[appValidatorClass]'
})
export class ValidatorClassDirective {
  el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }
}
