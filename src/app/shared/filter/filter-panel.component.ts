import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  template: `
    <div class="grid mt-2">
      <div class="col-12">
        <ng-template></ng-template>
        <ng-content></ng-content>
        <div class="flex justify-content-end col-12" style="gap: 10px">
          <button
            pButton
            pRipple
            (click)="clearEvent.emit()"
            type="button"
            [label]="'clear' | appTranslate : 'shared'"
            class="p-button-outlined"
          ></button>
          <button pButton pRipple (click)="searchEvent.emit()" type="button" [label]="'search' | appTranslate : 'shared'"></button>
        </div>
      </div>
    </div>
  `
})
export class FilterPanelComponent {
  @Input()
  header: string;

  @Output() clearEvent = new EventEmitter<void>();
  @Output() searchEvent = new EventEmitter<void>();
}
