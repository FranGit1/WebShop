import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { Prodcut } from './home-page/product.model';
import { User } from './shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiRoot = environment.API_URL + '/api/products';
  apiCategories = environment.API_URL + '/api/categories';
  apiOrders = environment.API_URL + '/api/orders';
  apiFavorites = environment.API_URL + '/api/favorites';
  apiFavorite = environment.API_URL + '/api/favorite';
  constructor(private http: HttpClient) {}

  getAccessBrowsing(): { headers } {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      }),
    };
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      'browsing-token'
    );

    return httpOptions;
  }

  getProducts() {
    console.log(this.getAccessBrowsing());
    return this.http.get(this.apiRoot, this.getAccessBrowsing()).pipe(
      map((res: any) => {
        return res.product;
      })
    );
  }

  getProductsByCategory(category: string) {
    return this.http
      .get(this.apiRoot + `/${category}`, this.getAccessBrowsing())
      .pipe(
        map((res: any) => {
          return res.affectedRows;
        })
      );
  }

  getAllCategories() {
    return this.http.get(this.apiCategories, this.getAccessBrowsing()).pipe(
      map((res: any) => {
        console.log(res.product);
        return res;
      })
    );
  }

  placeOrder(order) {
    return this.http.post(this.apiOrders, order, this.getAccessBrowsing());
  }

  getOrdersForUser(userId: string) {
    return this.http
      .get(this.apiOrders + `/${userId}`, this.getAccessBrowsing())
      .pipe(
        map((res: any) => {
          return res.product;
        })
      );
  }

  getFavouritesByUser(userId: string) {
    return this.http.get(this.apiFavorites + `/${userId}`).pipe(
      map((res: any) => {
        return res.product;
      })
    );
  }

  addFavorite(product) {
    return this.http.post(this.apiFavorites, product);
  }

  add$Favorite(userId: string, productId) {
    return this.http.post(this.apiFavorite, { userId, productId });
  }
  addProduct(product: Prodcut) {
    return this.http.post(this.apiRoot, product);
  }

  removeProduct(productId: number) {
    return this.http.delete(this.apiRoot + `/${productId}`);
  }

  editProduct(product: Prodcut) {
    return this.http.put(this.apiRoot, product);
  }
}
