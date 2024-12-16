import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HotelSearchService {
  private apiUrl = 'http://localhost:3000/hotels'; // Mock JSON API URL

  constructor(private http: HttpClient) {}

  // Method to fetch hotels based on city
  searchHotels(
    location: string,
    checkInDate?: string,
    checkOutDate?: string,
    rooms?: number,
    priceRange?: number[],
    amenities?: string[],
  ): Observable<any[]> {
    let url = `${this.apiUrl}?location=${location}`;

  // Add query parameters dynamically
  if (priceRange) {
    url += `&pricePerNight_gte=${priceRange[0]}&pricePerNight_lte=${priceRange[1]}`;
  }
    if (checkInDate) {
      url += `&checkInDate_gte=${checkInDate}`;
    }
    if (checkOutDate) {
      url += `&checkOutDate_lte=${checkOutDate}`;
    }
    if (rooms) {
      url += `&roomsAvailable_gte=${rooms}`;
    }
    if (amenities && amenities.length > 0) {
      amenities.forEach((amenity) => {
        url += `&amenities_like=${encodeURIComponent(amenity)}`;
      });
    }
    console.log('Final URL:', url);
    return this.http.get<any[]>(url);
  }

}
