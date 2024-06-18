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

@NgModule({
  declarations: [FormComponent, ListComponent],
  imports: [CommonModule, ClienteRoutingModule, TableModule, ButtonModule, SharedModule, UIModule, TooltipModule]
})
export class ClienteModule {}
