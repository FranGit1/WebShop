import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'app/cart-page/cart.model';
import { CartService } from 'app/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  authenticated = false;
  authChangeSubscription: Subscription | null = null;
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;
  constructor(
    private router: Router,
    private auth: AuthService,
    private cartService: CartService
  ) {}

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  ngOnInit(): void {
    this.authenticated = this.auth.isAuthenticated();

    this.authChangeSubscription = this.auth.authChange.subscribe((res) => {
      this.authenticated = this.auth.isAuthenticated();
    });
    console.log('authent', this.authenticated);
  }

  getUser() {
    return this.auth.getUser();
  }

  getClass(a: string) {
    return this.router.url == a ? 'active' : '';
  }

  logout() {
    this.auth.logout();
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }
  clearCart() {
    this.cartService.clearCart();
  }

  checkLocal(): boolean {
    return this.auth.getUser().role == 2 ? true : false;
  }

  ngOnDestroy() {
    if (this.authChangeSubscription) this.authChangeSubscription.unsubscribe();
  }
}
