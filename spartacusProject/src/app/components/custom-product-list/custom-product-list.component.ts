import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ProductSearchPage} from '@spartacus/core';
import {PageLayoutService, ProductListComponentService, ViewConfig, ViewModes} from '@spartacus/storefront';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-custom-product-list',
  templateUrl: './custom-product-list.component.html'
})

export class CustomProductListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  isInfiniteScroll: boolean;

  model$: Observable<ProductSearchPage> = this.productListComponentService
    .model$;

  viewMode$ = new BehaviorSubject<ViewModes>(ViewModes.Grid);
  ViewModes = ViewModes;

  constructor(
    pageLayoutService: PageLayoutService,
    productListComponentService: ProductListComponentService,
    // tslint:disable-next-line: unified-signatures
    scrollConfig: ViewConfig
  );

  /**
   * @deprecated since version 1.x
   *  Use constructor(pageLayoutService: PageLayoutService,
   *  productListComponentService: ProductListComponentService,
   *  ref: ChangeDetectorRef,
   *  scrollConfig: ViewConfig) instead
   */
  constructor(
    pageLayoutService: PageLayoutService,
    productListComponentService: ProductListComponentService
  );
  constructor(
    private pageLayoutService: PageLayoutService,
    private productListComponentService: ProductListComponentService,
    public scrollConfig?: ViewConfig
  ) {}

  ngOnInit(): void {
    this.isInfiniteScroll = this.scrollConfig.view.infiniteScroll.active;

    this.productListComponentService.clearSearchResults();

    this.subscription.add(
      this.pageLayoutService.templateName$.pipe(take(1)).subscribe(template => {
        this.viewMode$.next(
          template === 'ProductGridPageTemplate'
            ? ViewModes.Grid
            : ViewModes.List
        );
      })
    );
  }

  viewPage(pageNumber: number): void {
    this.productListComponentService.viewPage(pageNumber);
  }

  sortList(sortCode: string): void {
    this.productListComponentService.sort(sortCode);
  }

  setViewMode(mode: string): void {
    const modeChange = new EventEmitter<string>();
    modeChange.emit(mode);
    // this.viewMode$.next(mode);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
