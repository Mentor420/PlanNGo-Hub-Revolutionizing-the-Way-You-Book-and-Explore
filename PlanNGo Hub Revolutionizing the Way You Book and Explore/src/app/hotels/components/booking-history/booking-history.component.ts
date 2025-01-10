import { Component, OnInit } from '@angular/core';
import { HotelSearchService } from '../../services/hotel-search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent implements OnInit {
  bookingHistory: any[] = [];

  constructor(private hotelSearchService: HotelSearchService) {}

  ngOnInit(): void {
    this.loadBookingHistory();
  }

  loadBookingHistory(): void {
    const userId = 'u001'; // Replace with dynamic user ID
    this.hotelSearchService.getUserBookings(userId).subscribe(
      (bookings) => {
        this.bookingHistory = bookings;
      },
      (error) => {
        console.error('Error fetching booking history:', error);
      }
    );
  }

  onCancelBooking(bookingId: string): void {
    this.hotelSearchService.cancelBooking(bookingId).subscribe(
      (response) => {
        console.log('Booking canceled successfully:', response);
        alert('Booking canceled successfully!');
        this.loadBookingHistory();
      },
      (error) => {
        console.error('Error canceling booking:', error);
      }
    );
  }
  
}
