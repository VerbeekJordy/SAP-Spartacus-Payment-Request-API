import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-custom-product-list-item',
  templateUrl: './custom-product-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomProductListItemComponent {
  @Input() product: any;
}
