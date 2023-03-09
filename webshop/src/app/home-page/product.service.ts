import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'app/data.service';
import { BehaviorSubject } from 'rxjs';
import { Prodcut } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: Prodcut[] = [];
  productSubject: BehaviorSubject<Prodcut[]> = new BehaviorSubject<Prodcut[]>(
    []
  );
  categories: Prodcut[] = [];
  categoriesSubject: BehaviorSubject<Prodcut[]> = new BehaviorSubject<
    Prodcut[]
  >([]);

  favorites: any[] = [];
  favoritesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private dataService: DataService, private snackBar: MatSnackBar) {
    this.init();
  }

  init() {
    this.dataService.getProducts().subscribe((res) => {
      this.products = res;

      this.productSubject.next([...this.products]);
    });

    this.dataService.getAllCategories().subscribe((res) => {
      this.categories = res.product;
      this.categoriesSubject.next([...this.categories]);
    });
  }

  getProducts() {
    return this.productSubject;
  }

  getProductsByCategory(category: string) {
    this.dataService.getProductsByCategory(category).subscribe((res) => {
      this.products = res;
      this.productSubject.next([...this.products]);
    });
  }

  getFavouritesByUser(userId: string) {
    this.dataService.getFavouritesByUser(userId).subscribe((res) => {
      this.favorites = res;
      this.favoritesSubject.next([...this.favorites]);
    });
  }

  getFavorites() {
    return this.favoritesSubject;
  }

  addFavourite(product) {
    this.dataService.addFavorite(product).subscribe((res) => {
      this.favorites.push(product);
      this.favoritesSubject.next([...this.favorites]);
    });
    this.snackBar.open('Item added to favorites', 'Ok', { duration: 3000 });
  }

  addNewProduct(product: Prodcut) {
    this.dataService.addProduct(product).subscribe((res) => {
      this.products.push(product);
      this.productSubject.next([...this.products]);
    });
    this.snackBar.open('New product added', 'Ok', { duration: 3000 });
  }

  getAllCategories() {
    return this.categoriesSubject;
  }

  getAllProducts() {
    this.dataService.getProducts().subscribe((res) => {
      this.products = res;

      this.productSubject.next([...this.products]);
    });
  }

  removeFavorite(userId: string, productId) {
    this.dataService.add$Favorite(userId, productId).subscribe((res) => {
      this.favorites = this.favorites.filter((p) => p.id != productId);
      this.favoritesSubject.next([...this.favorites]);
    });
  }

  removeProduct(productId: number) {
    this.dataService.removeProduct(productId).subscribe((res) => {
      this.products = this.products.filter((p) => p.id != productId);
      this.productSubject.next([...this.products]);
    });
  }

  editProduct(product: Prodcut) {
    this.dataService.editProduct(product).subscribe(
      (res) => {
        this.products[this.products.findIndex((p) => p.id == product.id)] =
          product;
        this.productSubject.next(this.products);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
