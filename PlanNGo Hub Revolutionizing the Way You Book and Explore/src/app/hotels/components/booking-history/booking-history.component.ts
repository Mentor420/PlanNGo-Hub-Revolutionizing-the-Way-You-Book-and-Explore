import { Component, OnInit } from '@angular/core';
import { HotelSearchService } from '../../services/hotel-search.service';
import { CommonModule, Location } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { FormatDatePipe } from '../pipe/format-date.pipe';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookingHistory: any[] = [];
  isLoading = true;
  popupTitle = '';
  popupMessage = '';
  isPopupVisible = false;
  confirmCallback: (() => void) | null = null;

  constructor(private hotelSearchService: HotelSearchService, private location: Location) { }

  ngOnInit(): void {
    this.loadBookingHistory();
  }

  goBack(): void {
    this.location.back();
  }

  loadBookingHistory(): void {
    const userId = 'u001'; // Replace with dynamic user ID
    this.isLoading = true;
    this.hotelSearchService.getUserBookings(userId).subscribe(
      (bookings) => {
        const bookingRequests = bookings.map((booking) =>
          this.hotelSearchService.getHotelDetails(booking.hotelId).pipe(
            map((hotelDetails) => {
              // Find the room details for the current booking
              const roomDetails = hotelDetails.rooms.find((room:{ roomId: string }) => room.roomId === booking.roomId);
  
              return {
                ...booking,
                hotelImage: hotelDetails.images[0],
                hotelName: hotelDetails.name, 
                hotelLocation: hotelDetails.location, 
                roomDetails: roomDetails, 
              };
            })
          )
        );
  
        // Combine all hotel detail requests
        forkJoin(bookingRequests).subscribe(
          (updatedBookings) => {
            this.bookingHistory = updatedBookings;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching hotel details:', error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching booking history:', error);
        this.isLoading = false;
      }
    );
  }
  

  onCancelBooking(bookingId: string): void {
    // Show confirmation popup for cancellation
    this.showPopup('Are you sure you want to cancel this booking?', 'warning', () => {
      // Callback for confirming the cancellation
      this.hotelSearchService.cancelBooking(bookingId).subscribe(
        () => {
          this.loadBookingHistory();
          this.showPopup('Booking canceled successfully.', 'success');
        },
        (error) => {
          console.error('Error canceling booking:', error);
          this.showPopup('Error canceling booking. Please try again.', 'error');
        }
      );
    });
  }
  
  // Utility method to show popup
  showPopup(title: string, message: string, confirmCallback?: () => void): void {
    this.popupTitle = title;
    this.popupMessage = message;
    this.isPopupVisible = true;
    // Store the confirmation callback if it's provided
    this.confirmCallback = confirmCallback || null;
  }
  
  closePopup(): void {
    this.isPopupVisible = false;
    // If a confirm callback was set and the popup is being closed, call it
    if (this.confirmCallback) {
      this.confirmCallback();
      this.confirmCallback = null; // Reset the callback after execution
    }
  }
  
}

