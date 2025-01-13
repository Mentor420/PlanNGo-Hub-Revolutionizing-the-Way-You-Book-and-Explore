import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  // Add a room to a hotel
  addRoomToHotel(hotelId: string, roomData: Room): Observable<any> {
    return this.http.post(`${this.apiUrl}/${hotelId}/rooms`, { room: roomData });
  }

  // Delete a room from a hotel
  deleteRoomFromHotel(hotelId: string, roomId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${hotelId}/rooms/${roomId}`);
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
