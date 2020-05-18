import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-custom-product-list-item',
  templateUrl: './custom-product-list-item.component.html'
})
export class CustomProductListItemComponent {
  @Input() product: any;
}
