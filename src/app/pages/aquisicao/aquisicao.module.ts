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

@NgModule({
  declarations: [ListComponent],
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
    AquisicaoRoutingModule
  ]
})
export class AquisicaoModule {}
