import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-loading',
  template: '<ngx-loading [show]="showLoading"></ngx-loading>'
})
export class LoadingComponent implements OnInit {
  public loading: Subject<boolean> = this.loadingService.loading;

  show = false;
  showLoading = false;

  counting = 0;

  constructor(public loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loading.subscribe(loading => {
      if (!loading && this.counting > 0) {
        this.counting = this.counting - 1;
      }
      if (loading) {
        this.counting = this.counting + 1;
      }
      this.show = this.counting > 0;
      if (this.show) {
        of(this.show)
          .pipe(delay(500))
          .subscribe(() => {
            this.showLoading = this.counting > 0;
          });
      } else {
        this.showLoading = false;
      }
    });
  }
}
