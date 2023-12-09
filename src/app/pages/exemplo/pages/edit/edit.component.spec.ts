import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/layouts/mirage/breadcrumb.service';
import { EditComponent } from './edit.component';
import { ExemploService } from '../../../../domain/exemplo/exemplo.service';
import { EnvService } from '../../../../env/env.service';

describe('EstadoEditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  const envServiceSpy = jasmine.createSpyObj('EnvService', ['load']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        ExemploService,
        {
          provide: EnvService,
          useValue: { environment: { envServiceSpy } }
        },
        MessageService,
        FormBuilder,
        { provide: ActivatedRoute, useValue: { params: new Subject() } },
        BreadcrumbService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
