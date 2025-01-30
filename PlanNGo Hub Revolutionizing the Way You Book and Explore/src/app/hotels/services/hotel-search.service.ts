import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Hotel, Provider, User } from '../models/interfaces';
@Injectable({
  providedIn: 'root',
})
export class HotelSearchService {
  private apiUrl = 'http://localhost:3000/4'; // Mock JSON API URL

  constructor(private http: HttpClient) { }

  // Fetch users
  getUsers(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}`).pipe(
      map(response => response.users)
    );
  }

  // Add a new user
  addUser(userData: User): Observable<any> {
    return this.http.get<{ hotels: any[]; providers: Provider; users: User[] }>(`${this.apiUrl}`).pipe(
      switchMap((response) => {
        // Update the providers array by adding the new provider
        const updatedUsers = [...response.users, userData];

        // Send the updated data back to the server using PUT
        return this.http.put(`${this.apiUrl}`, {
          hotels: response.hotels, // Keep hotels array unchanged
          providers: response.providers, // Keep providers array unchanged
          users: updatedUsers, // Updated users array
        });
      }),
      catchError((error) => {
        console.error('Error adding user:', error.message);
        return throwError(error);
      })
    );
  }

  
  // Fetch all hotels
  getHotels(): Observable<Hotel[]> {
    return this.http.get<{ hotels: Hotel[] }>(`${this.apiUrl}`).pipe(
      map(response => response.hotels)
    );
  }

  // Get hotel details by ID
  getHotelDetails(id: string): Observable<any> {
    return this.http.get<{ hotels: Hotel[] }>(this.apiUrl).pipe(
      map((response) => {
        const hotel = response.hotels.find((h: any) => h.id === id);
        return hotel ? hotel || [] : [];
      })
    );
  }

  // Save review function
  submitReview(reviewData: {
    hotelId: string;
    bookingId: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }): Observable<any> {
    const { hotelId, bookingId, rating, author, comment, date } = reviewData;
  
    // Fetch the data from the new endpoint
    return this.http.get<{ hotels: any[]; providers: any[]; users: any[] }>(`${this.apiUrl}`).pipe(
      switchMap((response) => {
        // Extract the specific hotel
        const hotels = [...response.hotels];
        const hotelIndex = hotels.findIndex((h: any) => h.id === hotelId);
  
        if (hotelIndex === -1) {
          throw new Error('Hotel not found');
        }
  
        const hotel = hotels[hotelIndex];
  
        const currentRatings = hotel.ratings || {
          averageRating: 0,
          ratingsCount: 0,
          ratingBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        };
  
        const currentReviews = hotel.reviews || [];
        const currentBookings = hotel.bookings || [];
        const booking = currentBookings.find((b: any) => b.id === bookingId);
  
        if (!booking) {
          throw new Error('Booking not found');
        }
  
        // Mark the review as submitted
        booking.reviewSubmitted = true;
  
        // Update the rating breakdown
        const updatedRatingBreakdown = { ...currentRatings.ratingBreakdown };
        updatedRatingBreakdown[rating] = (updatedRatingBreakdown[rating] || 0) + 1;
  
        // Update the ratings count
        const updatedRatingsCount = currentRatings.ratingsCount + 1;
  
        // Calculate the new average rating
        const totalRatingSum = Object.entries(updatedRatingBreakdown).reduce(
          (sum, [key, count]) => sum + parseInt(key) * (count as number),
          0
        );
        const updatedAverageRating = totalRatingSum / updatedRatingsCount;
  
        // Prepare the updated ratings object
        const updatedRatings = {
          averageRating: parseFloat(updatedAverageRating.toFixed(1)),
          ratingsCount: updatedRatingsCount,
          ratingBreakdown: updatedRatingBreakdown,
        };
  
        // Generate a new review ID
        const highestReviewId = currentReviews.length > 0
          ? currentReviews.reduce((maxId: number, review: any) => {
            const numericId = parseInt(review.id.split('-')[1].replace('rW', ''), 10);
            return Math.max(maxId, numericId);
          }, 0)
          : 0;
  
        const newReviewId = `${hotelId}-rW${(highestReviewId + 1).toString().padStart(3, '0')}`;
  
        // Add the new review to the reviews array
        const newReview = {
          id: newReviewId,
          author,
          rating,
          comment,
          date,
        };
  
        const updatedReviews = [...currentReviews, newReview];
  
        // Update the hotel data directly in the hotels array
        hotels[hotelIndex] = {
          ...hotel,
          ratings: updatedRatings,
          reviews: updatedReviews,
          bookings: currentBookings,
        };
  
        // Send the updated hotels array back to the server
        return this.http.put(`${this.apiUrl}`, { 
          hotels: hotels,
          providers: response.providers,
          users: response.users,
        });
      })
    );
  }  

  // Fetch all reviews from all hotels
  getAllReviews(): Observable<any[]> {
    return this.http.get<{ hotels: Hotel[] }>(this.apiUrl).pipe(
      map((response) =>
        response.hotels
          .filter((hotel) => hotel.reviews && hotel.reviews.length > 0) // Only hotels with reviews
          .flatMap((hotel) =>
            hotel.reviews.map((review: any) => ({
              ...review,
              hotelName: hotel.name, // Add hotel context to each review
              hotelId: hotel.id,
            }))
          )
      )
    );
  }

  // Alternative: Simulated review-specific fetch
  getReviewsForHotel(hotelId: string): Observable<any[]> {
    return this.http.get<{ hotels: Hotel[] }>(this.apiUrl).pipe(
      map((response) => {
        const hotel = response.hotels.find((h: any) => h.id === hotelId);
        return hotel ? hotel.reviews || [] : [];
      })
    );
  }

  // Save booking function using UUid
  // saveBooking(hotelId: string, bookingData: any): Observable<any> {
  //   return this.http.get<{ hotels: Hotel[] }>(this.apiUrl).pipe(
  //     switchMap((response) => {
  //       const hotel = response.hotels.find((h: any) => h.id === hotelId);
  //       if (!hotel) {
  //         throw new Error('Hotel not found');
  //       }

  //       // Initialize bookings array if it doesn't exist
  //       if (!hotel.bookings) {
  //         hotel.bookings = [];
  //       }

  //       // Generate a UUID for the new booking
  //       const newBookingId = uuidv4();

  //       // Add the new booking to the bookings array
  //       hotel.bookings.push({
  //         id: newBookingId,
  //         ...bookingData,
  //       });

  //       // Update the entire hotel object
  //       return this.http.put(`${this.apiUrl}/hotels/${hotelId}`, hotel);
  //     })
  //   );
  // }

  // Save a booking function with new endpoint URL
  saveBooking(hotelId: string, bookingData: any): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      switchMap((data: any) => {
        const hotel = data.hotels.find((h: any) => h.id === hotelId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
  
        // Initialize bookings array if it doesn't exist
        if (!hotel.bookings) {
          hotel.bookings = [];
        }
  
        // Find the highest current booking ID or start with 'b001' if no bookings exist
        const highestId = hotel.bookings.length > 0
          ? hotel.bookings.reduce((maxId: number, booking: any) => {
            const numericId = parseInt(booking.id.split('-')[1].replace('b', ''), 10);
            return Math.max(maxId, numericId);
          }, 0)
          : 0;
  
        // Generate a new booking ID
        const newBookingId = `${hotelId}-b${(highestId + 1).toString().padStart(3, '0')}`;
  
        // Add the new booking to the bookings array
        hotel.bookings.push({
          id: newBookingId,
          ...bookingData,
        });
  
        // Update room availability for the booked room
        const room = hotel.rooms?.find((r: any) => r.roomId === bookingData.roomId);
        if (!room) {
          throw new Error('Room not found');
        }
  
        // Check if enough rooms are available for booking
        if (room.availableRooms < bookingData.roomBooked) {
          throw new Error('Not enough rooms available');
        }
  
        // Deduct the booked rooms from the room's availability
        room.availableRooms -= bookingData.roomBooked;
  
        // Recalculate the total available rooms for the hotel
        hotel.roomsAvailable = hotel.rooms.reduce(
          (total: number, currentRoom: any) => total + currentRoom.availableRooms,
          0
        );
  
        // Update the hotel object in the data structure
        return this.http.put(`${this.apiUrl}`, data);
      }),
      catchError((error) => {
        console.error('Error saving booking:', error.message);
        return throwError(error);
      })
    );
  }  

  // Update booking status function
  updateBookingStatusAndAvailability(
    bookingId: string,
    newStatus: string,
    hotelId: string,
    roomId: string,
    roomBooked: number
  ): Observable<any> {
    return this.http.get<{ hotels: any[] }>(`${this.apiUrl}`).pipe(
      switchMap((data) => {
        const hotel = data.hotels.find((h: any) =>
          h.bookings && h.bookings.some((b: any) => b.id === bookingId)
        );
  
        if (!hotel) {
          throw new Error("Booking not found in any hotel");
        }
  
        const booking = hotel.bookings.find((b: any) => b.id === bookingId);
        if (!booking) {
          throw new Error("Booking not found");
        }
  
        const room = hotel.rooms.find((r: any) => r.roomId === roomId);
        if (!room) {
          throw new Error("Room not found");
        }
  
        // Update booking status
        booking.status = newStatus;
  
        // Update room and hotel availability only if status is 'Completed'
        if (newStatus === "Completed") {
          room.availableRooms += roomBooked; // Increase room availability
          hotel.roomsAvailable = hotel.rooms.reduce(
            (total: number, r: any) => total + r.availableRooms,
            0
          );
        }
  
        // Update the hotel object in the data structure
        return this.http.put(`${this.apiUrl}`, data);
      }),
      catchError((error) => {
        console.error("Error updating booking status and room availability:", error);
        return throwError(error);
      })
    );
  }  

  // Get all bookings for a user across all hotels
  getUserBookings(userId: string): Observable<any[]> {
    return this.http.get<{ hotels: Hotel[] }>(this.apiUrl).pipe( // Update to new endpoint
      map((response) => {
        // Iterate through each hotel and collect bookings for the given userId
        const userBookings = response.hotels
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
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      switchMap((data: any) => {
        const hotel = data.hotels.find((hotel: any) =>
          hotel.bookings && hotel.bookings.some((booking: any) => booking.id === bookingId)
        );

        if (!hotel) {
          throw new Error('Booking not found in any hotel');
        }

        const booking = hotel.bookings.find((booking: any) => booking.id === bookingId);
        if (booking) {
          booking.status = 'Cancelled'; // Update the status
        }

        // Update the hotel object in the data structure
        return this.http.put(`${this.apiUrl}`, data);
      })
    );
  }

   // Cancel a review using only bookingId
   cancelBookingReview(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      switchMap((data: any) => {
        const hotel = data.hotels.find((hotel: any) =>
          hotel.bookings && hotel.bookings.some((booking: any) => booking.id === bookingId)
        );

        if (!hotel) {
          throw new Error('Booking not found in any hotel');
        }

        const booking = hotel.bookings.find((booking: any) => booking.id === bookingId);
        if (booking) {
          booking.reviewSubmitted = 'Rejected'; // Update the status
        }

        // Update the hotel object in the data structure
        return this.http.put(`${this.apiUrl}`, data);
      })
    );
  }

  // Get booking history for a user
  // getBookingHistory(hotelId: string, userId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${hotelId}`).pipe(
  //     map((hotel: any) => hotel.bookings.filter((booking: any) => booking.userId === userId))
  //   );
  // }

  // Fetch hotels by city using the new endpoint structure
  fetchHotelsByCity(city: string): Observable<any[]> {
    const url = `${this.apiUrl}`; // New endpoint for fetching data

    return this.http.get<any>(url).pipe(
      map((data: any) => {
        // Access the nested "hotels" array
        const hotels = data.hotels || [];

        // Filter hotels by city
        return hotels.filter((hotel: any) => hotel.city === city);
      })
    );
  }

  // Search hotels based on various criteria using the new endpoint
  searchHotels(
    city: string,
    checkInDate?: string,
    checkOutDate?: string,
    rooms?: number,
    priceRange?: number[],
    amenities?: string[]
  ): Observable<any[]> {
    const url = `${this.apiUrl}`; // Updated endpoint to fetch nested data

    return this.http.get<any>(url).pipe(
      map((data: any) => {
        // Access the nested "hotels" array
        const hotels = data.hotels || [];

        // Filter by city and other criteria
        return hotels.filter((hotel: any) => {
          // Match city
          if (hotel.city !== city) {
            return false;
          }

          // Match price range if specified
          if (priceRange) {
            const [minPrice, maxPrice] = priceRange;
            if (hotel.pricePerNight < minPrice || hotel.pricePerNight > maxPrice) {
              return false;
            }
          }

          // Match rooms if specified
          if (rooms && hotel.roomsAvailable < rooms) {
            return false;
          }

          // Match amenities if specified
          if (amenities && amenities.length > 0) {
            const hasAllAmenities = amenities.every((amenity) =>
              hotel.amenities?.some((a: any) => a.name === amenity)
            );
            if (!hasAllAmenities) {
              return false;
            }
          }

          // Check availability using the helper method
          return this.isHotelAvailable(hotel, checkInDate, checkOutDate, rooms);
        });
      })
    );
  }

  // Helper method to check if a hotel is available
  private isHotelAvailable(
    hotel: any,
    checkInDate?: string,
    checkOutDate?: string,
    requestedRooms: number = 1
  ): boolean {
    if (!checkInDate || !checkOutDate) {
      console.error('Invalid check-in or check-out date provided.');
      return false;
    }

    const requestedStart = new Date(checkInDate);
    const requestedEnd = new Date(checkOutDate);

    if (requestedEnd < requestedStart) {
      // alert('Invalid date range: check-out date must be after check-in date.');
      console.error('Invalid date range: check-out date must be after check-in date.');
      return false;
    }

    // Check availability for each room type
    for (const room of hotel.rooms) {
      const roomId = room.roomId;
      const totalAvailableRooms = room.availableRooms;

      const overlappingBookings = hotel.bookings?.filter((booking: any) => {
        const bookingStart = new Date(booking.checkInDate);
        const bookingEnd = new Date(booking.checkOutDate);
        return (
          bookingStart < requestedEnd && bookingEnd > requestedStart && booking.roomId === roomId
        );
      });

      if (overlappingBookings.length < requestedRooms) {
        return true; // Available
      }
    }

    return false; // Not available
  }

}
