import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CredentialsService } from '../credentials.service';
import { User } from '../shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [];
  userSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(
    private credentialsService: CredentialsService,
    private router: Router
  ) {}

  fetchUsers() {
    this.credentialsService.getUsers().subscribe((res) => {
      this.users = res;
      this.userSubject.next([...this.users]);
    });
  }
  getUsers() {
    console.log(this.userSubject);

    return this.userSubject;
  }

  addUser(user: User) {
    this.credentialsService.addUser(user).subscribe((res) => {
      this.users.push(user);
      this.userSubject.next([...this.users]);
    });
    this.router.navigate(['login']);
  }

  deleteUser(id: string) {
    this.credentialsService.deleteUser(id).subscribe((res) => {
      this.users = this.users.filter((u) => u.id != id);
      this.userSubject.next([...this.users]);
    });
  }
}
