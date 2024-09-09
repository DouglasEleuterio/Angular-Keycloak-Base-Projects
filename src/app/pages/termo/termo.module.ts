import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { TermoRoutingModule } from './termo-routing.module';
import { DetailComponent } from './pages/detail/detail.component';
import { EditorComponent } from '../../shared/editor-component/editor/editor.component';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { UIModule } from '../../core/ui/ui.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DockModule } from 'primeng/dock';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { NewComponent } from './pages/new/new.component';

@NgModule({
  declarations: [ListComponent, DetailComponent, FormComponent, NewComponent],
  imports: [
    CommonModule,
    TermoRoutingModule,
    EditorComponent,
    SharedModule,
    TableModule,
    UIModule,
    ButtonModule,
    RippleModule,
    DockModule,
    ReactiveFormsModule,
    DropdownModule,
    RxReactiveFormsModule
  ]
})
export class TermoModule {}
