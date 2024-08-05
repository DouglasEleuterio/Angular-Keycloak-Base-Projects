import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { UIModule } from '../core/ui/ui.module';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'primeng/api';
import { HomeComponent } from './home/home.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { CalendarModule } from './fullcalendar/calendar.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    UIModule,
    TranslateModule,
    DropdownModule,
    DialogModule,
    CardModule,
    CheckboxModule,
    SharedModule,
    LayoutsModule,
    AgendamentoModule,
    CalendarModule,
    ToastModule
  ]
})
export class PagesModule {}
