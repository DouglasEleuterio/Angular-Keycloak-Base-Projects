import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { AccordionModule } from 'primeng/accordion';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OrderListModule } from 'primeng/orderlist';
import { TreeDragDropService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { ListComponent } from './pages/list/list.component';
import { FormComponent } from './components/form/form.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { FiltersComponent } from './components/filters/filters.component';
import { LocalDificilAcessoRoutingModule } from './local-dificil-acesso-routing.module';
import { LocalDificilAcessoService } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';

@NgModule({
  declarations: [ListComponent, FormComponent, NewComponent, EditComponent, FiltersComponent],
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
    LocalDificilAcessoRoutingModule,
    ToggleButtonModule,
    AutoCompleteModule,
    TooltipModule,
    InputSwitchModule,
    RadioButtonModule,
    OrderListModule,
    PanelModule,
    InputTextareaModule,
    RxReactiveFormsModule
  ],
  providers: [LocalDificilAcessoService, IntegradorLocalidadeService, TreeDragDropService]
})
export class LocalDificilAcessoModule {}
