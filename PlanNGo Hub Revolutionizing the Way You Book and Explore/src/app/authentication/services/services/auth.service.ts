import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RegisterPostData, User } from '../../models/interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  registerUser(postData: RegisterPostData) {
    return this.http.post(`${this.baseUrl}/users`, postData);
  }

  getUserDetails(email: string, password: string): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users?email=${email}&password=${password}`)
      .pipe(
        map((users) =>
          users.map((user) => ({
            ...user,
            serviceType: user.serviceType ?? null, 
          }))
        ),
        catchError((error) => {
          console.error('Login failed:', error);
          throw new Error('Failed to fetch user details');
        })
      );
  }

  // Check if an email is unique
  isEmailUnique(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`).pipe(
      map((users) => users.length === 0)
    );
  }

  getUser(): Observable<User> {
    const userId = sessionStorage.getItem('userId'); 
    console.log(userId)
    if (!userId) {
      throw new Error('User is not logged in.');
    }
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`).pipe(
      catchError((error) => {
        console.error('Failed to fetch user details:', error);
        throw new Error('User not found.');
      })
    );
  }

 
  updateUserDetails(id: number, updatedProfile: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, updatedProfile).pipe(
      catchError((error) => {
        console.error('Failed to update user details:', error);
        throw new Error('Failed to update user.');
      })
    );
  }

  updateUser(updatedProfile: User): void {
    sessionStorage.setItem('user', JSON.stringify(updatedProfile));
  }

  logout(): void {
    sessionStorage.clear(); 
  }
}
