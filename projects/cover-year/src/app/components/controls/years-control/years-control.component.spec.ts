import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsControlComponent } from './years-control.component';

describe('YearsControlComponent', () => {
  let component: YearsControlComponent;
  let fixture: ComponentFixture<YearsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
