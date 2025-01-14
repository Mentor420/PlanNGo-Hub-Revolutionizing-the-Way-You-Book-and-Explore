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
    this.router.navigate([`/room/${roomId}/booking-form`], { queryParams: 
      { 
        hotelId,
        roomId, 
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        roomCount: this.roomCount 
      } 
    });
  }

  applyFilter() {
    if (!this.checkInDate || !this.checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if(this.checkInDate > this.checkOutDate){
      alert("Check-in date cannot be greater than check-out date.");
      return;
    }
  
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
  
    this.rooms = this.hotel.rooms.filter((room: Room) => {
      // Check if there are enough available rooms
      if (room.availableRooms < this.roomCount) {
        return false;
      }
  
      // Check if the room is booked for the selected date range
      const isBooked = this.hotel.bookings.some((booking: Booking) => {
        return (
          booking.roomId === room.roomId &&
          ((new Date(booking.checkInDate) <= checkOut &&
            new Date(booking.checkOutDate) >= checkIn))
        );
      });
  
      return !isBooked; // Include the room only if it's not booked
    });
  } 
}
