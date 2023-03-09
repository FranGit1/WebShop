import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { matchValidator } from 'app/auth/form-validators';
import { UserService } from 'app/auth/user.service';
import { CredentialsService } from 'app/credentials.service';
import { Prodcut } from 'app/home-page/product.model';
import { ProductService } from 'app/home-page/product.service';
import { User } from 'app/shared/user.model';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: User[];
  subscriptionUser: Subscription | null = null;
  userSubject: BehaviorSubject<User[]> | null = null;

  newProductForm!: FormGroup;
  error: boolean = false;
  products: Prodcut[] = [];
  subscriptionProduct: Subscription | null = null;
  productSubject: BehaviorSubject<Prodcut[]> | null = null;
  constructor(
    private router: Router,
    private userService: UserService,
    private credService: CredentialsService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.userService.fetchUsers();
    this.userSubject = this.userService.getUsers();
    this.subscriptionUser = this.userSubject.subscribe((res) => {
      this.users = res;
      console.log(this.users);
    });

    this.productSubject = this.productService.getProducts();
    this.subscriptionProduct = this.productSubject.subscribe((res) => {
      this.products = res;
    });

    this.newProductForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      price: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
    });
  }
  changeLevel(u: User) {
    let newRole = u.role == 2 ? 1 : 2;
    let newUser = { ...u };
    newUser.role = newRole;
    this.credService
      .updateLevel(newUser)
      .subscribe((res: { status: string; changedRows: number }) => {
        if (res.status == 'OK') {
          u.role = newRole;
        }
      });
  }

  deleteUser(u: User) {
    console.log(u.id);

    this.userService.deleteUser(u.id);
  }

  onAddProduct() {
    const product: Prodcut = {
      title: this.newProductForm.get('title')?.value,
      price: this.newProductForm.get('price')?.value,
      category: this.newProductForm.get('category')?.value,
      description: this.newProductForm.get('description')?.value,
      image: this.newProductForm.get('image')?.value,
      id: this.products[this.products.length - 1].id + 1,
    };

    this.productService.addNewProduct(product);
    this.newProductForm.reset();
  }

  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
    this.subscriptionProduct?.unsubscribe();
  }
}
