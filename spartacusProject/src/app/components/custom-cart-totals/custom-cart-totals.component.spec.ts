import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCartTotalsComponent } from './custom-cart-totals.component';

describe('CustomCartTotalsComponent', () => {
  let component: CustomCartTotalsComponent;
  let fixture: ComponentFixture<CustomCartTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCartTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCartTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
