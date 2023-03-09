import { Injectable } from '@angular/core';
import { DataService } from 'app/data.service';
import { BehaviorSubject } from 'rxjs';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  orders: Order[] = [];
  orderSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  constructor(private dataService: DataService) {}

  getOrdersForUser(userId: string) {
    this.dataService.getOrdersForUser(userId).subscribe((res) => {
      this.orders = res;

      this.orderSubject.next([...this.orders]);
    });
  }

  getOrders() {
    return this.orderSubject;
  }
}
