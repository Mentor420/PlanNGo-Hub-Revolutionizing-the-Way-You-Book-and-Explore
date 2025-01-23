import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageFlightsService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<any> {
    return this.http.get(`${this.apiURL}/flights`);
  }

  getSpecificFlights(id:any): Observable<any> {
    return this.http.get<any[]>(`${this.apiURL}/flights/${id}`)
  }

  getAllBooking(): Observable<any> {
    return this.http.get(`${this.apiURL}/bookings`);
  }

  getSpecificbooking(id:String): Observable<any> {
    return this.http.get(`${this.apiURL}/bookings?flightID=${id}`);
  }

  getFlightById(flightId: string): Observable<any> {
    return this.http.get(`${this.apiURL}/flights/${flightId}`);
  }

  // Update flight's isActive status
  updateFlightStatus(flightId: string, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.apiURL}/flights/${flightId}`, { isActive });
  }

  // Get bookings for a flight
  getBookingsByFlightId(flightId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/bookings?flightID=${flightId}`);
  }

  // Update booking status
  updateBookingStatus(bookingId: string, bookingStatus: string): Observable<any> {
    return this.http.patch(`${this.apiURL}/bookings/${bookingId}`, { bookingStatus });
  }

  // Cancel bookings and deactivate flight
  cancelFlightAndBookings(flightId: string): Observable<any> {
    return this.getFlightById(flightId).pipe(
      switchMap((flight) => {
        if (flight.isActive) {
          // Update flight's isActive to false
          return this.updateFlightStatus(flightId, false).pipe(
            switchMap(() => {
              // Fetch bookings for the given flight
              return this.getBookingsByFlightId(flightId).pipe(
                switchMap((bookings) => {
                  if (bookings.length === 0) {
                    throw new Error('No bookings found for this flight.');
                  }

                  // Update the status of all bookings
                  const updates = bookings.map((booking) =>
                    this.updateBookingStatus(booking.id, 'Cancelled')
                  );
                  return forkJoin(updates);
                })
              );
            })
          );
        } else {
          throw new Error('Flight is already inactive.');
        }
      })
    );
  }
}