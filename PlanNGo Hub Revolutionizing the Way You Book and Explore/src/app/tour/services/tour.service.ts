import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = 'http://localhost:3000/0';
  private url = 'http://localhost:3000/1';
  private urlUser = 'http://localhost:3000/2';
  private urlCompany = 'http://localhost:3000/4';

  constructor(private http: HttpClient) {
  }

  getTours(): Observable<any> {
    return from(fetch(this.apiUrl).then(response => response.json()));
  }

  updateTour( tourData: any): Observable<any> {
    const url = 'http://localhost:3000/0';
    return this.http.put(url, tourData);
  }

  updateBookings(tourId: string, bookings: any): Observable<any> {
    const url = 'http://localhost:3000/1';
    return this.http.put(url, bookings);
  }

  getBookings(): Observable<any> {
    return from(fetch(this.url).then(response => response.json()));
  }

  deleteTour(id: string): Observable<any> {
    const url = 'http://localhost:3000/0';
    return this.http.delete(url);
  }

  getUserBookings(): Observable<any> {
    return from(fetch(this.urlUser).then(response => response.json()));
  }

  addBookingToUser(userId: string, booking: any): Observable<any> {
    const urlUser = 'http://localhost:3000/2';
    return this.http.put(urlUser, booking);
  }

  deleteBooking(bookings: any): Observable<any> {
    const url = 'http://localhost:3000/1';
    return this.http.put(url, bookings);
  }

  deleteUserBooking(userBookings: any): Observable<any> {
    const urlUser = 'http://localhost:3000/2';
    return this.http.put(urlUser, userBookings);
  }

  addTourCompany(companyDetails: any): Observable<any> {
    const url = 'http://localhost:3000/5';
    return this.http.put(url, companyDetails);
  }

  getTourCompanies(): Observable<any> {
    const url = 'http://localhost:3000/5';
    return this.http.get(url);
  }
  DeleteTourCompany(): Observable<any> {
    const url = 'http://localhost:3000/5';
    return this.http.get(url);
  }
  getUsers(): Observable<any> {
    const url = 'http://localhost:3000/3';
    return this.http.get(url);
  }
}


