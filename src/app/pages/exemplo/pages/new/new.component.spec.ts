import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComponent } from './new.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../../layouts/mirage/breadcrumb.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExemploService } from '../../../../domain/exemplo/exemplo.service';
import { EnvService } from '../../../../env/env.service';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  const envServiceSpy = jasmine.createSpyObj('EnvService', ['load']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [
        ExemploService,
        {
          provide: EnvService,
          useValue: { environment: { envServiceSpy } }
        },
        FormBuilder,
        MessageService,
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: { paramMap: new Subject() } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
