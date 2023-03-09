import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'app/cart-page/cart.model';
import { CartService } from 'app/cart.service';
import { Prodcut } from 'app/home-page/product.model';
import { ProductService } from 'app/home-page/product.service';
import { AuthService } from 'app/shared/auth.service';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})
export class FavoriteComponent implements OnInit {
  products: any[] = [];
  subscription: Subscription | null = null;
  productSubject: BehaviorSubject<any[]> | null = null;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private auth: AuthService
  ) {}

  displayedColumns: Array<String> = [
    'image',
    'title',
    'price',
    'description',
    'action',
  ];

  refreshFavoriteProducts(): void {
    this.productService.getFavouritesByUser(localStorage.getItem('userId'));
    this.productSubject = this.productService.getFavorites();
    this.subscription = this.productSubject.subscribe((res) => {
      this.products = res;
    });
  }

  ngOnInit(): void {
    this.refreshFavoriteProducts();
  }

  removeFromFavorites(product): void {
    this.productService.removeFavorite(product.userId, product.id);
    this.refreshFavoriteProducts();
  }

  addToCart(product): void {
    const cartProduct: CartItem = {
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    };
    this.cartService.addToCart(cartProduct);
    this.productService.removeFavorite(product.userId, product.id);
    this.router.navigate(['/cart']);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
