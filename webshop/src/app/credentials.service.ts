import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs';
import { User } from './shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  apiUsers = environment.API_URL + '/api/users';

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

  getUsers() {
    return this.http.get(this.apiUsers).pipe(
      map((res: any) => {
        console.log(res);
        return res.users;
      })
    );
  }

  updateLevel(u: User) {
    console.log(u);
    return this.http.put(this.apiUsers, u);
  }

  deleteUser(id: string) {
    return this.http.delete(this.apiUsers + `/${id}`, this.getAccessBrowsing());
  }

  addUser(user: User) {
    return this.http.post(this.apiUsers, user, this.getAccessBrowsing());
  }
}
