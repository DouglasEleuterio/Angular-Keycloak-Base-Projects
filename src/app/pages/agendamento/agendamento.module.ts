import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendamentoRoutingModule } from './agendamento-routing.module';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { CalendarModule } from '../fullcalendar/calendar.module';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { UIModule } from '../../core/ui/ui.module';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [ListComponent, DetailComponent],
  exports: [
    DetailComponent
  ],
  imports: [CommonModule, AgendamentoRoutingModule, CalendarModule, ToastModule, TableModule, UIModule, SharedModule, TooltipModule]
})
export class AgendamentoModule {}
