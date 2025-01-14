import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { HotelSearchService } from '../../services/hotel-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../services/rating.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  hotel: any = {};
  hotelId: string = '';
  roomId: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  roomsBooked: number = 1;
  roomDetails: any = {};
  TotalAmenities: any[] = [];
  isPopupVisible = false;
  popupTitle = '';
  popupMessage = '';

  bookingForm!: FormGroup;
  taxRate = 240;

  constructor(
    private route: ActivatedRoute,
    private hotelSearchService: HotelSearchService,
    private ratingService: RatingService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const hotelId = params['hotelId'];
      const roomId = params['roomId'];
      this.checkInDate = params['checkInDate'];
      this.checkOutDate = params['checkOutDate'];
      this.roomsBooked = params['roomCount'];
      if (hotelId && roomId) {
        this.hotelSearchService.getHotelDetails(hotelId).subscribe(
          (hotel) => {
            this.hotel = hotel;
            this.roomDetails = hotel.rooms.find((room: any) => room.roomId === roomId);
            // Merge amenities and room benefits
            this.mergeAmenities();
          },
          (error) => {
            console.error('Error fetching hotel data:', error);
          }
        );
      }
    });
    this.bookingForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      idProof: ['', Validators.required],
      couponCode: [''],
    });
  }

  mergeAmenities(): void {
    if (this.hotel?.amenities) {
      const roomBenefits = Array.isArray(this.roomDetails?.benefits)
        ? this.roomDetails.benefits.map((benefit: string) => ({
            name: benefit,
            type: 'Room Benefit',
          }))
        : []; // Use an empty array if benefits is not an array
  
      const hotelAmenities = Array.isArray(this.hotel.amenities)
        ? this.hotel.amenities.map((amenity: any) => ({
            name: amenity.name,
            description: amenity.description,
            type: 'Hotel Amenity',
          }))
        : []; // Use an empty array if amenities is not an array
  
      this.TotalAmenities = [...roomBenefits, ...hotelAmenities];
    } else {
      this.TotalAmenities = Array.isArray(this.roomDetails?.benefits)
        ? this.roomDetails.benefits.map((benefit: string) => ({
            name: benefit,
            type: 'Room Benefit',
          }))
        : []; // Use only room benefits if amenities are missing
    }
  }
  

  get total(): number {
    return this.roomDetails.pricePerNight + this.taxRate;
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      console.log(this.bookingForm.value);
      const bookingData = {
        userId: 'u001', // Replace with the actual user ID
        hotelId: this.hotel.id,
        roomId: this.roomDetails.roomId,
        ...this.bookingForm.value,
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        bookingDate: new Date().toISOString(), // Add booking date
        roomBooked: this.roomsBooked,
        price: this.total,
        status: 'Booked',
      };

      // Simulate an API call to save booking
      this.hotelSearchService.saveBooking(this.hotel.id, bookingData).subscribe(
        (response) => {
          console.log('Booking successful:', response);

          // Show success popup
          this.showPopup('Booking Successful! Your room has been booked successfully.', 'success');

          // Reset the form
          this.bookingForm.reset();

          setTimeout(() => {
            this.isPopupVisible = false; // Hide the popup earlier if needed
          }, 2000); // Hide popup in 2 seconds

          setTimeout(() => {
            this.zone.run(() => {
              this.router.navigate(['/booking-history'], { queryParams: { bookingId: response.id } });
            });
          }, 3000); // Navigate in 3 seconds

        },
        (error) => {
          console.error('Error saving booking:', error);
          console.log('Form Validation Status:', this.bookingForm.status);
          console.log('Full Name Valid:', this.bookingForm.get('fullName')?.valid);
          console.log('Email Valid:', this.bookingForm.get('email')?.valid);
          console.log('Mobile Valid:', this.bookingForm.get('mobile')?.valid);
          console.log('ID Proof Valid:', this.bookingForm.get('idProof')?.valid);

          // Show error popup
          this.showPopup('Booking Failed! Please try again later.', 'error');

          // Redirect after 3 seconds (optional for error)
          setTimeout(() => {
            this.bookingForm.reset();
          }, 3000);
        }
      );
    } else {
      console.log('Form Validation Status:', this.bookingForm.status);
      console.log('Full Name Valid:', this.bookingForm.get('fullName')?.valid);
      console.log('Email Valid:', this.bookingForm.get('email')?.valid);
      console.log('Mobile Valid:', this.bookingForm.get('mobile')?.valid);
      console.log('ID Proof Valid:', this.bookingForm.get('idProof')?.valid);
      console.log('Errors:', this.bookingForm.errors);

      console.log('Form is invalid:', this.bookingForm.errors);
    }
  }

  // Utility method to show popup
  showPopup(title: string, message: string): void {
    this.popupTitle = title;
    this.popupMessage = message;
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  onCancelBooking(bookingId: string): void {
    // Simulate an API call to cancel booking
    this.hotelSearchService.cancelBooking(bookingId).subscribe(
      (response) => {
        console.log('Booking canceled:', response);
        alert('Booking canceled successfully!');
      },
      (error) => {
        console.error('Error canceling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    );
  }

  applyCoupon(): void {
    const couponCode = this.bookingForm.get('couponCode')?.value;
    if (couponCode) {
      // Handle coupon application logic
      console.log('Applying coupon:', couponCode);
    }
  }

  getStars(rating: number) {
    return this.ratingService.getStarArray(rating);
  }
}