import {
  Address,
  CheckoutDeliveryService,
  CheckoutPaymentService,
  CheckoutService,
  Country,
  PaymentDetails,
  UserPaymentService
} from '@spartacus/core';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {CardType} from '@spartacus/core/src/model/cart.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaymentService {

  protected shouldRedirect: boolean;
  protected deliveryAddress: Address;

  constructor(protected checkoutPaymentService: CheckoutPaymentService, protected checkoutDeliveryService: CheckoutDeliveryService,
              protected checkoutService: CheckoutService, protected userPaymentService: UserPaymentService) {
  }

  setPaymentDetails(instrumentResponse) {
    const type = {
      code: 'master',
      name: 'mastercard'
    } as CardType;

    const paymentDetails = {
      accountHolderName: instrumentResponse.payerName,
      billingAddress: null,
      cardNumber: instrumentResponse.details.cardNumber,
      cardType: type,
      cvn: instrumentResponse.details.cardSecurityCode,
      defaultPayment: true,
      expiryMonth: instrumentResponse.details.expiryMonth,
      expiryYear: instrumentResponse.details.expiryYear,
      id: null,
      issueNumber: null,
      saved: true,
      startMonth: null,
      startYear: null,
      subscriptionId: null
    } as PaymentDetails;

    this.checkoutDeliveryService
      .getDeliveryAddress()
      .pipe(take(1))
      .subscribe((address: Address) => {
        this.deliveryAddress = address;
      });

    const details: PaymentDetails = paymentDetails;
    details.billingAddress = this.deliveryAddress;
    this.checkoutPaymentService.createPaymentDetails(details);
    return this.checkoutPaymentService.getPaymentDetails().pipe(filter(result => result !== undefined && Object.keys(result).length > 0));
  }
}
