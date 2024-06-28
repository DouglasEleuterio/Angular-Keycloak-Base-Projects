import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedimentoRoutingModule } from './procedimento-routing.module';
import { ListComponent } from './pages/list/list.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UIModule } from '../../core/ui/ui.module';
import { RippleModule } from 'primeng/ripple';
import { FormComponent } from './components/form/form.component';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { NewComponent } from './pages/new/new.component';

@NgModule({
  declarations: [ListComponent, FormComponent, NewComponent],
  imports: [
    CommonModule,
    ProcedimentoRoutingModule,
    ButtonModule,
    SharedModule,
    TableModule,
    TooltipModule,
    UIModule,
    RippleModule,
    CalendarModule,
    DividerModule,
    DropdownModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    RxReactiveFormsModule
  ]
})
export class ProcedimentoModule {}
