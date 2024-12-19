import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightBookingService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<any> {
    return this.http.get(`${this.apiURL}/flights`);
  }

  getBookings(): Observable<any> {
    return this.http.get(`${this.apiURL}/bookings?userID=U1001`);
  }

  getCombinedData(): Observable<any[]> {
    return forkJoin({
      flights: this.getFlights(),
      bookings: this.getBookings(),
    }).pipe(
      map((result) => {
        const { flights, bookings } = result;
        const combined = bookings.map((booking: any) => {
          const flight = flights.find(
            (flight: any) => booking.flightID === flight.id
          );
          return { ...flight, bookings: booking };
        });
        return combined;
      })
    );
  }
}
