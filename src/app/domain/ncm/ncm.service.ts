import { Injectable } from '@angular/core';
import { NCM } from './ncm.model';

@Injectable({
  providedIn: 'root'
})
export class NcmService {
  ncm: NCM[] = [];
  constructor() {
    this.loadList();
  }

  private loadList() {
    this.ncm.push(
      { codigo: '22030000', inicio: new Date('2024-01-04'), fim: new Date('2025-01-01') },
      { codigo: '96190000', inicio: new Date('2024-01-04'), fim: new Date('2025-01-01') }
    );
  }

  public getMonoList(): NCM[] {
    return this.ncm;
  }
}
