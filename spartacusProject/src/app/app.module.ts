import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { translations, translationChunksConfig } from '@spartacus/assets';
import {B2cStorefrontModule, CartComponentModule, ItemCounterModule} from '@spartacus/storefront';
import { CustomCartTotalsComponent } from './components/custom-cart-totals/custom-cart-totals.component';
import {I18nModule, UrlModule} from '@spartacus/core';
import {PaymentRequestService} from './services/paymentRequest.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {CustomAddToCartComponent} from './custom-add-to-cart/custom-add-to-cart.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CustomCartTotalsComponent,
    CustomAddToCartComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 250, // Retains last 250 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    B2cStorefrontModule.withConfig({
      backend: {
        occ: {
          baseUrl: 'https://localhost:9002',
          prefix: '/rest/v2/'
        }
      },
      context: {
        baseSite: ['electronics-spa']
      },
      i18n: {
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en'
      },
      features: {
        level: '1.5',
        anonymousConsents: true
      },
      cmsComponents: {
        CartTotalsComponent: {
          component: CustomCartTotalsComponent
        },
        ProductAddToCartComponent: {
          component: CustomAddToCartComponent
        }
      }
    }),
    CartComponentModule,
    UrlModule,
    I18nModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    ItemCounterModule,
    ReactiveFormsModule,
  ],
  entryComponents: [CustomCartTotalsComponent, CustomAddToCartComponent],
  providers: [PaymentRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
