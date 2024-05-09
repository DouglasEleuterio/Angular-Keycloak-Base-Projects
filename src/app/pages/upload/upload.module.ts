import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './pages/upload/upload.component';
import { FormComponent } from './components/form/form.component';
import { UIModule } from '../../core/ui/ui.module';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [UploadComponent, FormComponent],
  imports: [CommonModule, UploadRoutingModule, UIModule, ToastModule, FileUploadModule]
})
export class UploadModule {}
