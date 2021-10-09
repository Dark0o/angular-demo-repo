import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users = [];
  url =
    'https://todo-app-2e14b-default-rtdb.europe-west1.firebasedatabase.app/users.json';

  constructor(private http: HttpClient) {}

  getSignedUpUsers(): Observable<any> {
    if (this.users.length > 0) {
      console.log(this.users);
      return of(this.users);
    }
    return this.http.get(this.url).pipe(
      map((data) => {
        console.log(data);
        for (const key in data) {
          this.users.push({ ...data[key], id: key });
        }
        console.log(this.users);

        return this.users;
      })
    );
  }

  addUser(user): Observable<any> {
    if (this.users.length > 0) {
      if (this.userExists(user.username, user.password)) {
        alert('User already exists, please Log In');
        return;
      }
    }
    return this.http.post(this.url, user);
  }

  userExists(username: string, password: string) {
    console.log(this.users);

    let existingUser = this.users.filter(
      (u) => u.username === username && u.password === password
    );
    if (existingUser.length === 1) {
      console.log(existingUser[0].id);

      localStorage.setItem('userID', existingUser[0].id);
      return true;
    }
    return false;
  }
}
