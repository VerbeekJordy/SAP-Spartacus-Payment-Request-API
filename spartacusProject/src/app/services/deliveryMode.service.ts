import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CheckoutDeliveryService, DeliveryMode, LoaderState} from '@spartacus/core';
import {delay, filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DeliveryModeService {
  supportedDeliveryModes$: Observable<DeliveryMode[]>;
  currentDeliveryModeId: string;

  constructor(private checkoutDeliveryService: CheckoutDeliveryService) {
  }

  initialize(): Observable<LoaderState<void>> {
    this.supportedDeliveryModes$ = this.checkoutDeliveryService.getSupportedDeliveryModes();
    console.log(this.supportedDeliveryModes$);
    this.currentDeliveryModeId = 'standard-gross';
    this.checkoutDeliveryService.setDeliveryMode(this.currentDeliveryModeId);
    this.checkoutDeliveryService.getSetDeliveryModeProcess().subscribe(result => console.log(result));
    return this.checkoutDeliveryService.getSetDeliveryModeProcess().pipe(filter(result => result.value !== undefined
      && result.success === true
      && result.loading === false
      && result.error === false));
  }
}
