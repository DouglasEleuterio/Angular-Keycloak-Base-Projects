import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorComponent as Editor } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-tinymce-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: true,
  imports: [Editor, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true
    }
  ]
})
export class EditorComponent implements ControlValueAccessor {
  init = {
    selector: 'textarea#open-source-plugins',
    plugins: 'lists link image table code help wordcount',
    branding: false,
    language: 'pt_BR',
    toolbar:
      'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullscreen | forecolor backcolor emoticons | help',
  };

  // Funções de ControlValueAccessor
  private onChange: (value: string) => void;
  private onTouched: () => void;
  protected editorContent: string;

  // Método chamado pelo Angular para escrever um novo valor no componente
  writeValue(value: string): void {
    this.editorContent = value;
  }

  // Registra uma função de callback para notificar sobre mudanças no valor
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  // Registra uma função de callback para notificar quando o componente é tocado
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Habilita/desabilita o componente
  setDisabledState?(isDisabled: boolean): void {
    // Implemente a lógica para desabilitar o componente aqui
  }

  // Atualiza o valor do editor e notifica o Angular
  onEditorChange(content: string) {
    this.editorContent = content;
    if (this.onChange) {
      this.onChange(content);
    }
  }
}
