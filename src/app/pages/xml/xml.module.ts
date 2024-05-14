import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmlRountingModule } from './xml-rounting.module';
import { ListComponent } from './pages/list/list.component';
import { UIModule } from '../../core/ui/ui.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from '../../shared/shared.module';
import { FiltersComponent } from './components/filters/filters.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [ListComponent, FormComponent, FiltersComponent],
  imports: [
    CommonModule,
    XmlRountingModule,
    UIModule,
    ButtonModule,
    RippleModule,
    RouterLink,
    ToastModule,
    FileUploadModule,
    SharedModule,
    TableModule,
    TooltipModule,
    ProgressSpinnerModule,
    LayoutsModule
  ]
})
export class XmlModule {}
