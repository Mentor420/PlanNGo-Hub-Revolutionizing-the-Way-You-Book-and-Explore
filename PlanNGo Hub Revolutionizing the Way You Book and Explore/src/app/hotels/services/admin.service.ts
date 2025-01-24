import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Booking, Room } from '../models/interfaces';
import { Hotel, Provider } from '../models/interfaces';

// Extended Room interface to include hotelId
interface RoomWithHotelId extends Room {
  hotelId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/hotels'; // Updated API URL

  constructor(private http: HttpClient) {}

  // Get all hotels
  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
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
    return this.http.post(`${this.apiUrl}`, hotelData );
  }

  // Delete a hotel by ID
  deleteHotel(hotelId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${hotelId}`);
  }

  // Utility function to check the rooms available in the hotel
  private updateRoomsAvailable(hotel: Hotel): Hotel {
    hotel.roomsAvailable = hotel.rooms.reduce((sum, room) => sum + room.availableRooms, 0);
    return hotel;
  }
  
  // Add a room to a specific hotel
  updateRoom(hotelId: string, updatedRoom: Room): Observable<any> {
    return this.getAllHotels().pipe(
      map((hotels) => {
        const hotel = hotels.find((h) => h.id === hotelId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        const roomIndex = hotel.rooms.findIndex((room) => room.roomId === updatedRoom.roomId);
        if (roomIndex === -1) {
          throw new Error('Room not found');
        }
        hotel.rooms[roomIndex] = updatedRoom; // Update the specific room
        this.updateRoomsAvailable(hotel); // Update the roomsAvailable count
        return hotel;
      }),
      switchMap((updatedHotel) => 
        this.http.put(`${this.apiUrl}/${hotelId}`, updatedHotel)
      ),
      catchError((error) => {
        console.error('Error updating room:', error.message);
        return throwError(error);
      })
    );
  }

  
  // Add a room to a specific hotel
  addRoomToHotel(hotelId: string, roomData: Room): Observable<any> {
    return this.http.get<Hotel>(`${this.apiUrl}/${hotelId}`).pipe(
      map((hotel) => {
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        hotel.rooms.push(roomData); // Add the room to the hotel's rooms array
        this.updateRoomsAvailable(hotel); // Update the roomsAvailable count
        return hotel;
      }),
      switchMap((updatedHotel) => 
        this.http.put(`${this.apiUrl}/${hotelId}`, updatedHotel) // Update only the specific hotel
      ),
      catchError((error) => {
        console.error('Error adding room to hotel:', error.message);
        return throwError(error);
      })
    );
  }

  deleteRoomFromHotel(hotelId: string, roomId: string): Observable<any> {
    return this.getAllHotels().pipe(
      map((hotels) => {
        const hotel = hotels.find((h) => h.id === hotelId);
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        const updatedRooms = hotel.rooms.filter((room) => room.roomId !== roomId);
        if (updatedRooms.length === hotel.rooms.length) {
          throw new Error('Room not found');
        }
        hotel.rooms = updatedRooms;
        this.updateRoomsAvailable(hotel); // Update the roomsAvailable count
        return hotel;
      }),
      switchMap((updatedHotel) => 
        this.http.put(`${this.apiUrl}/${hotelId}`, updatedHotel)
      ),
      catchError((error) => {
        console.error('Error deleting room:', error.message);
        return throwError(error);
      })
    );
  }
  
  // Notify affected bookings
  notifyAffectedBookings(hotelId: string, roomId: string): Observable<Booking[]> {
    return this.getHotelById(hotelId).pipe(
      map((hotel) => {
        const affectedBookings = hotel.bookings.filter(
          (booking) => booking.roomId === roomId && booking.status === 'Booked'
        );
  
        // Update the status of affected bookings to 'Cancelled'
        affectedBookings.forEach((booking) => {
          booking.status = 'Cancelled';
        });
  
        // Update the hotel bookings in the hotel object
        hotel.bookings = hotel.bookings.map((booking) =>
          affectedBookings.includes(booking)
            ? { ...booking, status: 'Cancelled' }
            : booking
        );
  
        // Return both updated hotel and affected bookings
        return { hotel, affectedBookings };
      }),
      switchMap(({ hotel, affectedBookings }) =>
        this.updateHotel(hotel).pipe(
          map(() => affectedBookings),
          tap((bookings) => {
            if (bookings.length === 0) {
              console.warn('No affected bookings found for room deletion.');
            }
          })
        )
      )
    );
  }

  private updateHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.apiUrl}/${hotel.id}`, hotel).pipe(
      map((updatedHotel) => updatedHotel)
    );
  }

  getHotelById(hotelId: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${hotelId}`).pipe(
      map((hotel) => {
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

  /* BELOW FUNCTIONS IS FOR THE TESTING PURPOSE */

  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>('http://localhost:3000/providers');
  }  

  getProviderBookings(): Observable<{ provider: string; bookings: number }[]> {
    return forkJoin({
      hotels: this.getAllHotels(),
      providers: this.http.get<{ provider_id: string; name: string }[]>('http://localhost:3000/providers'),
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
      }),
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

  calculateMonthlyBookings(hotelId: string): Observable<{ monthYear: string; totalBookings: number; totalRevenue: number }[]> {
    return this.getHotelById(hotelId).pipe(
      map((hotel) => {
        if (!hotel || !hotel.bookings) {
          return [];
        }
  
        const bookings = hotel.bookings;
        const monthlyData: Record<string, { totalBookings: number; totalRevenue: number }> = {};
  
        bookings.forEach((booking) => {
          const checkInDate = new Date(booking.checkInDate);
          const month = checkInDate.getMonth() + 1; // Months are 0-indexed
          const year = checkInDate.getFullYear();
          const monthYear = `${year}-${month.toString().padStart(2, '0')}`;
  
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { totalBookings: 0, totalRevenue: 0 };
          }
  
          monthlyData[monthYear].totalBookings += 1;
          monthlyData[monthYear].totalRevenue += booking.price;
        });
  
        return Object.entries(monthlyData).map(([monthYear, data]) => ({
          monthYear,
          totalBookings: data.totalBookings,
          totalRevenue: data.totalRevenue,
        }));
      }),
      catchError((error) => {
        console.error(`Error calculating monthly bookings for hotel ${hotelId}:`, error.message);
        return throwError(error);
      })
    );
  }
  
  
}
