export class Cart {
  items: Array<CartItem>;
}

export class CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  id: number;
}
