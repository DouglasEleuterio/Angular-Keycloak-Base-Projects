import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoadingService {
  loading = new Subject<boolean>();

  protected itemsHandler: Observable<boolean>;

  startLoading(): void {
    this.loading.next(true);
  }

  stopLoading(): void {
    this.loading.next(false);
  }

  handleItems(): Observable<boolean> {
    this.itemsHandler = this.loading.asObservable();
    return this.itemsHandler;
  }
}
