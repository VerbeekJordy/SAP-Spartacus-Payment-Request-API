import {Component, OnInit} from '@angular/core';
import {ActiveCartService, Cart, OrderEntry} from '@spartacus/core';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {PaymentRequestService} from '../../services/paymentRequest.service';
import {CustomeProductBasket} from '../../models/customProductBasket.model';

@Component({
  selector: 'app-custom-cart-totals',
  templateUrl: './custom-cart-totals.component.html'
})
export class CustomCartTotalsComponent implements OnInit {
  cart$: Observable<Cart>;
  entries$: Observable<OrderEntry[]>;
  available = (window as any).PaymentRequest;
  total: number;
  products: Array<CustomeProductBasket> = [];

  constructor(protected activeCartService: ActiveCartService, protected paymentRequest: PaymentRequestService) {
  }

  ngOnInit() {
    this.cart$ = this.activeCartService.getActive();
    this.entries$ = this.activeCartService
      .getEntries()
      .pipe(filter((entries) => entries.length > 0));
  }

  payButtonClicked() {
    this.products = [];
    this.entries$.forEach((products) =>
      products.forEach((product) =>
        this.products.push(new CustomeProductBasket(product.product.name, product.totalPrice.value, product.quantity))));
    this.cart$.forEach((checkout) => this.total = checkout.totalPrice.value);
    const request = this.paymentRequest.initPaymentRequest(this.total, this.products);
    this.paymentRequest.onBuyClicked(request);
  }
}

