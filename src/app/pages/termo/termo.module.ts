import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './pages/list/list.component';
import { TermoRoutingModule } from './termo-routing.module';
import { DetailComponent } from './pages/detail/detail.component';
import { EditorComponent } from '../../shared/editor-component/editor/editor.component';

@NgModule({
  declarations: [ListComponent, DetailComponent],
  imports: [CommonModule, SharedModule, TermoRoutingModule, EditorComponent]
})
export class TermoModule {}
