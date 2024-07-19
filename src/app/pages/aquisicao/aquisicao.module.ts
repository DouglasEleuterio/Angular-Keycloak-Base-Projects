import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UIModule } from '../../core/ui/ui.module';
import { RippleModule } from 'primeng/ripple';
import { AquisicaoRoutingModule } from './aquisicao-routing.module';
import { FormComponent } from './components/form/form.component';
import { NewComponent } from './pages/new/new.component';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TreeTableModule } from 'primeng/treetable';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { SharedModule } from '../../shared/shared.module';
import { EditComponent } from './pages/edit/edit.component';

@NgModule({
  declarations: [ListComponent, FormComponent, NewComponent, EditComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
    TableModule,
    TooltipModule,
    UIModule,
    RippleModule,
    AquisicaoRoutingModule,
    PaginatorModule,
    ReactiveFormsModule,
    CalendarModule,
    ChipsModule,
    DividerModule,
    RxReactiveFormsModule,
    TreeTableModule,
    NgxJsonViewerModule,
    SplitterModule,
    AccordionModule,
    SharedModule
  ]
})
export class AquisicaoModule {}
