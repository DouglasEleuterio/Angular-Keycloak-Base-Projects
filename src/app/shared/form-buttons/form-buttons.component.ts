import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-buttons',
  templateUrl: './form-buttons.component.html',
  styleUrls: ['form-buttons.component.scss']
})
export class FormButtonsComponent {
  @Input()
  isDetail = false;

  @Input()
  isSubmitted = false;

  @Output() onCancel: EventEmitter<void> = new EventEmitter();

  @Input() isDisabled = false;

  cancel(): void {
    this.onCancel.emit();
  }
}
