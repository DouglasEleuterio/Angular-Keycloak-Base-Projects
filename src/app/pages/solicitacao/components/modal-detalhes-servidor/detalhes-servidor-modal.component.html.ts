import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDetalhesServidor } from 'src/app/domain/servidor/servidor-detalhes.interface';

@Component({
  selector: 'app-detalhes-servidor-modal',
  templateUrl: './detalhes-servidor-modal.component.html.html',
  styleUrls: ['./detalhes-servidor-modal.component.html.scss']
})
export class DetalhesServidorModalComponent {
  @Input() visible: boolean;
  @Input() dadosServidor: IDetalhesServidor;

  @Output() onClose: EventEmitter<void> = new EventEmitter();

  close(): void {
    this.onClose.emit();
  }
}
