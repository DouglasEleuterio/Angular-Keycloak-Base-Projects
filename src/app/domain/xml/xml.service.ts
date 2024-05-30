import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Xml } from './xml.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmlService extends BaseActiveService<Xml, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'xml');
  }

  public getQuantidadeXmlProcessado(): Observable<any> {
    return this.http.get(`${this.getBaseUrl()}/quantidade`);
  }
}
