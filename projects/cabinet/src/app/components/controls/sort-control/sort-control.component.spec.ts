import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortControlComponent } from './sort-control.component';

describe('SortControlComponent', () => {
  let component: SortControlComponent;
  let fixture: ComponentFixture<SortControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
