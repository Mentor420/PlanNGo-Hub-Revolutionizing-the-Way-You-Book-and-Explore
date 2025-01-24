import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Provider, Hotel, Booking } from '../models/interfaces'; // Adjust the path if necessary

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderService {
  private apiUrl = 'http://localhost:3000'; // Base URL of your mock JSON server

  constructor(private http: HttpClient) {}

  // Fetch providers
  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`);
  }

  // Fetch provider by ID
  getProviderDetails(providerId: string): Observable<Provider | null> {
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`).pipe(
      map((providers) => providers.find((provider) => provider.provider_id === providerId) || null)
    );
  }

  // Fetch hotels by provider ID
  getHotelsByProvider(providerId: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels`).pipe(
      map((hotels) => hotels.filter((hotel) => hotel.provider_id === providerId))
    );
  }

  // Fetch specific hotel details by provider ID and hotel ID
  getHotelDetailsByProviderId(providerId: string, hotelId: string): Observable<Hotel | undefined> {
    // Fetch all providers and hotels
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`).pipe(
      switchMap((providers) => 
        this.http.get<Hotel[]>(`${this.apiUrl}/hotels`).pipe(
          map((hotels) => 
            hotels.find((hotel) => hotel.provider_id === providerId && hotel.id === hotelId)
          )
        )
      )
    );
  }
  

  // Fetch specific hotel details by hotel ID
  getHotelDetails(hotelId: string): Observable<Hotel | null> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels`).pipe(
      map((hotels) => hotels.find((hotel) => hotel.id === hotelId) || null)
    );
  }

  // Fetch bookings for all hotels under a specific provider
  getRecentBookingsByProvider(providerId: string): Observable<Booking[]> {
    return this.getHotelsByProvider(providerId).pipe(
      map((hotels) => {
        const hotelMap = new Map(hotels.map((hotel) => [hotel.id, hotel.name]));

        const allBookings: Booking[] = [];
        hotels.forEach((hotel) => {
          if (hotel.bookings && hotel.bookings.length > 0) {
            hotel.bookings.forEach((booking) => {
              if (booking.id) {
                allBookings.push({
                  ...booking,
                  hotelName: hotelMap.get(booking.hotelId) || 'Unknown Hotel', // Map hotelName
                });
              }
            });
          }
        });
        // Sort bookings in descending order by date
        return allBookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
      })
    );
  }


}
