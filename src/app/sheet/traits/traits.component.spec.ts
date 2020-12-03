import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TraitsComponent } from './traits.component';

describe('TraitsComponent', () => {
  let component: TraitsComponent;
  let fixture: ComponentFixture<TraitsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TraitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
