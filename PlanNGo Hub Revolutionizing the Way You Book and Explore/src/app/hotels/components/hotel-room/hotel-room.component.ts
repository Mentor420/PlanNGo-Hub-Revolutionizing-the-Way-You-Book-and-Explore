import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotelSearchService } from './../../services/hotel-search.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { HotelIdService } from '../../services/hotel-id.service';
import { Booking, Room } from '../../models/interfaces'; 
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-hotel-room',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hotel-room.component.html',
  styleUrls: ['./hotel-room.component.css']
})

export class HotelRoomComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<any>();
  hotel: any = {}; // To hold hotel details
  rooms: Room[] = []; // To hold available rooms
  checkInDate: string = '';
  checkOutDate: string = '';
  roomCount: number = 1;
  showrooms: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private hotelSearchService: HotelSearchService,
    private hotelIdService: HotelIdService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.checkInDate = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.checkOutDate = tomorrow.toISOString().split('T')[0];

    this.route.queryParams.subscribe((params) => {
      const hotelId = params['hotelId'];
      this.hotelIdService.setHotelId(hotelId);
      console.log('Hotel ID:', hotelId);
      if (hotelId) {
        this.hotelSearchService.getHotelDetails(hotelId).subscribe(
          (hotel) => {
            this.hotel = hotel;
            this.rooms = hotel.rooms;
            this.applyFilter(); // Apply the filter with current data
          },
          (error) => {
            console.error('Error fetching hotel data:', error);
          }
        );
      }
    });
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }

  goToPage(hotelId: string, roomId: string): void {
    console.log('Hotel ID:', hotelId);
    console.log('Room ID:', roomId);
    this.hotelIdService.setHotelId(hotelId);

    console.log({ hotelId, roomId, checkInDate: this.checkInDate, checkOutDate: this.checkOutDate, roomCount: this.roomCount });

    this.hotelIdService.setBookingData({
      hotelId,
      roomId,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      roomCount: this.roomCount,
    });
    this.router.navigate([`/hotel/room/${roomId}/booking-form`]);
  }

  applyFilter() {
    if (!this.checkInDate || !this.checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }
  
    if (this.checkInDate > this.checkOutDate) {
      alert("Check-in date cannot be greater than check-out date.");
      return;
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
  
    // Check if the check-in or check-out date is before today's date
    if (checkIn < today || checkOut < today) {
      alert("Dates must be today or a future date. Please select valid dates.");
      this.showrooms = false;
      return;
    }else{
      this.showrooms = true;
    }

    if (this.showrooms == true) {

      // Filter rooms based on availability and booking overlap
      this.rooms = this.hotel.rooms.filter((room: Room) => {
        const totalAvailableRooms = room.availableRooms;
    
        // Check if the room has enough available rooms
        if (totalAvailableRooms < this.roomCount) {
          return false; // Not enough rooms available
        }
    
        // Check if there are any overlapping bookings for this room
        const isRoomBooked = this.hotel.bookings.some((booking: Booking) => {
          const bookingStart = new Date(booking.checkInDate);
          const bookingEnd = new Date(booking.checkOutDate);
    
          // Check if the booking overlaps with the requested check-in and check-out dates
          return (
            booking.roomId === room.roomId &&
            !(checkOut <= bookingStart || checkIn >= bookingEnd) // No overlap condition
          );
        });
    
        if (isRoomBooked) {
          // If the room is booked for the requested dates, we need to calculate the remaining available rooms
          const overlappingBookings = this.hotel.bookings.filter((booking: Booking) => {
            const bookingStart = new Date(booking.checkInDate);
            const bookingEnd = new Date(booking.checkOutDate);
            
            // Filter bookings that overlap with the requested dates
            return (
              booking.roomId === room.roomId &&
              !(checkOut <= bookingStart || checkIn >= bookingEnd) // Overlap condition
            );
          });
    
          const totalBookedRooms = overlappingBookings.reduce(
            (sum: number, booking: Booking) => sum + booking.roomBooked,
            0
          );
    
          // Calculate the remaining rooms after the bookings
          const remainingRooms = totalAvailableRooms - totalBookedRooms;
    
          // If there are enough remaining rooms, include this room in the filtered results
          return remainingRooms >= this.roomCount;
        }
    
        // If the room is not booked for the requested dates, include it in the result
        return true;
      });
    }
  }
   
}
