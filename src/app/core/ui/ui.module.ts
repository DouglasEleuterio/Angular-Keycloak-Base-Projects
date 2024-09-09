import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DebounceClickDirective } from './directive/debounce.directive';
import { AppTranslatePipe } from './pipes/app-translate.pipe';
import { CnpjCpfPipe } from './pipes/cnpj.pipe';
import { EmptyDataPipe } from './pipes/empty-data.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { ThousandFormatPipe } from './pipes/thousand-format.pipe';
import { ValidatorComponent } from './components/validation/field-validator/validator.component';
import { ValidatorClassDirective } from './directive/validator-class.directive';
import { HasPermissionDirective } from './directive/has-permissions.directive';
import { ValidationFormFieldComponent } from './components/validation/field-focus/validation-form-field.component';
import { PhoneFormatPipe } from './pipes/phone.pipe';
import { HasPermissionPipe } from './pipes/has-permission.pipe';
import { ActiveLabelPipe } from './pipes/active-label.pipe';
import { EllipsesPipe } from './pipes/app-ellipse.pipe';
import { SimNaoPipe } from './pipes/sim-nao.pipe';
import { PercentualFormatPipe } from './pipes/percentual-format.pipe';
import { VersaoPipe } from './pipes/versao.pipe';

@NgModule({
  declarations: [
    ValidatorComponent,
    ValidationFormFieldComponent,
    DebounceClickDirective,
    ValidatorClassDirective,
    HasPermissionDirective,
    AppTranslatePipe,
    CnpjCpfPipe,
    VersaoPipe,
    PhoneFormatPipe,
    EmptyDataPipe,
    RelativeTimePipe,
    ThousandFormatPipe,
    PercentualFormatPipe,
    HasPermissionPipe,
    ActiveLabelPipe,
    EllipsesPipe,
    SimNaoPipe
  ],
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule, InputTextModule, TooltipModule, ButtonModule],
  exports: [
    ValidatorComponent,
    ValidationFormFieldComponent,
    DebounceClickDirective,
    ValidatorClassDirective,
    HasPermissionDirective,
    AppTranslatePipe,
    CnpjCpfPipe,
    VersaoPipe,
    PhoneFormatPipe,
    EmptyDataPipe,
    RelativeTimePipe,
    ThousandFormatPipe,
    PercentualFormatPipe,
    HasPermissionPipe,
    ActiveLabelPipe,
    EllipsesPipe,
    SimNaoPipe
  ]
})
export class UIModule {}
