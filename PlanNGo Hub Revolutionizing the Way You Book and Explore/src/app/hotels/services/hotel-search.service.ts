import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class HotelSearchService {
  private apiUrl = 'http://localhost:3000/hotels'; // Mock JSON API URL

  constructor(private http: HttpClient) { }

  // Fetch all hotels
  getHotels(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get hotel details by ID
  getHotelDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Submit a user rating
  submitRating(hotelId: string, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${hotelId}/rate`, { rating });
  }

  // Save booking function using UUid
  saveBooking(hotelId: string, bookingData: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${hotelId}`).pipe(
      switchMap((hotel: any) => {
        // Initialize bookings array if it doesn't exist
        if (!hotel.bookings) {
          hotel.bookings = [];
        }
  
        // Generate a UUID for the new booking
        const newBookingId = uuidv4();
  
        // Add the new booking to the bookings array
        hotel.bookings.push({
          id: newBookingId,
          ...bookingData,
        });
  
        // Update the entire hotel object
        return this.http.put(`${this.apiUrl}/${hotelId}`, hotel);
      })
    );
  }

  //Save booking function adding hotelId too
  // saveBooking(hotelId: string, bookingData: any): Observable<any> {
  //   // First, get the hotel
  //   return this.http.get(`${this.apiUrl}/${hotelId}`).pipe(
  //     switchMap((hotel: any) => {
  //       // Initialize bookings array if it doesn't exist
  //       if (!hotel.bookings) {
  //         hotel.bookings = [];
  //       }
  
  //       // Ensure we process only valid bookings
  //       const validBookings = hotel.bookings.filter((booking: any) => booking && booking.id);
  
  //       // Find the highest current booking ID or start with 'b001' if no bookings exist
  //       const highestId = validBookings.length > 0
  //         ? validBookings.reduce((maxId: number, booking: any) => {
  //             const numericId = parseInt(booking.id.split('-')[1].replace('b', ''), 10); // Extract numeric part of the ID
  //             return Math.max(maxId, numericId);
  //           }, 0)
  //         : 0;
  
  //       // Generate a new booking ID
  //       const newBookingId = `${hotelId}-b${(highestId + 1).toString().padStart(3, '0')}`;
  
  //       // Add the new booking to the bookings array
  //       hotel.bookings.push({
  //         id: newBookingId,
  //         ...bookingData,
  //       });
  
  //       // Update the entire hotel object
  //       return this.http.put(`${this.apiUrl}/${hotelId}`, hotel);
  //     })
  //   );
  // }
  

  // Get all bookings for a user across all hotels
  getUserBookings(userId: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((hotels: any[]) => {
        // Iterate through each hotel and collect bookings for the given userId
        const userBookings = hotels
          .filter(hotel => hotel.bookings && hotel.bookings.length > 0)
          .flatMap(hotel =>
            hotel.bookings.filter((booking: any) => booking.userId === userId)
          );

        return userBookings;
      })
    );
  }

  // Cancel a booking using only bookingId
  cancelBooking(bookingId: string): Observable<any> {
    // Fetch all hotels
    return this.http.get<any[]>(this.apiUrl).pipe(
      switchMap((hotels: any[]) => {
        // Find the hotel containing the booking with the given bookingId
        const hotel = hotels.find((hotel: any) =>
          hotel.bookings && hotel.bookings.some((booking: any) => booking.id === bookingId)
        );

        if (!hotel) {
          throw new Error('Booking not found in any hotel');
        }

        // Find the specific booking and update its status to 'canceled'
        const booking = hotel.bookings.find((booking: any) => booking.id === bookingId);
        if (booking) {
          booking.status = 'Cancelled'; // Update the status
        }

        // // Remove the booking from the hotel's bookings array
        // hotel.bookings = hotel.bookings.filter((booking: any) => booking.id !== bookingId);

        // Update the hotel with the modified bookings array
        return this.http.put(`${this.apiUrl}/${hotel.id}`, hotel);
      })
    );
  }


  // Get booking history for a user
  // getBookingHistory(hotelId: string, userId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${hotelId}`).pipe(
  //     map((hotel: any) => hotel.bookings.filter((booking: any) => booking.userId === userId))
  //   );
  // }


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

    if (rooms) {
      url += `&roomsAvailable_gte=${rooms}`; // filter for available rooms
    }

    if (amenities && amenities.length > 0) {
      amenities.forEach((amenity) => {
        url += `&amenities.name_like=${encodeURIComponent(amenity)}`; // filter by amenities
      });
    }

    console.log('Final URL:', url); // Check if URL is constructed correctly
    return this.http.get<any[]>(url).pipe(
      map((hotels) =>
        hotels.filter((hotel) => this.isHotelAvailable(hotel, checkInDate, checkOutDate, rooms))
      )
    );
  }

  // Helper method to check if a hotel is available for the given date range and number of rooms
  private isHotelAvailable(
    hotel: any,
    checkInDate?: string,
    checkOutDate?: string,
    requestedRooms: number = 1,
  ): boolean {

    if (!checkInDate || !checkOutDate) {
      console.error('Invalid check-in or check-out date provided.');
      return false;
    }

    const requestedStart = new Date(checkInDate);
    const requestedEnd = new Date(checkOutDate);
  
    if (requestedEnd <= requestedStart) {
      console.error('Invalid date range: check-out date must be after check-in date.');
      return false;
    }
  
    // Check availability for each room type
    for (const room of hotel.rooms) {
      const roomId = room.roomId;
      const totalAvailableRooms = room.availableRooms;
  
      // Calculate how many rooms of this type are already booked for the requested period
      const overlappingBookings = hotel.bookings?.filter((booking: any) => {
        const bookingStart = new Date(booking.checkInDate);
        const bookingEnd = new Date(booking.checkOutDate);
  
        // Check if booking overlaps with the requested dates and is for the same room type
        return (
          booking.roomId === roomId &&
          !(requestedEnd <= bookingStart || requestedStart >= bookingEnd) // Overlapping condition
        );
      }) || [];
  
      const totalBookedRooms = overlappingBookings.reduce(
        (sum: number, booking: any) => sum + booking.roomBooked,
        0
      );
  
      // Calculate remaining rooms of this type
      const remainingRooms = totalAvailableRooms - totalBookedRooms;
  
      // If this room type has enough rooms left, return true
      if (remainingRooms >= requestedRooms) {
        return true;
      }
    }
  
    // If no room type has enough availability, return false
    return false;
  }
  
}
