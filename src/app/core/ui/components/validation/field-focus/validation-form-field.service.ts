import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidationFormFieldService {
  private gotoSource = new Subject<string>();

  gotoHandler = this.gotoSource.asObservable();

  goFirst(): void {
    this.gotoSource.next(null);
  }

  gotId(fieldId: string): void {
    this.gotoSource.next(fieldId);
  }
}
