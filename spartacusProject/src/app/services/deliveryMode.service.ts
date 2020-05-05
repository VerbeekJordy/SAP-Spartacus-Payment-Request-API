import {Injectable} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {CheckoutDeliveryService, DeliveryMode, RoutingService} from '@spartacus/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckoutConfigService} from '@spartacus/storefront';
import {ActivatedRoute} from '@angular/router';
import {map, withLatestFrom} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DeliveryModeService {
  supportedDeliveryModes$: Observable<DeliveryMode[]>;
  currentDeliveryModeId: string;

  constructor(private fb: FormBuilder, private checkoutDeliveryService: CheckoutDeliveryService) {
  }

  initialize() {
    const test = [];
    this.supportedDeliveryModes$ = this.checkoutDeliveryService.getSupportedDeliveryModes();
    this.supportedDeliveryModes$.forEach((t) => t.forEach((a) => console.log(a)));
    this.supportedDeliveryModes$.forEach((t) => t.forEach((a) => test.push(a.code))); ///////////////////////////
    console.log(test);
    this.currentDeliveryModeId = 'standard-gross';
    console.log(this.currentDeliveryModeId);
    console.log('test');
    this.checkoutDeliveryService.setDeliveryMode(this.currentDeliveryModeId);
  }
}
