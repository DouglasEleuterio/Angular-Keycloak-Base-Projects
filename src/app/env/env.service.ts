import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Env } from './env.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class EnvService {
  public static env: Env;

  constructor(private http: HttpClient) {}

  loadEnv(): Promise<boolean> {
    return new Promise(resolve => {
      this.http
        .get<Env>('./assets/config/envs/environment.json', { responseType: 'json' })
        .toPromise()
        .then(data => {
          EnvService.env = {
            ...data,
            version: environment.version
          };
          if (EnvService.env.disableRefresh == null) {
            EnvService.env.disableRefresh = false;
          }
          resolve(true);
        });
    });
  }

  get environment(): Env {
    return EnvService.env;
  }
}
