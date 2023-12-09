import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorsRoutingModule } from './errors-routing.module';
import { Page403Component } from './page403/page403.component';
import { TranslateModule } from '@ngx-translate/core';
import { UIModule } from '../../core/ui/ui.module';

@NgModule({
  declarations: [Page403Component],
  imports: [CommonModule, ErrorsRoutingModule, TableModule, PaginatorModule, UIModule, ReactiveFormsModule, TranslateModule]
})
export class ErrorsModule {}
