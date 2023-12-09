import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';

export abstract class BaseActiveService<T extends BaseEntity, ID> extends BaseService<T, ID> {
  protected constructor(http: HttpClient, envService: EnvService, api: string) {
    super(http, envService, api);
  }

  active(id: ID, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.getBaseUrl()}/active/${id}`, {
      ativo: !active
    });
  }
}
