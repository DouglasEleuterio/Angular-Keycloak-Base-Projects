import { NgModule } from '@angular/core';
import { ProdutosIncidenciaMonofasicaRoutingModuleModule } from './produtos-incidencia-monofasica-routing.module.module';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { UIModule } from '../../core/ui/ui.module';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    ProdutosIncidenciaMonofasicaRoutingModuleModule,
    ButtonModule,
    RippleModule,
    UIModule,
    SharedModule,
    SharedModule,
    TableModule,
    TooltipModule
  ]
})
export class ProdutosIncidenciaMonofasicaModule {}
