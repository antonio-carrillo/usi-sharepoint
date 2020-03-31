import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoversViewComponent } from './covers-view.component';

describe('CoversViewComponent', () => {
  let component: CoversViewComponent;
  let fixture: ComponentFixture<CoversViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoversViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoversViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
