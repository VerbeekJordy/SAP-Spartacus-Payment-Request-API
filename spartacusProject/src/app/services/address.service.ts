import {Injectable} from '@angular/core';
import {
  Address,
  CheckoutDeliveryService, Country, LoaderState,
} from '@spartacus/core';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AddressService {

  constructor(
    protected checkoutDeliveryService: CheckoutDeliveryService,
  ) {
  }

  addAddress(): Observable<LoaderState<void>> {
    const countryTest = {
      isocode: 'BE',
      name: 'Belgium'
    } as Country;

    const waldo = {
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

    this.checkoutDeliveryService.createAndSetAddress(waldo);
    return this.checkoutDeliveryService.getSetDeliveryAddressProcess().pipe(filter(result => result.value !== undefined));
  }
}
