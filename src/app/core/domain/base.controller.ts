import { Injectable } from '@angular/core';
import { ApiListResponse } from '../api/response/api-list.response';
import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';
import { LoadingService } from '../../domain/loading/loading.service';
import { AlertService } from '../ui/notifications/alert.service';
import { ValidationService } from '../ui/notifications/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, switchMap } from 'rxjs/operators';
import { BaseActiveService } from './base.active.service';
import { Pagination } from '../api/model/pagination';
import { FormGroup } from '@angular/forms';
import { AppMenuItem } from '../../domain/menu/app-menu.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { fromPagination } from '../api/select/select';

type VoidCallback = () => void;
type PaginationCallback<T> = (result: ApiListResponse<T>) => void;

type LoadCallback<T> = (entity: T) => void;
type ParamsCallback<T> = (params: Params) => Observable<T>;

@Injectable({
  providedIn: 'root'
})
export class BaseController {
  constructor(
    private loadingService: LoadingService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  public remove<T extends BaseEntity, ID>(id: ID, service: BaseService<T, ID>, message: string, callback: VoidCallback): void {
    this.loadingService.startLoading();
    service
      .remove(id)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe({
        next: () => {
          this.alertService.defaultSuccess(this.translateService.instant(message.toUpperCase()));
          if (callback) {
            callback();
          }
        },
        error: error => this.validationService.handleErrorAlert(error)
      });
  }

  public active<T extends BaseEntity, ID>(
    id: ID,
    active: boolean,
    service: BaseActiveService<T, ID>,
    message: string,
    callback: VoidCallback,
    errorCallback?: VoidCallback
  ): void {
    this.loadingService.startLoading();
    service
      .active(id, active)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe({
        next: () => {
          this.alertService.defaultSuccess(this.translateService.instant(message.toUpperCase()));
          if (callback) {
            callback();
          }
        },
        error: error => {
          this.validationService.handleErrorAlert(error);
          // possibilidade de fazer tratativas quando um erro ao ativar/inativar ocorrer
          if (errorCallback) {
            errorCallback();
          }
        }
      });
  }

  public fetch<T extends BaseEntity, ID>(pagination: Pagination, service: BaseService<T, ID>, callback: PaginationCallback<T>): void {
    this.loadingService.startLoading();
    service
      .paginate(pagination)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe(result => {
        callback(result);
      });
  }

  public fetchSelect<T extends BaseEntity, ID>(
    select,
    pagination: Pagination,
    service: BaseService<T, ID>,
    callback: PaginationCallback<T>
  ): void {
    const query = fromPagination<T>(pagination).select(select).getQuery();
    this.loadingService.startLoading();
    service
      .fetchSelect<ApiListResponse<T>>(query)
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
        })
      )
      .subscribe(result => {
        callback(result);
      });
  }

  public save<T>(
    formGroup: FormGroup,
    observableFunction: Observable<T>,
    message: string,
    onStopLoading: VoidCallback,
    callback: VoidCallback
  ): void {
    this.loadingService.startLoading();
    observableFunction
      .pipe(
        finalize(() => {
          this.loadingService.stopLoading();
          onStopLoading();
        })
      )
      .subscribe({
        next: () => {
          callback();
        },
        error: error => this.validationService.handle(formGroup, error)
      });
  }

  public saveRedirect<T>(
    formGroup: FormGroup,
    observableFunction: Observable<T>,
    message: string,
    menuBack: AppMenuItem,
    onStopLoading: VoidCallback
  ): void {
    this.save(formGroup, observableFunction, message, onStopLoading, () => {
      this.router
        .navigate(menuBack.routerLink)
        .then(() => this.alertService.defaultSuccess(this.translateService.instant(message.toUpperCase())));
    });
  }

  public load<T extends BaseEntity, ID>(
    route: ActivatedRoute,
    service: BaseService<T, ID>,
    menuBack: AppMenuItem,
    callback: LoadCallback<T>
  ) {
    this.observableLoad(route, (params: Params) => service.get(params.id), menuBack, callback);
  }

  public observableLoad<T>(route: ActivatedRoute, paramsFunction: ParamsCallback<T>, menuBack: AppMenuItem, callback: LoadCallback<T>) {
    this.loadingService.startLoading();
    route.params
      .pipe(
        switchMap((params: Params) => {
          return paramsFunction(params).pipe(
            finalize(() => {
              this.loadingService.stopLoading();
            })
          );
        })
      )
      .subscribe({
        next: entity => callback(entity),
        error: error => this.router.navigate(menuBack.routerLink).then(() => this.validationService.handle(null, error))
      });
  }
}
