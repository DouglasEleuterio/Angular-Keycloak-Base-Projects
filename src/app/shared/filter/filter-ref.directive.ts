import { ChangeDetectorRef, Directive, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterStrategy } from '../../core/api/filter/filter.strategy';

@Directive({
  selector: '[appFilterRef]'
})
export class FilterRefDirective {
  formGroup: FormGroup;
  searchStrategy: FilterStrategy;

  constructor(public el: ElementRef, private cd: ChangeDetectorRef) {}

  setFormGroup(formGroup: FormGroup): void {
    this.formGroup = formGroup;
    this.cd.detectChanges();
  }

  resetFormGroup(): void {
    if (this.hasFormGroup()) {
      this.formGroup.reset();
    }
  }

  hasFormGroup(): boolean {
    return this.formGroup != null;
  }
}
