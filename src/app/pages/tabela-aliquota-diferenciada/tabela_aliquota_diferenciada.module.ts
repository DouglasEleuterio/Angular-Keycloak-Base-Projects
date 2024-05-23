import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabelaAliquotaDiferenciadaRountingModule } from './tabela-aliquota-diferenciada-rounting.module';
import { ListComponent } from './pages/list/list.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { UIModule } from '../../core/ui/ui.module';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    TabelaAliquotaDiferenciadaRountingModule,
    ButtonModule,
    RippleModule,
    RouterLink,
    UIModule,
    TableModule,
    SharedModule,
    TooltipModule,
    LayoutsModule
  ],
  providers: []
})
export class TabelaAliquotaDiferenciadaModule {}
