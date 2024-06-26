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

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    ProcedimentoRoutingModule,
    ButtonModule,
    SharedModule,
    SharedModule,
    TableModule,
    TooltipModule,
    UIModule,
    RippleModule
  ]
})
export class ProcedimentoModule {}
