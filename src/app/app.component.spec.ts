import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvService } from './env/env.service';

describe('AppComponent', () => {
  const envServiceSpy = jasmine.createSpyObj('EnvService', ['load']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: EnvService,
          useValue: { environment: { envServiceSpy } }
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
