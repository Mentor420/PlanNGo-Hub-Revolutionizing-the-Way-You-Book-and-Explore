import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Room } from '../models/interfaces';
import { Hotel } from '../models/interfaces';

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

  // Get all bookings excluding empty ones
  getRecentBookings(): Observable<any[]> {
    return this.getAllHotels().pipe(
      map((hotels) => 
        hotels
          .flatMap((hotel) => hotel.bookings)
          .filter((booking) => booking.userId && booking.roomId && booking.fullName && booking.email)
          .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      )
    );
  }

  // Add a new hotel
  addHotel(hotelData: Hotel): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { hotel: hotelData });
  }

  // Delete a hotel by ID
  deleteHotel(hotelId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${hotelId}`);
  }

  // Add a room to a specific hotel
  addRoomToHotel(hotelId: string, roomData: Omit<Room, 'hotelId'>): Observable<any> {
    console.log('Adding room to hotel:', hotelId, roomData);
    
    return this.http.get<Hotel>(`${this.apiUrl}/${hotelId}`).pipe(
      map((hotel) => {
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        hotel.rooms.push(roomData); // Add the room to the hotel's rooms array
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
        return { ...hotel, rooms: updatedRooms };
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
}
