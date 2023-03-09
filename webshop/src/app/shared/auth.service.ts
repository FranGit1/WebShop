import { EventEmitter, Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private user: User;
  private token: string;
  errorEmitter: Subject<string> = new Subject<string>();
  authChange: Subject<boolean> = new Subject<boolean>();
  authUrl: string = environment.API_URL + '/authenticate';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    this.http
      .post(this.authUrl, credentials)
      .subscribe(
        (res: {
          status: number;
          description: string;
          user?: User;
          token?: string;
        }) => {
          //console.log(res);
          if (res.status == 200) {
            this.user = res.user;
            this.token = res.token;

            localStorage.setItem('token', this.token);
            localStorage.setItem('userId', res.user.id);
            // localStorage.setItem('role', res.user.role.toString());

            this.authChange.next(true);
            this.router.navigate(['/']);
          } else {
            this.errorEmitter.next(res.description);
          }
        }
      );
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // localStorage.removeItem('role');

    this.authChange.next(false);
    this.router.navigate(['login']);
  }

  getUser() {
    if (this.user) return { ...this.user };
    else return null;
  }

  getToken() {
    if (this.token) return this.token;
    else {
      if (localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
        return this.token;
      }
    }
  }

  isAuthenticated() {
    return this.user != null;
  }

  whoAmI() {
    if (this.getToken()) {
      return this.http.get(environment.API_URL + '/api/me').pipe(
        map((response: { status: number; user?: User }) => {
          if (response.status == 200) {
            this.user = response.user;
            this.authChange.next(true);
          }
          return response;
        })
      );
    } else {
      return new Observable((observer) => {
        observer.next({ status: 100 });
      });
    }
  }
}
