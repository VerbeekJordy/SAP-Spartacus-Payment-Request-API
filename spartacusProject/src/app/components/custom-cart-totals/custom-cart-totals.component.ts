import {Component, OnInit} from '@angular/core';
import {ActiveCartService, Cart, OrderEntry} from '@spartacus/core';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {PaymentRequestService} from '../../services/paymentRequest.service';

@Component({
  selector: 'app-custom-cart-totals',
  templateUrl: './custom-cart-totals.component.html'
})
export class CustomCartTotalsComponent implements OnInit {
  cart$: Observable<Cart>;
  entries$: Observable<OrderEntry[]>;
  available = (window as any).PaymentRequest;
  total: number;

    constructor(protected activeCartService: ActiveCartService, protected paymentRequest: PaymentRequestService) {
  }

  ngOnInit() {
    this.cart$ = this.activeCartService.getActive();
    this.entries$ = this.activeCartService
      .getEntries()
      .pipe(filter((entries) => entries.length > 0));
  }

  payButtonClicked() {
    this.entries$.forEach((a) => console.log(a));
    this.cart$.forEach((a) => console.log(this.total = a.totalPrice.value));
    const request = this.paymentRequest.initPaymentRequest(this.total);
    this.paymentRequest.onBuyClicked(request);
  }
}

