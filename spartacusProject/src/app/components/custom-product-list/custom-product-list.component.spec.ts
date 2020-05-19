import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProductListComponent } from './custom-product-list.component';

describe('CustomProductListComponent', () => {
  let component: CustomProductListComponent;
  let fixture: ComponentFixture<CustomProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
