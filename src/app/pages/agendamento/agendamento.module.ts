import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendamentoRoutingModule } from './agendamento-routing.module';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { UIModule } from '../../core/ui/ui.module';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CalendarModule } from '../fullcalendar/calendar.module';
import { CalendarModule as CalendarPrime } from 'primeng/calendar';

@NgModule({
  declarations: [ListComponent, DetailComponent],
  exports: [DetailComponent],
  imports: [
    CommonModule,
    AgendamentoRoutingModule,
    CalendarModule,
    ToastModule,
    TableModule,
    UIModule,
    SharedModule,
    TooltipModule,
    DialogModule,
    DropdownModule,
    PaginatorModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    CalendarPrime
  ]
})
export class AgendamentoModule {}
