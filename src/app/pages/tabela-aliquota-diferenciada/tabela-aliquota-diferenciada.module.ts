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
import { DetailComponent } from './pages/detail/detail.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveTypedFormsModule, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { DividerModule } from 'primeng/divider';
import { FormComponent } from './components/form/form.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [ListComponent, DetailComponent, NewComponent, EditComponent, FormComponent],
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
    LayoutsModule,
    CalendarModule,
    ReactiveFormsModule,
    ReactiveTypedFormsModule,
    RxReactiveFormsModule,
    DividerModule,
    InputTextModule
  ],
  providers: []
})
export class TabelaAliquotaDiferenciadaModule {}
