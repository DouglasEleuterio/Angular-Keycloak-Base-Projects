import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-data-label',
  templateUrl: './data-label.component.html',
  styleUrls: ['./data-label.component.scss']
})
export class DataLabelComponent implements OnChanges {
  @Input() title: string;
  @Input() value: string;
  @Input() htmlValue: string;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['htmlValue']) {
      this.htmlValue = <any>this.sanitizer.bypassSecurityTrustHtml(this.htmlValue);
    }
  }
}
