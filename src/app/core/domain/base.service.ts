import { Observable } from 'rxjs';
import { BaseEntity } from './base.entity';
import { Pagination } from '../api/model/pagination';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { ApiListResponse } from '../api/response/api-list.response';
import { ExporterRequest, ExporterType } from './model/exporter-request.model';
import { map } from 'rxjs/operators';
import { ExporterData } from './model/exporter-data.model';
import { QueryBuilder } from '../api/select/select';

export abstract class BaseService<T extends BaseEntity, ID> {
  protected envService: EnvService;
  protected http: HttpClient;
  protected api: string;
  protected searchStrategy;

  protected constructor(http: HttpClient, envService: EnvService, api: string) {
    this.http = http;
    this.api = api;
    this.envService = envService;
  }

  paginate(pagination: Pagination): Observable<ApiListResponse<T>> {
    return this.http.get<ApiListResponse<T>>(`${this.getBaseUrl()}`, { params: pagination.getParams() });
  }

  get(id: ID): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}/${id}`);
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.getBaseUrl()}/all`);
  }

  remove(id: ID): Observable<T> {
    return this.http.delete<T>(`${this.getBaseUrl()}/${id}`);
  }

  create(entity: T): Observable<T> {
    return this.http.post<T>(this.getBaseUrl(), {
      ...entity
    });
  }

  fetchSelect<U>(query: QueryBuilder<T>): Observable<U> {
    const params: Record<string, string> = query.build();
    return this.http.get<U>(`${this.getBaseUrl()}/select`, {
      params: params
    });
  }

  update(entity: T): Observable<T> {
    return this.http.put<T>(`${this.getBaseUrl()}/${entity.id}`, {
      ...entity
    });
  }

  export(type: ExporterType, request: ExporterRequest): Observable<ExporterData> {
    return this.http
      .post(`${this.getBaseUrl()}/export/${type}`, request, {
        responseType: 'blob',
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<Blob>) => {
          const filename = res.headers.get('content-disposition').split(';')[1].split('=')[1].replace(/"/g, '');
          return new ExporterData(filename, res.body);
        })
      );
  }

  getBaseUrl(): string {
    return `${this.envService.environment.baseUrl}/${this.api}`;
  }

  getHttp(): HttpClient {
    return this.http;
  }
}
