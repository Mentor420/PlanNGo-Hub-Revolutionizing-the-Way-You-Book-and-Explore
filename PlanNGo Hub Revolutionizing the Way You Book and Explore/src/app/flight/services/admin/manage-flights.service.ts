import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageFlightsService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<any> {
    return this.http.get(`${this.apiURL}/flights`);
  }

  getAllBooking(): Observable<any> {
    return this.http.get(`${this.apiURL}/bookings`);
  }

  getSpecificbooking(id:String): Observable<any> {
    return this.http.get(`${this.apiURL}/bookings?flightID=${id}`);
  }
}
