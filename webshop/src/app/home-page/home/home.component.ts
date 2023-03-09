import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'app/cart.service';
import { AuthService } from 'app/shared/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Prodcut } from '../product.model';
import { ProductService } from '../product.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  order = 'price';
  ascending = false;
  products: Prodcut[] = [];
  subscription: Subscription | null = null;
  productSubject: BehaviorSubject<Prodcut[]> | null = null;
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productSubject = this.productService.getProducts();
    this.subscription = this.productSubject.subscribe((res) => {
      this.products = res;
    });
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    if (newCategory == 'Show all') {
      this.productService.getAllProducts();
      this.productSubject = this.productService.getProducts();
      this.subscription = this.productSubject.subscribe((res) => {
        this.products = res;
      });
    } else {
      this.category = newCategory;
      this.productService.getProductsByCategory(newCategory);
      this.productSubject = this.productService.getProducts();
      this.subscription = this.productSubject.subscribe((res) => {
        this.products = res;
      });
    }
  }

  onAddToCart(product: Prodcut): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onAddToFavorites(product): void {
    console.log('clicked');
    if (!this.auth.getUser()) {
      this.router.navigate(['/login']);
    } else {
      this.productService.addFavourite({
        ...product,
        userId: localStorage.getItem('userId'),
      });
    }
  }

  onSortChange(sortDirection: boolean): void {
    this.ascending = sortDirection;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
