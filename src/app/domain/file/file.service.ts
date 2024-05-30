import { Injectable } from '@angular/core';
import { BaseActiveService } from '../../core/domain/base.active.service';
import { Xml } from '../xml/xml.model';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../env/env.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService extends BaseActiveService<Xml, string> {
  constructor(http: HttpClient, envService: EnvService) {
    super(http, envService, 'upload');
  }

  public getQuantidadeXmlProcessado(): Observable<any> {
    return this.http.get(`${this.getBaseUrl()}/quantidade`);
  }

  public getQuantidadeXmlErro(): Observable<any> {
    return this.http.get(`${this.getBaseUrl()}/quantidade-erro`);
  }
}
