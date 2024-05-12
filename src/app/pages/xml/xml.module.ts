import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmlRountingModule } from './xml-rounting.module';
import { ListComponent } from './pages/list/list.component';
import { UIModule } from '../../core/ui/ui.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, XmlRountingModule, UIModule, ButtonModule, RippleModule, RouterLink]
})
export class XmlModule {}
