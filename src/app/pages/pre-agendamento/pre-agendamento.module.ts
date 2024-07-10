import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { PreAgendamentoRoutingModule } from './pre-agendamento-routing.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UIModule } from '../../core/ui/ui.module';
import { RippleModule } from 'primeng/ripple';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { DetailComponent } from './pages/detail/detail.component';

@NgModule({
  declarations: [ListComponent, DetailComponent],
  imports: [CommonModule, PreAgendamentoRoutingModule, ButtonModule, InputTextModule, ReactiveFormsModule, SharedModule, TableModule, UIModule, RippleModule, SharedModule, TooltipModule]
})
export class PreAgendamentoModule {}
