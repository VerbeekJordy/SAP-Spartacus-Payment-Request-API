export class CustomeProductBasket {
  name: string;
  totalPrice: number;
  quantity: number;

  constructor(name: string, totalPrice: number, quantity: number) {
    this.name = name;
    this.totalPrice = totalPrice;
    this.quantity = quantity;
  }
}
