import { Injectable } from '@angular/core';
import { Prodcut } from 'app/home-page/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditService {
  product: Prodcut = new Prodcut();
  editingProduct = new BehaviorSubject(this.product);

  addEditingProduct(product: Prodcut) {
    this.editingProduct.next(product);
  }

  getEditingProduct() {
    return this.editingProduct.value;
  }
  constructor() {}
}
