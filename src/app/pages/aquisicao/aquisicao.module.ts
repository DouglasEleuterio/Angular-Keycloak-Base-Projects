import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UIModule } from '../../core/ui/ui.module';
import { RippleModule } from 'primeng/ripple';
import { AquisicaoRoutingModule } from './aquisicao-routing.module';
import { FormComponent } from './components/form/form.component';
import { NewComponent } from './pages/new/new.component';
import { ProcedimentoModule } from '../procedimento/procedimento.module';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [ListComponent, FormComponent, NewComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
    SharedModule,
    SharedModule,
    TableModule,
    TooltipModule,
    UIModule,
    RippleModule,
    AquisicaoRoutingModule,
    ProcedimentoModule,
    PaginatorModule,
    ReactiveFormsModule,
    CalendarModule,
    ChipsModule,
    DividerModule
  ]
})
export class AquisicaoModule {}
