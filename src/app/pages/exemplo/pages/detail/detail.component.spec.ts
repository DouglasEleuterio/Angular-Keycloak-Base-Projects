import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../../layouts/mirage/breadcrumb.service';
import { AuthProvider } from '../../../../core/auth/auth.provider';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ExemploService } from '../../../../domain/exemplo/exemplo.service';
import { EnvService } from '../../../../env/env.service';

describe('EstadoDetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  const envServiceSpy = jasmine.createSpyObj('EnvService', ['load']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [
        ExemploService,
        {
          provide: EnvService,
          useValue: { environment: { envServiceSpy } }
        },
        MessageService,
        BreadcrumbService,
        AuthProvider,
        FormBuilder,
        { provide: ActivatedRoute, useValue: { params: new Subject() } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
