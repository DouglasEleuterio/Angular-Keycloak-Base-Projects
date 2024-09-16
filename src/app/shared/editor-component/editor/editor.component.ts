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
    selector: 'textarea',
    plugins: [
      // Core editing features
      'anchor',
      'autolink',
      'charmap',
      'codesample',
      'emoticons',
      'image',
      'link',
      'lists',
      'media',
      'searchreplace',
      'table',
      'visualblocks',
      'wordcount',
      // Your account includes a free trial of TinyMCE premium features
      // Try the most popular premium features until Sep 21, 2024:
      'checklist',
      'mediaembed',
      'casechange',
      'export',
      'formatpainter',
      'pageembed',
      'a11ychecker',
      'tinymcespellchecker',
      'permanentpen',
      'powerpaste',
      'advtable',
      'advcode',
      'editimage',
      'advtemplate',
      'ai',
      'mentions',
      'tinycomments',
      'tableofcontents',
      'footnotes',
      'mergetags',
      'autocorrect',
      'typography',
      'inlinecss',
      'markdown',
      'file',
      'help',
      'wordcount'
    ],
    toolbar: [
      'undo redo | styles | alignleft aligncenter alignright alignjustify | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | print preview  fullscreen forecolor backcolor emoticons | help'
    ],
    file_picker_types: 'image media',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' }
    ],
    menu: {
      file: {
        title: 'File',
        items: 'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations'
      },
      edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
      view: {
        title: 'View',
        items: 'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments'
      },
      insert: {
        title: 'Insert',
        items:
          'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime'
      },
      format: {
        title: 'Format',
        items:
          'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat'
      },
      tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
      table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
      help: { title: 'Help', items: 'help' }
    },
    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
    /* enable title field in the Image dialog*/
    image_title: true,
    /* enable automatic uploads of images represented by blob or data URIs*/
    automatic_uploads: true,
    /*
      URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
      images_upload_url: 'postAcceptor.php',
      here we add custom filepicker only to Image dialog
    */
    /* and here's our custom image picker*/
    file_picker_callback: (cb, value, meta) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.addEventListener('change', e => {
        // @ts-ignore
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          /*
            Note: Now we need to register the blob in TinyMCEs image blob
            registry. In the next release this part hopefully won't be
            necessary, as we are looking to handle it internally.
          */
          const id = 'blobid' + new Date().getTime();
          // @ts-ignore
          const blobCache = tinymce.activeEditor.editorUpload.blobCache;
          // @ts-ignore
          const base64 = reader.result.split(',')[1];
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);

          /* call the callback and populate the Title field with the file name */
          cb(blobInfo.blobUri(), { title: file.name });
        });
        reader.readAsDataURL(file);
      });

      input.click();
    },
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',

    branding: false,
    language: 'pt_BR'
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
