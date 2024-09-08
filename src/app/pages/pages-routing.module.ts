import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableStateClearGuard } from '../core/guard/table-state.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'errors',
    loadChildren: () => import('./errors/errors.module').then(m => m.ErrorsModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'cliente',
    loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'procedimento',
    loadChildren: () => import('./procedimento/procedimento.module').then(m => m.ProcedimentoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'aquisicao',
    loadChildren: () => import('./aquisicao/aquisicao.module').then(m => m.AquisicaoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'pre-agendamento',
    loadChildren: () => import('./pre-agendamento/pre-agendamento.module').then(m => m.PreAgendamentoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'agendamento',
    loadChildren: () => import('./agendamento/agendamento.module').then(m => m.AgendamentoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'exemplo',
    loadChildren: () => import('./exemplo/exemplo.module').then(m => m.ExemploModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'termo',
    loadChildren: () => import('./termo/termo.module').then(m => m.TermoModule),
    canActivate: [TableStateClearGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
