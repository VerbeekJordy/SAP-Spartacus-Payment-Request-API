import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActiveCartService, Cart, OrderEntry, Product, RoutingService} from '@spartacus/core';
import {AddedToCartDialogComponent, AddToCartComponent, CurrentProductService, ModalRef, ModalService} from '@spartacus/storefront';
import {Observable, Subscription} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {delay, filter, timeout} from 'rxjs/operators';
import {ChangeDetectionStrategy} from '@angular/core';
import {CustomeProductBasket} from '../models/customProductBasket.model';
import {PaymentRequestService} from '../services/paymentRequest.service';

@Component({
  selector: 'app-custom-add-to-cart',
  templateUrl: './custom-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAddToCartComponent implements OnInit, OnDestroy {
  @Input() productCode: string;
  @Input() showQuantity = true;

  /**
   * As long as we do not support #5026, we require product input, as we need
   *  a reference to the product model to fetch the stock data.
   */
  @Input() product: Product;

  available = (window as any).PaymentRequest;

  buyNow = false;

  cart$: Observable<Cart>;
  entries$: Observable<OrderEntry[]>;
  products: Array<CustomeProductBasket> = [];
  total: number;

  maxQuantity: number;
  modalRef: ModalRef;

  hasStock = false;
  quantity = 1;
  increment = false;
  cartEntry$: Observable<OrderEntry>;

  subscription: Subscription;

  addToCartForm = new FormGroup({
    quantity: new FormControl(1),
  });

  constructor(
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    private cd: ChangeDetectorRef,
    protected activeCartService: ActiveCartService,
    protected routingService: RoutingService,
    protected paymentRequest: PaymentRequestService
  ) {
  }

  ngOnInit() {
    this.cart$ = this.activeCartService.getActive();
    this.entries$ = this.activeCartService
      .getEntries()
      .pipe(filter((entries) => entries.length > 0));

    if (this.product) {
      this.productCode = this.product.code;
      this.cartEntry$ = this.activeCartService.getEntry(this.productCode);
      this.setStockInfo(this.product);
      this.cd.markForCheck();
    } else if (this.productCode) {
      this.cartEntry$ = this.activeCartService.getEntry(this.productCode);
      // force hasStock and quantity for the time being, as we do not have more info:
      this.quantity = 1;
      this.hasStock = true;
      this.cd.markForCheck();
    } else {
      this.subscription = this.currentProductService
        .getProduct()
        .pipe(filter(Boolean))
        .subscribe((product: Product) => {
          this.productCode = product.code;
          this.setStockInfo(product);
          this.cartEntry$ = this.activeCartService.getEntry(this.productCode);
          this.cd.markForCheck();
        });
    }
  }

  private setStockInfo(product: Product): void {
    this.quantity = 1;
    this.hasStock =
      product.stock && product.stock.stockLevelStatus !== 'outOfStock';
    if (this.hasStock && product.stock.stockLevel) {
      this.maxQuantity = product.stock.stockLevel;
    }
  }

  updateCount(value: number): void {
    this.quantity = value;
  }

  addToCart() {
    const quantity = this.addToCartForm.get('quantity').value;
    if (!this.productCode || quantity <= 0) {
      return;
    }
    // check item is already present in the cart
    // so modal will have proper header text displayed
    this.activeCartService
      .getEntry(this.productCode)
      .subscribe((entry) => {
        if (entry) {
          this.increment = true;
        }
        this.activeCartService.addEntry(this.productCode, quantity);
        this.increment = false;

        if (this.buyNow === false) {
          this.routingService.go({cxRoute: 'home'});
        } else {
          this.routingService.go({cxRoute: 'cart'});
          console.log(this.activeCartService.getLoaded());
          setTimeout(() => {
            this.payButtonClicked();
          }, 1500);
          this.buyNow = false;
        }
      })
      .unsubscribe();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  payButtonClicked() {
    this.products = [];
    this.entries$.forEach((products) =>
      products.forEach((product) =>
        this.products.push(new CustomeProductBasket(product.product.name, product.totalPrice.value, product.quantity))));
    // tslint:disable-next-line:no-shadowed-variable
    this.cart$.subscribe((cart) => {
        if (cart.totalPrice !== undefined) {
          this.total = cart.totalPrice.value;
        }
      }
    );
    console.log('test');
    const request = this.paymentRequest.initPaymentRequest(this.total, this.products);
    this.paymentRequest.onBuyClicked(request);
  }
}
