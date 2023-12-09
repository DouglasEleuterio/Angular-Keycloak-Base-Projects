import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormControlName, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[appFieldRef]',
  host: {
    '[id]': 'controlName',
    '[class.ng-submitted]': 'hasError'
  }
})
export class FieldRefDirective implements AfterViewInit {
  public submitted = false;
  controlNamePlaceholder: string;

  constructor(
    public el: ElementRef,
    private formControlName: NgControl,
    private cd: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.trimValueAccessor(formControlName.valueAccessor);
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  setFormControlName(formControlName?: FormControlName): void {
    this.formControlName = formControlName;
    this.cd.detectChanges();
  }

  setPlaceholder(value: string): void {
    this.controlNamePlaceholder = this.translate.instant(value.toUpperCase());
  }

  trimValueAccessor(valueAccessor: ControlValueAccessor) {
    const original = valueAccessor.registerOnChange;

    valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
      return original.call(valueAccessor, (value: unknown) => {
        return fn(typeof value === 'string' ? value.trim() : value);
      });
    };
  }

  get controlName(): string {
    return this.formControlName?.name.toString();
  }

  get hasError(): boolean {
    if (this.formControlName == null) {
      return false;
    }
    return this.submitted && this.formControlName.control?.errors != null;
  }
}
