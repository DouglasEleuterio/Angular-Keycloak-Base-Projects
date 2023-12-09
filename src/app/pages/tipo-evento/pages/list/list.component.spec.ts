import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { AppTranslateMockPipe } from '../../../../core/ui/pipes/app-translate-mock-pipe';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvService } from '../../../../core/services/env.service';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../../layouts/mirage/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { EstadoService } from '../../../../domain/estado/estado.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  const envServiceSpy = jasmine.createSpyObj('EnvService', ['load']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent, AppTranslateMockPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        EstadoService,
        {
          provide: EnvService,
          useValue: { environment: { envServiceSpy } }
        },
        MessageService,
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: { paramMap: new Subject() } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
