import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLabelComponent } from './data-label/data-label.component';
import { UIModule } from '../core/ui/ui.module';
import { ButtonModule } from 'primeng/button';
import { FormButtonsComponent } from './form-buttons/form-buttons.component';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FieldComponent } from './field/field.component';
import { FieldRefDirective } from './field/field-ref.directive';
import { PanelModule } from 'primeng/panel';
import { FilterPanelComponent } from './filter/filter-panel.component';
import { FilterRefDirective } from './filter/filter-ref.directive';
import { FilterComponent } from './filter/filter.component';
import { TableButtonsComponent } from './table-buttons/table-buttons.component';
import { DateMaskDirective } from './masks/date-mask.directive';
import { TableExporterComponent } from './table-exporter/table-exporter.component';
import { SituacaoButtonComponent } from './situacao-button/situacao-button.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SituacaoButtonPrecoCombustivelComponent } from './situacao-button-preco-combustivel/situacao-button-preco-combustivel.component';
import { FileUploadButtonComponent } from './file-upload-button/file-upload-button.component';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [
    TableButtonsComponent,
    FieldRefDirective,
    FieldComponent,
    DataLabelComponent,
    FormButtonsComponent,
    SituacaoButtonComponent,
    FileUploadButtonComponent,
    SituacaoButtonPrecoCombustivelComponent,
    FilterPanelComponent,
    FilterRefDirective,
    FilterComponent,
    DateMaskDirective,
    TableExporterComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    TooltipModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    CheckboxModule,
    InputTextareaModule,
    FormsModule,
    SplitButtonModule,
    PanelModule,
    FileUploadModule
  ],
  exports: [
    TableButtonsComponent,
    DataLabelComponent,
    FormButtonsComponent,
    SituacaoButtonComponent,
    FileUploadButtonComponent,
    SituacaoButtonPrecoCombustivelComponent,
    FilterPanelComponent,
    FieldComponent,
    FieldRefDirective,
    FilterComponent,
    FilterRefDirective,
    DateMaskDirective,
    TableExporterComponent
  ],
  providers: []
})
export class SharedModule {}
