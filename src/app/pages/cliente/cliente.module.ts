import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { ClienteRoutingModule } from './cliente-routing.module';
import { ListComponent } from './pages/list/list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../../shared/shared.module';
import { UIModule } from '../../core/ui/ui.module';
import { TooltipModule } from 'primeng/tooltip';
import { DetailComponent } from './pages/detail/detail.component';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { NewComponent } from './pages/new/new.component';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskDirective } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveTypedFormsModule, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { DropdownModule } from 'primeng/dropdown';
import { EstadoService } from '../../domain/endereco/estado.service';
import { CidadeService } from '../../domain/endereco/cidade.service';

@NgModule({
  declarations: [FormComponent, ListComponent, DetailComponent, NewComponent],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    TableModule,
    ButtonModule,
    SharedModule,
    UIModule,
    TooltipModule,
    DividerModule,
    AccordionModule,
    CalendarModule,
    InputTextModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    ReactiveTypedFormsModule,
    RxReactiveFormsModule,
    DropdownModule
  ],
  providers: [EstadoService, CidadeService]
})
export class ClienteModule {}
