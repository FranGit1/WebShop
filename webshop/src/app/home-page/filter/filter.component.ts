import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Prodcut } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Output() showCategory = new EventEmitter<string>();
  products: Prodcut[] = [];
  subscription: Subscription | null = null;
  productSubject: BehaviorSubject<Prodcut[]> | null = null;
  categoriesSubscription: Subscription | null = null;
  categoriesSubject: BehaviorSubject<Prodcut[]> | null = null;
  categories: string[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productSubject = this.productService.getProducts();
    this.subscription = this.productSubject.subscribe((res) => {
      this.products = res;
    });

    this.categoriesSubject = this.productService.getAllCategories();
    this.categoriesSubscription = this.categoriesSubject.subscribe((res) => {
      res.forEach((ele) => this.categories.push(ele.category));
    });
    this.categories.push('Show all');
  }

  onShowCategory(category: string): void {
    console.log(category);
    this.showCategory.emit(category);
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }
}
