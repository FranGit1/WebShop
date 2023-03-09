import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from './cart-page/cart.model';
import { CartService } from './cart.service';
import { AuthService } from './shared/auth.service';
import { User } from './shared/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'webshop';
  constructor(
    private auth: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}
  cart: Cart = { items: [] };

  ngOnInit() {
    this.cartService.cart.subscribe((_cart) => (this.cart = _cart));

    this.auth.whoAmI().subscribe(
      (response: { status: number; user?: User }) => {
        if (response.status == 200) {
          console.log(response);
        } else {
          this.router.navigate(['']);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
