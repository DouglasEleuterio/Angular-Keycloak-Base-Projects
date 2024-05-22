import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabelaAliquotaDiferenciadaRountingModule } from './tabela-aliquota-diferenciada-rounting.module';
import { ListComponent } from './pages/list/list.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { UIModule } from '../../core/ui/ui.module';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, TabelaAliquotaDiferenciadaRountingModule, ButtonModule, RippleModule, RouterLink, UIModule],
  providers: []
})
export class TabelaAliquotaDiferenciadaModule {}
