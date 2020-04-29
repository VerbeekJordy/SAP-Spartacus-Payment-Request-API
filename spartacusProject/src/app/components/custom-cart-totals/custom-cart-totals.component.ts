import {Component, OnInit} from '@angular/core';
import {ActiveCartService, Cart, OrderEntry} from '@spartacus/core';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-custom-cart-totals',
  templateUrl: './custom-cart-totals.component.html'
})
export class CustomCartTotalsComponent implements OnInit {
  cart$: Observable<Cart>;
  entries$: Observable<OrderEntry[]>;

  constructor(protected activeCartService: ActiveCartService) {
  }

  ngOnInit() {
    console.log('test');
    this.cart$ = this.activeCartService.getActive();
    this.entries$ = this.activeCartService
      .getEntries()
      .pipe(filter((entries) => entries.length > 0));
  }

}
