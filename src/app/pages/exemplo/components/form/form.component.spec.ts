import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../../layouts/mirage/breadcrumb.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EnvService } from '../../../../env/env.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  const envServiceSpy = jasmine.createSpyObj('EnvService', ['load']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        MessageService,
        BreadcrumbService,
        FormBuilder,
        {
          provide: EnvService,
          useValue: { environment: { envServiceSpy } }
        },
        { provide: ActivatedRoute, useValue: { paramMap: new Subject() } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
