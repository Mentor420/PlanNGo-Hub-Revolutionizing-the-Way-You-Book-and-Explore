import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Amenity {
  id: string;
  name: string;
  description?: string;
  icon: string;
  available: boolean;
}

interface Room {
  roomId: string;
  type: string;
  description: string;
  pricePerNight: number;
  benefits: string[];
  availableRooms: number;
  images: string[];
}

interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  fullName: string;
  email: string;
  mobile: string;
  idProof: string;
  couponCode: string;
  checkInDate: string;
  checkOutDate: string;
  bookingDate: string;
  roomBooked: number;
  price: number;
  status: string;
}

interface Ratings {
  averageRating: number;
  ratingsCount: number;
  ratingBreakdown: { [key: number]: number };
}

interface BankOffer {
  discount: number;
  details: string;
}

interface Hotel {
  id: string;
  city: string;
  name: string;
  description: string;
  pricePerNight: number;
  roomsAvailable: number;
  rooms: Room[];
  amenities: Amenity[];
  rating: number;
  reviewsCount: number;
  checkin: string;
  checkout: string;
  rules: string[];
  location: string;
  images: string[];
  bookings: Booking[];
  ratings: Ratings;
  bankOffer: BankOffer[];
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

  // Get all bookings
  getRecentBookings(): Observable<any> {
    return this.getAllHotels().pipe(
      map((data) => data.flatMap((hotel) => hotel.bookings) || [])
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
  getAllRooms(): Observable<Room[]> {
    return this.getAllHotels().pipe(
      map((hotels) => hotels.flatMap((hotel) => hotel.rooms))
    );
  }
}
