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
import { SolicitacaoService } from 'src/app/domain/solicitacao/solicitacao.service';
import { SolicitacaoRoutingModule } from './solicitacao-routing.module';
import { ListComponent } from './pages/list/list.component';
import { FormComponent } from './components/form/form.component';
import { NewComponent } from './pages/new/new.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { FiltersComponent } from './components/filters/filters.component';
import { SituacaoSolicitacaoService } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.service';
import { SituacaoSolicitacaoFaseService } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.service';
import { ContaBancariaService } from 'src/app/domain/conta-bancaria/conta-bancaria.service';
import { SolicitanteService } from 'src/app/domain/solicitante/solicitante.service';
import { ServidorService } from 'src/app/domain/servidor/servidor.service';
import { ButtonsTableSolicitacaoComponent } from './components/buttons-table/buttons-table.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditComponent } from './pages/edit/edit.component';
import { DetailComponent } from './pages/detail/detail.component';
import { JustificativaService } from 'src/app/domain/justificativa/justificativa.service';
import { AutorizacaoComponent } from './pages/autorizar-solicitacao.component/autorizar-solicitacao.component';
import { HistoricoSituacaoSolicitacaoService } from 'src/app/domain/historico-situacao-solicitacao/historico-situacao-solicitacao.service';
import { NaoAutorizacaoComponent } from './pages/nao-autorizar-solicitacao/nao-autorizar-solicitacao.component';
import { EventoService } from 'src/app/domain/evento/evento.service';
import { FormEditComponent } from './components/form-edit/form-edit.component';
import { DevolverSolicitacaoComponent } from './pages/devolver-solicitacao/devolver-solicitacao.component';
import { AnalisarSolicitacaoComponent } from './pages/analisar-solicitacao/analisar-solicitacao.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { DetalhesServidorModalComponent } from './components/modal-detalhes-servidor/detalhes-servidor-modal.component.html';
import { FormDetailComponent } from './components/form-detail/form-detail.component';
import { StepsModule } from 'primeng/steps';
import { FormTrechoViagemComponent } from './components/form-trecho-viagem/form-trecho-viagem.component';
import { NewTrechoViagemComponent } from './pages/new-trecho-viagem/new-trecho-viagem.component';
import { TrechoViagemService } from 'src/app/domain/trecho-viagem/trecho-viagem.service';
import { LocalDificilAcessoService } from 'src/app/domain/local-dificil-acesso/local-dificil-acesso.service';
import { EditTrechoViagemComponent } from './pages/edit-trecho-viagem/edit-trecho-viagem.component';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';

@NgModule({
  declarations: [
    ListComponent,
    FormComponent,
    FormEditComponent,
    NewComponent,
    EditComponent,
    DetailComponent,
    ButtonsTableSolicitacaoComponent,
    FiltersComponent,
    AutorizacaoComponent,
    NaoAutorizacaoComponent,
    DevolverSolicitacaoComponent,
    AnalisarSolicitacaoComponent,
    HistoricoComponent,
    DetalhesServidorModalComponent,
    FormDetailComponent,
    FormTrechoViagemComponent,
    NewTrechoViagemComponent,
    EditTrechoViagemComponent
  ],
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
    SolicitacaoRoutingModule,
    ToggleButtonModule,
    AutoCompleteModule,
    TooltipModule,
    InputSwitchModule,
    RadioButtonModule,
    OrderListModule,
    PanelModule,
    CheckboxModule,
    InputTextareaModule,
    CalendarModule,
    InputMaskModule,
    DialogModule,
    InputNumberModule,
    RxReactiveFormsModule,
    StepsModule
  ],
  providers: [
    SolicitacaoService,
    SituacaoSolicitacaoService,
    SituacaoSolicitacaoFaseService,
    TreeDragDropService,
    ServidorService,
    ContaBancariaService,
    SolicitanteService,
    JustificativaService,
    HistoricoSituacaoSolicitacaoService,
    SituacaoSolicitacaoService,
    EventoService,
    TrechoViagemService,
    LocalDificilAcessoService,
    IntegradorLocalidadeService
  ]
})
export class SolicitacaoModule {}
