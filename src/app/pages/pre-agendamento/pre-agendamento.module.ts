import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { PreAgendamentoRoutingModule } from './pre-agendamento-routing.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UIModule } from '../../core/ui/ui.module';
import { RippleModule } from 'primeng/ripple';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { DetailComponent } from './pages/detail/detail.component';
import { CalendarModule as CalendarPrime } from '../fullcalendar/calendar.module';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [ListComponent, DetailComponent],
  imports: [
    CommonModule,
    PreAgendamentoRoutingModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    UIModule,
    RippleModule,
    SharedModule,
    TooltipModule,
    CalendarModule,
    CalendarPrime,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    RxReactiveFormsModule,
    DropdownModule,
    FormsModule,
    CalendarModule
  ]
})
export class PreAgendamentoModule {}
