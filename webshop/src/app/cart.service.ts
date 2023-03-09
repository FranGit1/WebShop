import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from './cart-page/cart.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });
  constructor(
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) {}

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((item_) => item_.id === item.id);

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this.snackBar.open('1 item added to cart', 'Ok', { duration: 3000 });
    console.log(this.cart.value);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this.snackBar.open('Cart is cleared', 'Ok', { duration: 3000 });
  }

  removeFromCart(item: CartItem, notifyUser = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );
    if (notifyUser) {
      this.cart.next({ items: filteredItems });
      this.snackBar.open('Item removed from cart', 'Ok', { duration: 3000 });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    let itemToRemove: CartItem | undefined;
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity -= 1;

        if (_item.quantity === 0) {
          itemToRemove = _item;
        }
      }
      return _item;
    });

    if (itemToRemove) {
      filteredItems = this.removeFromCart(itemToRemove, false);
    }
    this.cart.next({ items: filteredItems });
    this.snackBar.open('1 Item removed from cart', 'Ok', { duration: 3000 });
  }

  placeOrder(orders) {
    console.log(orders);
    orders.forEach((order) =>
      this.dataService.placeOrder(order).subscribe((res) => console.log(res))
    );
  }
}
