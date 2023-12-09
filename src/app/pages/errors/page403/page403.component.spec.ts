import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Page403Component } from './page403.component';
import { AppTranslateMockPipe } from '../../../core/ui/pipes/app-translate-mock-pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('Page403Component', () => {
  let component: Page403Component;
  let fixture: ComponentFixture<Page403Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Page403Component, AppTranslateMockPipe],
      imports: [TranslateModule.forRoot()],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Page403Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
