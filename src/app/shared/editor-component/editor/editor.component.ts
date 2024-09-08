import { Component } from '@angular/core';
import { EditorComponent as Editor } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-tinymce-editor',
  templateUrl: './editor.component.html',
  standalone: true,
  imports: [Editor],
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  init: { plugins: string } = {
    plugins: 'lists link image table code help wordcount'
  };
}
