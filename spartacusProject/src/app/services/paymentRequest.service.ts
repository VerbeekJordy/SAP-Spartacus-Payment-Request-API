import {Component, Injectable, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CheckoutDeliveryService, CheckoutPaymentService, CheckoutService, Product, RoutingService} from '@spartacus/core';
import {CustomeProductBasket} from '../models/customProductBasket.model';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {AddressService} from './address.service';
import {DeliveryModeService} from './deliveryMode.service';
import {PaymentService} from './payment.service';

@Injectable()
export class PaymentRequestService {

  placeOrderSubscription: Subscription;

  products: Array<CustomeProductBasket>;

  total = 0;

  paymentBasket = [];

  googlePaymentDataRequest = {
    environment: 'TEST',
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      merchantName: 'Example Merchant'
    },
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'example',
          gatewayMerchantId: 'exampleGatewayMerchantId'
        }
      }
    }, ]
  };

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, protected routingService: RoutingService, protected checkoutService: CheckoutService, protected addressService: AddressService,
              protected  deliveryModeService: DeliveryModeService, protected paymentService: PaymentService,
              protected checkoutDeliveryService: CheckoutDeliveryService, protected checkoutPaymentService: CheckoutPaymentService) {
  }

  creatingBasketItems() {
    for (const item of this.products) {
      this.paymentBasket.push({
        label: item.quantity + '  x  ' + item.name,
        amount: {currency: 'EUR', value: item.totalPrice + ''},
      });
    }
    this.paymentBasket.push({
      label: 'Free shipping',
      amount: {currency: 'EUR', value: '0.00'}
    });
  }

  initPaymentRequest(total: number, products: Array<CustomeProductBasket>) {
    this.total = total;
    this.products = products;
    this.paymentBasket = [];

    this.placeOrderSubscription = this.checkoutService
      .getOrderDetails()
      .pipe(filter((order) => Object.keys(order).length !== 0))
      .subscribe(() => {
        this.routingService.go({cxRoute: 'orderConfirmation'});
      });

    const supportedInstruments = [{
      supportedMethods: 'basic-card',
      data: {supportedNetworks: ['visa', 'mastercard', 'maestro']}
    }];

    this.creatingBasketItems();

    const details = {
      total: {label: 'Total', amount: {currency: 'EUR', value: this.total + ''}},
      displayItems: this.paymentBasket,
      shippingOptions: [
        {
          id: 'free',
          label: 'Free shipping',
          amount: {currency: 'EUR', value: '0.00'},
          selected: true
        },
        {
          id: 'premium',
          label: 'Premium shipping',
          amount: {currency: 'EUR', value: '7.99'},
          selected: false
        }
      ]
    };

    const options = {
      requestPayerName: true,
      requestPayerPhone: true,
      requestPayerEmail: true,
      requestShipping: true
    };

    const paymentRequest = new PaymentRequest(supportedInstruments, details, options);

    paymentRequest.addEventListener(
      'shippingoptionchange',
      (event) => this.onShippingOptionChange(event, details)
    );

    return paymentRequest;
  }

  onShippingOptionChange(event, previousDetails) {
    const paymentRequest = event.target;
    let shippingOption;
    console.log(`Received a 'shippingoptionchange' event, change to: `,
      paymentRequest.shippingOption);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < previousDetails.shippingOptions.length; i++) {
      shippingOption = previousDetails.shippingOptions[i];
      shippingOption.selected =
        shippingOption.id === paymentRequest.shippingOption;
    }

    let selectedShippingOption;

    if (paymentRequest.shippingOption === 'free') {
      previousDetails.total.amount.value = +previousDetails.total.amount.value - 7.99;
      this.total -= 7.99;
      selectedShippingOption = {
        label: 'Free shipping',
        amount: {currency: 'EUR', value: '0.00'}
      };
    } else if (paymentRequest.shippingOption === 'premium') {
      previousDetails.total.amount.value = +previousDetails.total.amount.value + 7.99;
      this.total += 7.99;
      selectedShippingOption = {
        label: 'Premium shipping',
        amount: {currency: 'EUR', value: '7.99'}
      };
    }

    previousDetails.displayItems.splice(this.products.length, this.paymentBasket.length, selectedShippingOption);
    event.updateWith(previousDetails);
  }

  onBuyClicked(request) {
    if (request.canMakePayment) {
      request.show().then((instrumentResponse) => {
        this.sendPaymentToServer(instrumentResponse);
      })
        .catch((err) => {
          this.paymentBasket = [];
          this.total = 0;
        });
    }
  }

  sendPaymentToServer(instrumentResponse) {
    window.setTimeout(() => {
      instrumentResponse.complete('success')
        .then(() => {
          console.log(instrumentResponse);
          this.addressService.addAddress(instrumentResponse)
            .subscribe(() => this.deliveryModeService.addDeliveryMode()
              .subscribe((() => this.paymentService.setPaymentDetails(instrumentResponse)
                .subscribe(() => this.checkoutService.placeOrder()))));
        })
        .catch((err) => {

        }).finally(() => {

      });
    }, 2000);
  }
}


