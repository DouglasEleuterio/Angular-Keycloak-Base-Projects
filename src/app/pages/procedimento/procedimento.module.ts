import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedimentoRoutingModule } from './procedimento-routing.module';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, ProcedimentoRoutingModule]
})
export class ProcedimentoModule {}
