import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/auth/auth.service';
import { LogService } from '../../../core/log/log.service';
import { AlertService } from '../../../core/ui/notifications/alert.service';
import { EnvService } from '../../../env/env.service';
import { AuthorizationCodeCallback } from '../../../core/auth/model/authorization-code.model';
import { ApiErrorResponse } from '../../../core/api/response/api-error.response';
import { LoadingStatusEnum } from '../../../domain/loading/loading-status.enum';

@Component({
  templateUrl: 'oauth-callback.component.html',
  styleUrls: ['oauth-callback.component.scss']
})
export class OAuthAuthorizeCallbackComponent implements OnInit {
  status: LoadingStatusEnum;
  error: ApiErrorResponse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logService: LogService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private envService: EnvService
  ) {}

  ngOnInit(): void {
    if (this.envService.environment.authParamsType === 'query') {
      this.route.queryParams.subscribe(
        (params: Params) => {
          if (!params.code) {
            //this.redirectLogin();
          } else {
            this.requestToken({
              code: params.code,
              scope: params.scope,
              session_state: params.session_state,
              state: params.state
            });
          }
        },
        error => {
          this.logService.debug('OAuthAuthorizeCallbackComponent', error);
          this.alertService.defaultError(error);
        }
      );
    } else if (window.location.href && window.location.href.includes('#')) {
      try {
        const params = window.location.href.split('#')[1].split('&');
        const paramsMap = new Map();
        params.forEach(param => {
          const splitParam = param.split('=');
          paramsMap.set(splitParam[0], splitParam[1]);
        });

        if (paramsMap.get('code') == null) {
          //this.redirectLogin();
        } else {
          this.requestToken({
            code: paramsMap.get('code'),
            scope: paramsMap.get('scope'),
            session_state: paramsMap.get('session_state'),
            state: paramsMap.get('state')
          });
        }
      } catch (e) {
        this.logService.debug('OAuthAuthorizeCallbackComponent', e);
        this.alertService.defaultError(e);
      }
    } else {
      this.redirectLogin();
    }
  }

  requestToken(authorizationCode: AuthorizationCodeCallback): void {
    this.status = LoadingStatusEnum.LOADING;
    this.authenticationService.callback(authorizationCode).subscribe(
      authUser => {
        this.logService.debug(this.constructor.name, 'Retorno do login: ', authUser);
        this.status = LoadingStatusEnum.SUCCESS;
        this.router.navigate(['/home']).then();
      },
      error => {
        this.logService.debug('OAuthAuthorizeCallbackComponent', error);
        this.alertService.defaultError(error);
        this.error = error;
        this.status = LoadingStatusEnum.ERROR;
      }
    );
  }

  redirectLogin(): void {
    this.router.navigate(['/account/login']).then();
  }

  isLoading(): boolean {
    return this.status == LoadingStatusEnum.LOADING;
  }

  isError(): boolean {
    return this.status == LoadingStatusEnum.ERROR;
  }
}
