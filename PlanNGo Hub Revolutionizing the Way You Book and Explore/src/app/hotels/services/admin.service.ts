import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Booking, Room, User } from '../models/interfaces';
import { Hotel, Provider } from '../models/interfaces';

// Extended Room interface to include hotelId
interface RoomWithHotelId extends Room {
  hotelId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/4'; // Updated API URL

  constructor(private http: HttpClient) {}

  // Get all hotels
  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<{ hotels: Hotel[] }>(`${this.apiUrl}`).pipe(
      map(response => response.hotels) 
    );
  }

  // Get total number of users
  getTotalUsers(): Observable<number> {
    return this.getAllHotels().pipe(
      map((data) => {
        const userIds = data.flatMap((hotel) => hotel.bookings.map((booking) => booking.userId));
        const uniqueUserIds = new Set(userIds);
        return uniqueUserIds.size;
      })
    );
  }

  // Get all bookings across hotels including the hotel name
  getRecentBookings(): Observable<any[]> {
    return this.getAllHotels().pipe(
      map((hotels) =>
        hotels
          .flatMap((hotel) =>
            hotel.bookings.map((booking) => ({
              ...booking,
              hotelName: hotel.name,
              hotelId: hotel.id,
            }))
          )
          .filter((booking) => booking.userId && booking.roomId && booking.fullName && booking.email)
          .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      )
    );
  }

  // Add a new hotel
  addHotel(hotelData: Hotel): Observable<any> {
    return this.http.get<{ hotels: any[]; providers: any[]; users: User[] }>(`${this.apiUrl}`).pipe(
      switchMap((response) => {
        // Update the hotels array by adding the new hotel
        const updatedHotels = [...response.hotels, hotelData];
  
        // Send the updated data back to the server using POST
        return this.http.put(`${this.apiUrl}`, {
          hotels: updatedHotels, // Updated hotels array
          providers: response.providers, // Keep providers array unchanged
          users: response.users, // Keep users array unchanged
        });
      })
    );
  }
  

  // Delete a hotel by ID
  deleteHotel(hotelId: string): Observable<any> {
    return this.http.get<{ hotels: any[]; providers: any[]; users: User[]  }>(`${this.apiUrl}`).pipe(
      switchMap((response) => {
        // Filter out the hotel to be deleted
        const updatedHotels = response.hotels.filter((hotel) => hotel.id !== hotelId);

        // Update the dataset on the new endpoint
        return this.http.put(`${this.apiUrl}`, {
          hotels: updatedHotels,
          providers: response.providers,
          users: response.users,
        });
      })
    );
  }

  // Utility function to check the rooms available in the hotel
  private updateRoomsAvailable(hotel: Hotel): Hotel {
    hotel.roomsAvailable = hotel.rooms.reduce((sum, room) => sum + room.availableRooms, 0);
    return hotel;
  }
  
  // Add a room to a specific hotel
  updateRoom(hotelId: string, updatedRoom: Room): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe( // Fetch data from /4 endpoint
      map((data) => {
        // Find the hotel containing the hotelId
        const hotel = data.hotels.find((h: any) => h.id === hotelId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
  
        // Find the room inside the hotel
        const roomIndex = hotel.rooms.findIndex((room: any) => room.roomId === updatedRoom.roomId);
        if (roomIndex === -1) {
          throw new Error('Room not found');
        }
  
        // Update the specific room
        hotel.rooms[roomIndex] = updatedRoom;
  
        // Optionally, update the roomsAvailable count
        this.updateRoomsAvailable(hotel);
  
        // Return the updated data object
        return data;
      }),
      switchMap((updatedData) =>
        this.http.put(`${this.apiUrl}`, updatedData) // Send the whole data structure back to the root endpoint
      ),
      catchError((error) => {
        console.error('Error updating room:', error.message);
        return throwError(error);
      })
    );
  }
  

  
  // Add a room to a specific hotel
  addRoomToHotel(hotelId: string, roomData: Room): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe( // Fetch the entire data from /4 endpoint
      map((data) => {
        // Find the hotel by its ID
        const hotel = data.hotels.find((h: any) => h.id === hotelId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
  
        // Add the new room to the hotel
        hotel.rooms.push(roomData); 
  
        // Optionally, update the roomsAvailable count
        this.updateRoomsAvailable(hotel);
  
        // Return the updated data structure
        return data;
      }),
      switchMap((updatedData) =>
        this.http.put(`${this.apiUrl}`, updatedData) // Send the whole updated structure back to the /4 endpoint
      ),
      catchError((error) => {
        console.error('Error adding room to hotel:', error.message);
        return throwError(error);
      })
    );
  }  

  deleteRoomFromHotel(hotelId: string, roomId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe( // Fetch the entire data from the /4 endpoint
      map((data) => {
        const hotel = data.hotels.find((h: any) => h.id === hotelId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
  
        // Filter out the room to be deleted
        const updatedRooms = hotel.rooms.filter((room: any) => room.roomId !== roomId);
        if (updatedRooms.length === hotel.rooms.length) {
          throw new Error('Room not found');
        }
  
        // Update the hotel with the new rooms list
        hotel.rooms = updatedRooms;
        this.updateRoomsAvailable(hotel); // Update the roomsAvailable count
  
        // Return the updated data structure
        return data;
      }),
      switchMap((updatedData) =>
        this.http.put(`${this.apiUrl}`, updatedData) // Send the updated full data back to the /4 endpoint
      ),
      catchError((error) => {
        console.error('Error deleting room:', error.message);
        return throwError(error);
      })
    );
  }
  
  
// Notify affected bookings
notifyAffectedBookings(hotelId: string, roomId: string): Observable<Booking[]> {
  return this.http.get<any>(`${this.apiUrl}`).pipe( // Get full data from /4
    map((data) => {
      const hotel = data.hotels.find((h: any) => h.id === hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }

      const affectedBookings = hotel.bookings.filter(
        (booking: any) => booking.roomId === roomId && booking.status === 'Booked'
      );

      // Update the status of affected bookings to 'Cancelled'
      affectedBookings.forEach((booking: any) => {
        booking.status = 'Cancelled';
      });

      // Update the hotel bookings in the hotel object
      hotel.bookings = hotel.bookings.map((booking: any) =>
        affectedBookings.includes(booking)
          ? { ...booking, status: 'Cancelled' }
          : booking
      );

      // Return both updated hotel and affected bookings
      return { hotel, affectedBookings };
    }),
    switchMap(({ hotel, affectedBookings }) =>
      this.updateHotel(hotel).pipe( // Update the full data at /4
        map(() => affectedBookings),
        tap((bookings) => {
          if (bookings.length === 0) {
            console.warn('No affected bookings found for room deletion.');
          }
        })
      )
    ),
    catchError((error) => {
      console.error('Error notifying affected bookings:', error.message);
      return throwError(error);
    })
  );
}


  // Update the hotel information
private updateHotel(hotel: Hotel): Observable<Hotel> {
  return this.http.get<any>(`${this.apiUrl}`).pipe( // Fetch full data from /4
    map((data) => {
      const hotelIndex = data.hotels.findIndex((h: any) => h.id === hotel.id);
      if (hotelIndex === -1) {
        throw new Error('Hotel not found');
      }

      // Update the specific hotel with the new data
      data.hotels[hotelIndex] = hotel;

      // Return the full updated data
      return data;
    }),
    switchMap((updatedData) =>
      this.http.put(`${this.apiUrl}`, updatedData).pipe( // Send the updated data back to /4
        map(() => hotel)
      )
    ),
    catchError((error) => {
      console.error('Error updating hotel:', error.message);
      return throwError(error);
    })
  );
}

  // Get hotel by id
  getHotelById(hotelId: string): Observable<Hotel> {
    return this.http.get<{ hotels: Hotel[] }>(this.apiUrl).pipe(
      map((response) => {
        const hotel = response.hotels.find((h: any) => h.id === hotelId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        return hotel;
      })
    );
  }

  // Get rooms of a specific hotel
  getHotelRooms(hotelId: string): Observable<Room[]> {
    return this.getAllHotels().pipe(
      map((data) => {
        const hotel = data.find((hotel) => hotel.id === hotelId);
        return hotel ? hotel.rooms : [];
      })
    );
  }

  // Get all rooms across all hotels
  getAllRooms(): Observable<RoomWithHotelId[]> {
    return this.getAllHotels().pipe(
      map((hotels) =>
        hotels.flatMap((hotel) =>
          hotel.rooms.map((room) => ({
            ...room,
            hotelId: hotel.id, // Include hotelId for each room
          }))
        )
      )
    );
  }

  // Get all providers
  getAllProviders(): Observable<Provider[]> {
    return this.http.get<{ providers: Provider[] }>(`${this.apiUrl}`).pipe(
      map(response => response.providers) // Adjust to access providers from the new API response structure
    );
  }

  // Get provider bookings
  getProviderBookings(): Observable<{ provider: string; bookings: number }[]> {
    return forkJoin({
      hotels: this.getAllHotels(),
      providers: this.getAllProviders(),
    }).pipe(
      map(({ hotels, providers }) => {
        // Create a map of provider_id to provider name
        const providerNameMap = providers.reduce((acc, provider) => {
          acc[provider.provider_id] = provider.name;
          return acc;
        }, {} as Record<string, string>);

        // Group hotels by provider_id and count bookings
        const providerBookingsMap = hotels.reduce((acc, hotel) => {
          if (!hotel.provider_id) return acc; // Skip hotels without a provider_id
          if (!acc[hotel.provider_id]) {
            acc[hotel.provider_id] = 0;
          }
          acc[hotel.provider_id] += hotel.bookings.length;
          return acc;
        }, {} as Record<string, number>);

        // Convert grouped data to an array of { provider, bookings }
        return Object.entries(providerBookingsMap).map(([providerId, bookings]) => ({
          provider: providerNameMap[providerId] || providerId, // Use name from map or fallback to id
          bookings,
        }));
      })
    );
  } 

  getTotalRevenue(): Observable<number> {
    return this.getAllHotels().pipe(
      map((hotels) =>
        hotels.reduce(
          (total, hotel) => total + hotel.bookings.reduce((hotelTotal, booking) => hotelTotal + booking.price, 0),
          0,
        ),
      ),
    )
  }

  getMonthlyBookings(): Observable<{ month: string; count: number, revenue: number }[]> {
    return this.getAllHotels().pipe(
      map((hotels) => {
        const bookings = hotels.flatMap((hotel) => hotel.bookings);
  
        // Filter out bookings without a valid bookingDate
        const validBookings = bookings.filter(booking => booking.bookingDate);
  
        // Initialize an object to store the count of bookings and revenue for each month
        const monthlyBookings = validBookings.reduce(
          (acc, booking) => {
            const month = new Date(booking.bookingDate).toLocaleString("default", { month: "short" });
            acc[month] = acc[month] || { count: 0, revenue: 0 };
            acc[month].count += 1;
            acc[month].revenue += booking.price || 0;  // Add price to revenue
            return acc;
          },
          {} as Record<string, { count: number, revenue: number }>,
        );
  
        // Get all months (January to December) to ensure they are all present in the result
        const allMonths = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
  
        // Ensure all months are included, even if some have no bookings or revenue
        return allMonths.map(month => ({
          month,
          count: monthlyBookings[month]?.count || 0,   // If no bookings for this month, set count to 0
          revenue: monthlyBookings[month]?.revenue || 0 // If no revenue for this month, set revenue to 0
        }));
      }),
    );
  }
  
  

  getMonthlyRevenue(): Observable<{ month: string; revenue: number }[]> {
    return this.getAllHotels().pipe(
      map((hotels) => {
        const bookings = hotels.flatMap((hotel) => hotel.bookings);
  
        const monthlyRevenue = bookings.reduce(
          (acc, booking) => {
            const month = new Date(booking.bookingDate).toLocaleString("default", { month: "short" });
            acc[month] = (acc[month] || 0) + booking.price;
            return acc;
          },
          {} as Record<string, number>,
        );
  
        return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
          month,
          revenue,
        }));
      })
    );
  }
  
  getAverageRatings(): Observable<{ hotelName: string; averageRating: number }[]> {
    return this.getAllHotels().pipe(
      map((hotels) =>
        hotels.map((hotel) => ({
          hotelName: hotel.name,
          averageRating: hotel.ratings.averageRating,
        }))
      )
    );
  } 
}
