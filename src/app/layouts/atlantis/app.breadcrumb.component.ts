import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMenuItem } from '../../domain/menu/app-menu.model';
import { TranslateService } from '@ngx-translate/core';
import { AppBreadcrumbService } from './app.breadcrumb.service';
import { AppMainComponent } from './app.main.component';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {
  subscription: Subscription;

  items: AppMenuItem[];

  search: string;

  constructor(
    public appMain: AppMainComponent,
    public breadcrumbService: AppBreadcrumbService,
    private translateService: TranslateService
  ) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.items = response;
      if (this.items != null) {
        this.items = this.items.map(item => {
          return {
            ...item,
            label: this.label(item)
          } as AppMenuItem;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  label(item: AppMenuItem): string {
    if (item != null && item.noTranslate) {
      return item.label;
    }
    return this.translateService.instant(item?.label.toUpperCase());
  }
}
