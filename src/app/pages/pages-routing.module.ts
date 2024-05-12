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
    path: 'exemplo',
    loadChildren: () => import('./exemplo/exemplo.module').then(m => m.ExemploModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'xml',
    loadChildren: () => import('./xml/xml.module').then(m => m.XmlModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'tipo-localidade',
    loadChildren: () => import('./tipo-localidade/tipo-localidade.module').then(m => m.TipoLocalidadeModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'valor-diaria',
    loadChildren: () => import('./valor-diaria/valor-diaria.module').then(m => m.ValorDiariaModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'evento',
    loadChildren: () => import('./evento/evento.module').then(m => m.EventoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'solicitacao',
    loadChildren: () => import('./solicitacao/solicitacao.module').then(m => m.SolicitacaoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'tipo-evento',
    loadChildren: () => import('./tipo-evento/tipo-evento.module').then(m => m.TipoEventoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'preco-combustivel',
    loadChildren: () => import('./preco-combustivel/preco-combustivel.module').then(m => m.PrecoCombustivelModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'classificacao-localidade',
    loadChildren: () => import('./classificacao-localidade/classificacao-localidade.module').then(m => m.ClassificacaoLocalidadeModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'auxilio-alimentacao',
    loadChildren: () => import('./auxilio-alimentacao/auxilio-alimentacao.module').then(m => m.AuxilioAlimentacaoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'justificativa',
    loadChildren: () => import('./justificativa/justificativa.module').then(m => m.JustificativaModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'local-dificil-acesso',
    loadChildren: () => import('./local-dificil-acesso/local-dificil-acesso.module').then(m => m.LocalDificilAcessoModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'companhia-aerea',
    loadChildren: () => import('./companhia-aerea/companhia-aerea.module').then(m => m.CompanhiaAereaModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'indenizacao-transporte',
    loadChildren: () => import('./indenizacao-transporte/indenizacao-transporte.module').then(m => m.IndenizacaoTransporteModule),
    canActivate: [TableStateClearGuard]
  },
  {
    path: 'distancia-localidade',
    loadChildren: () => import('./distancia-localidade/distancia-localidade.module').then(m => m.DistanciaLocalidadeModule),
    canActivate: [TableStateClearGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
