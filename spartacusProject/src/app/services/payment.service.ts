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

  setPaymentDetails() {
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
      accountHolderName: 'jordy',
      billingAddress: walda,
      cardNumber: '5364960805359328',
      cardType: waldi,
      cvn: '578',
      defaultPayment: true,
      expiryMonth: '05',
      expiryYear: '2024',
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
    // this.checkoutPaymentService.paymentProcessSuccess();
    // console.log(this.checkoutPaymentService.paymentProcessSuccess());
    // this.checkoutPaymentService.getSetPaymentDetailsResultProcess().subscribe((result) => console.log(result));
    // this.checkoutPaymentService.getCardTypes().subscribe((result) => console.log(result.values().next()))
    // console.log(this.checkoutPaymentService.loadSupportedCardTypes());
    // this.checkoutService.getCheckoutDetailsLoaded().forEach((result) => console.log(result.valueOf()));
    // tslint:disable-next-line:max-line-length
    // return this.checkoutPaymentService.getSetPaymentDetailsResultProcess().pipe(tap(result => console.log(result, 'PAYMENTPROCES')), filter(result => result.success === true));
  }
}
