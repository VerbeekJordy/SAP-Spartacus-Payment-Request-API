import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProductListItemComponent } from './custom-product-list-item.component';

describe('CustomProductListItemComponent', () => {
  let component: CustomProductListItemComponent;
  let fixture: ComponentFixture<CustomProductListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomProductListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProductListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
