import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prodcut } from 'app/home-page/product.model';
import { AuthService } from 'app/shared/auth.service';
import { User } from 'app/shared/user.model';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Order } from '../order.model';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css'],
})
export class ProfileDetailComponent implements OnInit {
  name: any;
  user: User | null = null;
  orders: Order[] = [];
  subscription: Subscription | null = null;
  orderSubject: BehaviorSubject<Order[]> | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    this.name = this.route.snapshot.params['username'];
    this.user = this.auth.getUser();
    this.orderService.getOrdersForUser(localStorage.getItem('userId'));
    this.orderSubject = this.orderService.getOrders();
    this.subscription = this.orderSubject.subscribe((res) => {
      this.orders = res;
    });
  }

  displayedColumns: Array<String> = [
    'image',
    'title',
    'price',
    'quantity',
    'date',
  ];

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
