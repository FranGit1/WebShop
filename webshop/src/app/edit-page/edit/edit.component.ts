import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Prodcut } from 'app/home-page/product.model';
import { ProductService } from 'app/home-page/product.service';
import { EditService } from '../edit.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  editingProduct: Prodcut | null;
  editProductForm!: FormGroup;

  constructor(
    private editService: EditService,
    private productService: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.editingProduct = this.editService.getEditingProduct();

    this.editProductForm = new FormGroup({
      title: new FormControl(this.editingProduct.title, [
        Validators.required,
        Validators.minLength(2),
      ]),
      price: new FormControl(this.editingProduct.price, [Validators.required]),
      category: new FormControl(this.editingProduct.category, [
        Validators.required,
      ]),
      description: new FormControl(this.editingProduct.description, [
        Validators.required,
      ]),
      image: new FormControl(this.editingProduct.image, [Validators.required]),
    });
  }

  onDoneEditing() {
    const product: Prodcut = {
      title: this.editProductForm.get('title')?.value,
      price: this.editProductForm.get('price')?.value,
      category: this.editProductForm.get('category')?.value,
      description: this.editProductForm.get('description')?.value,
      image: this.editProductForm.get('image')?.value,
      id: this.editingProduct.id,
    };

    this.productService.editProduct(product);
    this.router.navigate(['/']);
  }
}
