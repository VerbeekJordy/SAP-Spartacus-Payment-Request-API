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

  constructor(protected checkoutPaymentService: CheckoutPaymentService, protected checkoutDeliveryService: CheckoutDeliveryService, protected checkoutService: CheckoutService,
              protected userPaymentService: UserPaymentService) {
  }

  // setPaymentMethod(paymentDetails: PaymentDetails): void {
  //   this.checkoutPaymentService.setPaymentDetails(paymentDetails);
  // }

  setPaymentDetails(instrumentResponse) {

    console.log(instrumentResponse.cardNumber);
    console.log(instrumentResponse.payerName);
    console.log(instrumentResponse.expiryMonth);
    console.log(instrumentResponse.expiryYear);
    console.log(instrumentResponse.cvn);
    console.log(instrumentResponse.details.expiryYear);
    console.log(instrumentResponse.details.expiryMonth);
    console.log(instrumentResponse.details.cardNumber);
    console.log(instrumentResponse.details.cardSecurityCode);
    console.log(instrumentResponse.details.cvn);
    console.log(instrumentResponse.details.card_cvNumber);

    const countryTest = {
      isocode: 'BE',
      name: 'Belgium'
    } as Country;

    const walda = {
      companyName: 'Hello',
      country: countryTest,
      defaultAddress: true,
      email: 'test',
      firstName: 'test',
      formattedAddress: 'test',
      id: 'test',
      lastName: 'test',
      line1: 'test',
      line2: 'test',
      phone: 'test',
      postalCode: 'test',
      region: null,
      shippingAddress: true,
      title: 'test',
      titleCode: null,
      town: 'test',
      visibleInAddressBook: true
    } as Address;

    const waldi = {
      code: 'master',
      name: 'mastercard'
    } as CardType;

    const waldo = {
      accountHolderName: instrumentResponse.payerName,
      billingAddress: walda,
      cardNumber: instrumentResponse.details.cardNumber,
      cardType: waldi,
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

    const details: PaymentDetails = waldo;
    details.billingAddress = this.deliveryAddress;
    this.checkoutPaymentService.createPaymentDetails(details);
    return this.checkoutPaymentService.getPaymentDetails().pipe(filter(result => result !== undefined && Object.keys(result).length > 0));
  }
}
