import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AutorizacaoComponent } from './pages/autorizar-solicitacao.component/autorizar-solicitacao.component';
import { NaoAutorizacaoComponent } from './pages/nao-autorizar-solicitacao/nao-autorizar-solicitacao.component';
import { DevolverSolicitacaoComponent } from './pages/devolver-solicitacao/devolver-solicitacao.component';
import { AnalisarSolicitacaoComponent } from './pages/analisar-solicitacao/analisar-solicitacao.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { NewTrechoViagemComponent } from './pages/new-trecho-viagem/new-trecho-viagem.component';
import { EditTrechoViagemComponent } from './pages/edit-trecho-viagem/edit-trecho-viagem.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'new',
    component: NewComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  },
  {
    path: 'edit/:id/trecho-viagem/new',
    component: NewTrechoViagemComponent
  },
  {
    path: 'edit/:id/trecho-viagem/edit/:idTrecho',
    component: EditTrechoViagemComponent
  },
  {
    path: 'detail/:id',
    component: DetailComponent
  },
  {
    path: 'detail/:id/autorizar',
    component: AutorizacaoComponent
  },
  {
    path: 'detail/:id/nao-autorizar',
    component: NaoAutorizacaoComponent
  },
  {
    path: 'detail/:id/devolver',
    component: DevolverSolicitacaoComponent
  },
  {
    path: 'detail/:id/analisar',
    component: AnalisarSolicitacaoComponent
  },
  {
    path: 'historic/:id',
    component: HistoricoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoRoutingModule {}
