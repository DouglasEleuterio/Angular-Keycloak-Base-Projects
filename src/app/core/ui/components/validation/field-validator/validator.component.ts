import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-field-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss']
})
export class ValidatorComponent implements OnInit {
  @Input() field: string;
  @Input() control: AbstractControl;

  @Input() page: string;
  @Input() invalidClass = 'ng-invalid';
  @Input() errorClass = 'p-error';
  @Input() submitted: boolean;

  constructor(private translate: TranslateService) {}

  get errors(): string[] {
    if (!this.hasError()) {
      return null;
    }
    return Object.keys(this.control?.errors);
  }

  ngOnInit(): void {
    if (!this.invalidClass) {
      this.invalidClass = 'is-invalid';
    }
  }

  hasError(): ValidationErrors {
    return this.control?.errors;
  }

  translateErrorByType(key: string): string {
    if (key === 'validation') {
      return this.control?.errors[key];
    }

    const pageFieldValidation = `${this.page}.validation.${this.field}.${key}`.toUpperCase();
    const defaultFieldValidation = `validation.${key}`.toUpperCase();
    const value = this.translate.instant(pageFieldValidation, this.control?.errors[key]);
    if (!value || value === pageFieldValidation) {
      return this.translate.instant(defaultFieldValidation, this.control?.errors[key]);
    }
    return value;
  }
}
