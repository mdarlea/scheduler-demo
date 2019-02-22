import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSchedulerComponent } from './scheduler.component';

describe('SchedulerComponent', () => {
  let component: AppSchedulerComponent;
  let fixture: ComponentFixture<AppSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
