import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HotelSearchService } from '../../services/hotel-search.service';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { catchError, forkJoin, map } from 'rxjs';
import { FormatDatePipe } from '../pipe/format-date.pipe';
import { Booking, User } from '../../models/interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, FormatDatePipe, FormsModule],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookingHistory: any[] = [];
  isLoading = false;
  popupTitle = '';
  popupMessage = '';
  isPopupVisible = false;
  isConfirmVisible = true;
  isreview = true;
  selectedBooking: Booking | null = null;
  confirmCallback: (() => void) | null = null;
  showReviewPopup = false;
  reviewBooking: Booking | null = null;
  reviewClosedBookings: Set<string> = new Set();  // Set to track closed bookings by their ID
  reviewRating = 0;
  reviewComment = '';
  author = '';
  nameError = '';
  commentError = '';
  cancelledDueToRoomDeletion: { [key: string]: boolean } = {}
  userId: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private hotelSearchService: HotelSearchService, private location: Location) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Load previously closed bookings from localStorage
      const closedBookings = JSON.parse(localStorage.getItem('closedBookings') || '[]');
      this.reviewClosedBookings = new Set(closedBookings);

      try {
        // Check user and fetch data
        this.checkUserAndInitializeUser().then(() => {
          // console.log('User ID:', this.userId);
          if (this.userId) {
            this.loadBookingHistory();
          }
        });
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    }
  }

  // Function to check the user's role and email, and initialize user
  async checkUserAndInitializeUser(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');

        if (role === 'Customer' && email) {
          const userId = this.generateUniqueUserId(email);

          // Use toPromise to wait for the response from getUsers
          const users = await this.hotelSearchService.getUsers().toPromise();

          if (users) {
            const existingUsers = users.find((user) => user.user_id === userId);

            if (!existingUsers) {
              // Add new user to the backend
              const newUser: User = {
                user_id: userId,
                name: `User for ${email}`, // Adjust naming convention as needed
              };

              await this.hotelSearchService.addUser(newUser).toPromise();
              console.log('New user added:', newUser);
            } else {
              console.log('User already exists:', existingUsers);
            }

            // Set the userId to be used throughout the component
            this.userId = userId;
            // console.log('User ID initialized:', this.providerId);
          } else {
            console.error('Failed to fetch users: Data is undefined.');
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to initialize provider:', error.message);
      throw new Error('Failed to initialize provider: ' + error.message);
    }
  }

  // Generate a unique user ID using the email
  generateUniqueUserId(email: string): string {
    // Simple hash function to create a unique user ID
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = (hash << 5) - hash + email.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return `User${Math.abs(hash)}`; // Ensure positive ID
  }

  goBack(): void {
    this.location.back();
  }

  loadBookingHistory(): void {
    // console.log('Loading booking history for user:', this.userId);
    const userId = this.userId;
    this.isLoading = true;
    this.hotelSearchService.getUserBookings(userId).subscribe(
      (bookings) => {
        const bookingRequests = bookings.map((booking) =>
          this.hotelSearchService.getHotelDetails(booking.hotelId).pipe(
            map((hotelDetails) => {
              // Find the room details for the current booking
              const roomDetails = hotelDetails.rooms.find((room: { roomId: string }) => room.roomId === booking.roomId) || { type: "Room details unavailable", status: "Deleted" };

              // Check if the booking was cancelled due to room deletion
              this.cancelledDueToRoomDeletion[booking.id] = booking.status === "Cancelled" && roomDetails.status === "Deleted";

              console.log('Room details:', this.cancelledDueToRoomDeletion);

              // Check and update status based on checkout date
              const currentDate = new Date();
              const checkOutDate = new Date(booking.checkOutDate);

              if (currentDate > checkOutDate && booking.status == 'Booked') {
                // If the checkout date has passed, update the booking status to Completed
                this.hotelSearchService.updateBookingStatusAndAvailability(booking.id, 'Completed',booking.hotelId,
                  booking.roomId,
                  booking.roomBooked).subscribe(() => {
                  console.log('Booking status updated to Completed:', booking.id);
                }, (error) => {
                  console.error('Error updating booking status:', error);
                });
              }

              return {
                ...booking,
                hotelImage: hotelDetails.images[0],
                hotelName: hotelDetails.name,
                hotelLocation: hotelDetails.location,
                roomDetails: roomDetails,
              };
            }),
            catchError(() => {
              // Return fallback booking data if fetching hotel details fails
              return [
                {
                  ...booking,
                  hotelName: "Unknown Hotel",
                  roomDetails: { type: "Room details unavailable" },
                },
              ];
            })
          )
        );

        // Combine all hotel detail requests
        forkJoin(bookingRequests).subscribe(
          (updatedBookings) => {
            // Sort bookings in descending order by bookingDate
            this.bookingHistory = updatedBookings.sort(
              (a: any, b: any) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
            );
            this.isLoading = false;
            this.checkForCompletedBookings();
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

  checkForCompletedBookings(): void {
    const completedBooking = this.bookingHistory.find(booking =>
      booking.status === 'Completed' && 
      booking.reviewSubmitted !== 'Rejected' && 
      !booking.reviewSubmitted // Ensures it only opens for unsubmitted reviews
    );
    if (completedBooking) {
      this.openReviewPopup(completedBooking);
    }
  }

  openReviewPopup(booking: Booking): void {
    if (!this.reviewClosedBookings.has(booking.id)) {
      this.reviewBooking = booking;
      this.showReviewPopup = true;
    }
  }

  closeReviewPopup(): void {
    if (this.reviewBooking) {
      this.hotelSearchService.cancelBookingReview(this.reviewBooking.id).subscribe(
        () => {
          console.log('Booking review cancelled successfully.');
        },
        (error) => {
         console.error('Error cancelling booking review:', error);
        }
      );
    }
    this.showReviewPopup = false;
    this.reviewBooking = null;
    this.author = '';
    this.reviewRating = 0;
    this.reviewComment = '';
    this.ngOnInit();
  }

  submitReview(): void {
    // Reset error messages
    this.nameError = '';
    this.commentError = '';

    // Validate the fields
    let isValid = true;

    if (!this.author.trim()) {
      this.nameError = 'Name is required.';
      isValid = false;
    }

    if (!this.reviewComment.trim()) {
      this.commentError = 'Comment is required.';
      isValid = false;
    }

    // If any field is invalid, stop the submission
    if (!isValid) {
      return;
    }

    if (this.reviewBooking) {
      const reviewData = {
        hotelId: this.reviewBooking.hotelId,
        bookingId: this.reviewBooking.id,
        author: this.author.trim() || 'Anonymous',
        rating: this.reviewRating,
        comment: this.reviewComment.trim(),
        date: new Date().toISOString(),
      };

      this.hotelSearchService.submitReview(reviewData).subscribe(
        (updatedRatings) => {
          this.closeReviewPopup();
          this.isreview = false;
          this.showPopup('Review submitted successfully', 'success');
          this.ngOnInit();
        },
        (error) => {
          this.isreview = false;
          console.error('Error submitting review:', error);
          this.showPopup('Error submitting review. Please try again.', 'error');
        }
      );
    }
  }

  onCancelBooking(bookingId: string): void {
    // Show confirmation popup for cancellation
    this.isConfirmVisible = true;
    this.isreview = true;
    this.showPopup('Are you sure you want to cancel this booking?', 'warning', () => {
      // Callback for confirming the cancellation
      this.hotelSearchService.cancelBooking(bookingId).subscribe(
        () => {
          this.loadBookingHistory();
          this.isConfirmVisible = false;
          this.isreview = false;
          this.showPopup('Booking cancelled successfully.', 'success');
        },
        (error) => {
          console.error('Error canceling booking:', error);
          this.isConfirmVisible = false;
          this.isreview = false;
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
  }

  confirmAction(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
      this.closePopup();
      this.confirmCallback = null; // Reset the callback after execution
    }
  }

  setSelectedBooking(booking: Booking): void {
    this.selectedBooking = booking;
  }

  clearSelectedBooking(): void {
    this.selectedBooking = null;
  }
}

