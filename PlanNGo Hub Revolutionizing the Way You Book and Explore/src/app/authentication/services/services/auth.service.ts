import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  // Register a new user
  registerUser(postData: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, postData);
  }

  // Get user details by email and password
  getUserDetails(email: string, password: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users?email=${email}&password=${password}`);
  }

  // Get user by email (for fetching user details)
  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }

  // Fetch current user from sessionStorage or API
  getUser(): User | null {
    const email = sessionStorage.getItem('email');
    if (email && !this.currentUserSubject.value) {
      this.getUserByEmail(email).subscribe((response) => {
        if (response.length > 0) {
          const user = response[0];
          this.currentUserSubject.next(user);
          sessionStorage.setItem('user', JSON.stringify(user));  // Save user in sessionStorage
        }
      });
    }
    return this.currentUserSubject.value || JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  // Update user details by user ID
  updateUserDetails(userId: number, updatedData: Partial<User>): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${userId}`, updatedData);
  }

  // Update the current user session data
  updateUser(updatedUser: User): void {
    this.currentUserSubject.next(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser)); // Store updated user in sessionStorage
  }
}
