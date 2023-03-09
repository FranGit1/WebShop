import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditService } from 'app/edit-page/edit.service';
import { AuthService } from 'app/shared/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Prodcut } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.css'],
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: Prodcut | undefined;
  @Output()
  addToCart = new EventEmitter();
  @Output()
  addToFavorites = new EventEmitter();

  constructor(
    private auth: AuthService,
    private productService: ProductService,
    private editService: EditService
  ) {}

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onAddToFavorites(): void {
    this.addToFavorites.emit(this.product);
  }

  checkAuthority(): boolean {
    return this.auth?.getUser()?.role == 2 ? true : false;
  }

  onRemoveProduct(): void {
    this.productService.removeProduct(this.product.id);
  }

  onEditProduct(): void {
    this.editService.addEditingProduct(this.product);
  }
}
