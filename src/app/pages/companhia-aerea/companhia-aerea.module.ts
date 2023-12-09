import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { FormComponent } from './components/form/form.component';
import { EditComponent } from './pages/edit/edit.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { UIModule } from '../../core/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../../shared/shared.module';
import { RippleModule } from 'primeng/ripple';
import { FiltersComponent } from './components/filters/filters.component';
import { AccordionModule } from 'primeng/accordion';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OrderListModule } from 'primeng/orderlist';
import { TreeDragDropService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { NewComponent } from './pages/new/new.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CompanhiaAereaRoutingModule } from './companhia-aerea-routing.module';
import { CompanhiaAereaService } from 'src/app/domain/companhia-aerea/companhia-aerea.service';
import { ContatoFormComponent } from './components/contato-form/contato-form.component';
import { ContatoListComponent } from './components/contato-list/contato-list.component';
import { ContatoService } from 'src/app/domain/companhia-aerea/contato.service';
import { InputMaskModule } from 'primeng/inputmask';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';

@NgModule({
  declarations: [ListComponent, FormComponent, EditComponent, FiltersComponent, NewComponent, ContatoFormComponent, ContatoListComponent],
  imports: [
    AccordionModule,
    CommonModule,
    TableModule,
    PaginatorModule,
    MultiSelectModule,
    InputTextModule,
    DropdownModule,
    UIModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    SharedModule,
    RippleModule,
    CompanhiaAereaRoutingModule,
    ToggleButtonModule,
    AutoCompleteModule,
    TooltipModule,
    InputSwitchModule,
    RadioButtonModule,
    OrderListModule,
    PanelModule,
    RxReactiveFormsModule,
    InputMaskModule
  ],
  providers: [CompanhiaAereaService, TreeDragDropService, ContatoService, IntegradorLocalidadeService]
})
export class CompanhiaAereaModule {}
