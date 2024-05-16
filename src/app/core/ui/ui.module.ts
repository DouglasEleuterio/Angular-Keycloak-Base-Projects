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
import { CargoPipe } from './pipes/cargo.pipe';
import { SituacaoCondicaoPipe } from './pipes/situacao-condicao.pipe';
import { EllipsesPipe } from './pipes/app-ellipse.pipe';
import { SituacaoSolicitacaoPipe } from './pipes/situacao-solicitacao.pipe';
import { SituacaoSolicitacaoFasePipe } from './pipes/situacao-solicitacao-fase.pipe';
import { MeioTransportePipe } from './pipes/meio-transporte.pipe';
import { SimNaoPipe } from './pipes/sim-nao.pipe';
import { PercentualFormatPipe } from './pipes/percentual-format.pipe';

@NgModule({
  declarations: [
    ValidatorComponent,
    ValidationFormFieldComponent,
    DebounceClickDirective,
    ValidatorClassDirective,
    HasPermissionDirective,
    AppTranslatePipe,
    CnpjCpfPipe,
    PhoneFormatPipe,
    EmptyDataPipe,
    RelativeTimePipe,
    ThousandFormatPipe,
    PercentualFormatPipe,
    HasPermissionPipe,
    ActiveLabelPipe,
    CargoPipe,
    EllipsesPipe,
    SituacaoCondicaoPipe,
    SituacaoSolicitacaoPipe,
    SituacaoSolicitacaoFasePipe,
    MeioTransportePipe,
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
    PhoneFormatPipe,
    EmptyDataPipe,
    RelativeTimePipe,
    ThousandFormatPipe,
    PercentualFormatPipe,
    HasPermissionPipe,
    ActiveLabelPipe,
    CargoPipe,
    EllipsesPipe,
    SituacaoCondicaoPipe,
    SituacaoSolicitacaoPipe,
    SituacaoSolicitacaoFasePipe,
    MeioTransportePipe,
    SimNaoPipe
  ]
})
export class UIModule {}
