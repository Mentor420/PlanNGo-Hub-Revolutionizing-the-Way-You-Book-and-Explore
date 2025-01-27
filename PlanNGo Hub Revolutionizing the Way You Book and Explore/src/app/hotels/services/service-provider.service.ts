import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { Provider, Hotel, Booking, User } from '../models/interfaces'; // Adjust the path if necessary
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderService {
  private apiUrl = 'http://localhost:3000/4'; // Base URL of your mock JSON server

  constructor(private http: HttpClient) {}

  // Fetch providers
  getProviders(): Observable<Provider[]> {
    return this.http.get<{ providers: Provider[] }>(`${this.apiUrl}`).pipe(
      map(response => response.providers)
    );
  }

  // Add a new provider
  addProvider(providerData: Provider): Observable<any> {
    return this.http.get<{ hotels: any[]; providers: Provider[]; users: User[] }>(`${this.apiUrl}`).pipe(
      switchMap((response) => {
        // Update the providers array by adding the new provider
        const updatedProviders = [...response.providers, providerData];

        // Send the updated data back to the server using PUT
        return this.http.put(`${this.apiUrl}`, {
          hotels: response.hotels, // Keep hotels array unchanged
          providers: updatedProviders, // Updated providers array
          users: response.users, // Keep users array unchanged  
        });
      }),
      catchError((error) => {
        console.error('Error adding provider:', error.message);
        return throwError(error);
      })
    );
  }

  // Fetch provider by ID
  getProviderDetails(providerId: string): Observable<Provider | null> {
    return this.http.get<{ providers: Provider[] }>(this.apiUrl).pipe(
      map((response) => {
        const provider = response.providers.find((provider) => provider.provider_id === providerId);
        if (!provider) {
          throw new Error('Provider not found');
        }
        return provider;
      })
    );
  }

  // Fetch hotels by provider ID
  getHotelsByProvider(providerId: string): Observable<Hotel[]> {
    return this.http.get<{hotels :Hotel[]}>(this.apiUrl).pipe(
      map((response) => {
        const hotel = response.hotels.filter((hotel) => hotel.provider_id === providerId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        return hotel;
      })
    );
  }

 // Fetch specific hotel details by provider ID and hotel ID
  getHotelDetailsByProviderId(providerId: string, hotelId: string): Observable<Hotel | undefined> {
    // Fetch all data from the new endpoint
    return this.http.get<{ hotels: Hotel[]; providers: Provider[] }>(`${this.apiUrl}`).pipe(
      map((response) => {
        // Filter the hotels to match the provider ID and hotel ID
        return response.hotels.find(
          (hotel) => hotel.provider_id === providerId && hotel.id === hotelId
        );
      })
    );
  }

  // Fetch specific hotel details by hotel ID
  getHotelDetails(hotelId: string): Observable<Hotel[]> {
    return this.http.get<{hotel: Hotel[]}>(this.apiUrl).pipe(
      map((response) => {
        const hotel = response.hotel.find((hotel) => hotel.id === hotelId);
        return hotel ? [hotel] : []; // Return an array containing the hotel, or an empty array
      })
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
