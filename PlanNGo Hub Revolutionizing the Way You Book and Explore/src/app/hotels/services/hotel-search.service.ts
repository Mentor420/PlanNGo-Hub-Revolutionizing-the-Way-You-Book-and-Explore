import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HotelSearchService {
  private apiUrl = 'http://localhost:3000/hotels'; // Mock JSON API URL

  constructor(private http: HttpClient) {}

  getHotelDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Submit a user rating
  submitRating(hotelId: string, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${hotelId}/rate`, { rating });
  }
  
  // Method to fetch hotels based on search criteria
  searchHotels(
    city: string,           
    checkInDate?: string,
    checkOutDate?: string,
    rooms?: number,
    priceRange?: number[],
    amenities?: string[]
  ): Observable<any[]> {
    let url = `${this.apiUrl}?city=${city}`; // update query param to 'city'

    // Add query parameters dynamically
    if (priceRange) {
      url += `&pricePerNight_gte=${priceRange[0]}&pricePerNight_lte=${priceRange[1]}`;
    }

    if (checkInDate) {
      // Add condition to use '=' for the checkInDate query parameter
      url += `&checkInDate=${checkInDate}`; // directly pass the checkInDate
    }

    if (checkOutDate) {
      // Add condition to use '=' for the checkOutDate query parameter
      url += `&checkOutDate=${checkOutDate}`; // directly pass the checkOutDate
    }

    if (rooms) {
      url += `&roomsAvailable_gte=${rooms}`; // filter for available rooms
    }

    if (amenities && amenities.length > 0) {
      amenities.forEach((amenity) => {
        url += `&amenities_like=${encodeURIComponent(amenity)}`; // filter by amenities
      });
    }

    console.log('Final URL:', url); // Check if URL is constructed correctly
    return this.http.get<any[]>(url); // Make the HTTP request
  }
}
