import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAddToCartComponent } from './custom-add-to-cart.component';

describe('CustomAddToCartComponent', () => {
  let component: CustomAddToCartComponent;
  let fixture: ComponentFixture<CustomAddToCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAddToCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAddToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
