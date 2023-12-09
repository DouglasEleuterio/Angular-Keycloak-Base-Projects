import { Component, ContentChild, DoCheck, Input } from '@angular/core';
import { AbstractControl, FormControl, FormControlName } from '@angular/forms';
import { FieldRefDirective } from './field-ref.directive';

@Component({
  selector: 'app-field',
  template: `
    <label class="label" [for]="controlName" *ngIf="hideLabel == null || !hideLabel">
      {{ translateFieldName | appTranslate : page }} <span *ngIf="isRequiredControl()">*</span>
    </label>
    <ng-content></ng-content>
    <app-field-validator
      *ngIf="noValidation == null"
      [control]="control"
      [submitted]="submitted"
      [field]="controlName"
      [page]="page"
    ></app-field-validator>
  `
})
export class FieldComponent implements DoCheck {
  @Input()
  submitted: boolean;

  @Input()
  page: string;

  @Input()
  hideLabel?: boolean;

  @Input()
  noValidation?: boolean;

  @ContentChild(FieldRefDirective)
  fieldRef: FieldRefDirective;

  @ContentChild(FormControlName)
  formControlName: FormControlName;

  ngDoCheck(): void {
    if (this.fieldRef != null) {
      this.fieldRef.submitted = this.submitted;
    }
  }

  get translateFieldName(): string {
    return `field.${this.controlName}`;
  }

  isRequiredControl(): boolean {
    if (this.control) {
      const { validator } = this.control;
      if (validator) {
        const validation = validator(new FormControl());
        return validation !== null && validation.required === true;
      }
    }
    return false;
  }

  get controlName(): string {
    if (this.formControlName == null) {
      return '';
    }
    return this.formControlName?.name.toString();
  }

  get control(): AbstractControl {
    if (this.formControlName == null) {
      return null;
    }
    return this.formControlName.control;
  }
}
