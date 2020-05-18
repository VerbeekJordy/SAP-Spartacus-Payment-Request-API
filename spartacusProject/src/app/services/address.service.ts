import {Injectable} from '@angular/core';
import {
  Address,
  CheckoutDeliveryService, Country, LoaderState,
} from '@spartacus/core';
import {Observable} from 'rxjs';
import {delay, filter} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AddressService {

  constructor(protected checkoutDeliveryService: CheckoutDeliveryService) {
  }

  addAddress(instrumentResponse): Observable<LoaderState<void>> {
    const countryIso = {
      isocode: instrumentResponse.shippingAddress.country,
      name: null
    } as Country;

    const address = {
      companyName: null,
      country: countryIso,
      defaultAddress: true,
      email: instrumentResponse.payerEmail,
      firstName: instrumentResponse.payerName.split(' ')[0],
      formattedAddress: null,
      id: 'Address',
      lastName: instrumentResponse.payerName.split(' ')[1],
      line1: instrumentResponse.shippingAddress.addressLine[0] + ' ' + instrumentResponse.shippingAddress.addressLine[1],
      phone: instrumentResponse.payerPhone,
      postalCode: instrumentResponse.shippingAddress.postalCode,
      region: null,
      shippingAddress: true,
      title: 'Address',
      titleCode: null,
      town: instrumentResponse.shippingAddress.city,
      visibleInAddressBook: false
    } as Address;

    this.checkoutDeliveryService.createAndSetAddress(address);
    return this.checkoutDeliveryService.getSetDeliveryAddressProcess().pipe(filter(result => result.value !== undefined), delay(1500));
  }
}
