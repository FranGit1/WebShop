import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'app/cart.service';
import { AuthService } from 'app/shared/auth.service';
import { elementAt } from 'rxjs';
import { Cart, CartItem } from '../cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private router: Router,
    private auth: AuthService
  ) {}
  cart: Cart = {
    items: [],
  };

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<String> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onIncreaseQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onDecreaseQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onProceed() {
    if (this.auth.getUser()) {
      let orders = [];
      let today: any = new Date();
      const date = new Date().toJSON().slice(0, 10);
      console.log(date);

      this.dataSource.forEach((order) => {
        orders.push({
          id: order.id,
          title: order.name,
          price: order.price,
          image: order.product,
          quantity: order.quantity,
          userId: localStorage.getItem('userId'),
          date: date,
        });
      });

      this.cartService.placeOrder(orders);
      this.cartService.clearCart();
    } else {
      this.router.navigate(['/login']);
    }
  }
}
