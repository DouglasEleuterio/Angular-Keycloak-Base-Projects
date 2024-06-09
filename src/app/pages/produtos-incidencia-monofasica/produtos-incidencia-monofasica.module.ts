import { NgModule } from '@angular/core';
import { ProdutosIncidenciaMonofasicaRoutingModuleModule } from './produtos-incidencia-monofasica-routing.module.module';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { UIModule } from '../../core/ui/ui.module';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { LayoutsModule } from '../../layouts/layouts.module';
import { FiltersComponent } from './components/filters/filters.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [ListComponent, FiltersComponent],
  imports: [
    CommonModule,
    ProdutosIncidenciaMonofasicaRoutingModuleModule,
    ButtonModule,
    RippleModule,
    UIModule,
    SharedModule,
    TableModule,
    TooltipModule,
    LayoutsModule,
    RxReactiveFormsModule,
    CalendarModule,
    InputTextModule
  ]
})
export class ProdutosIncidenciaMonofasicaModule {}
