import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { HotelSearchService } from '../../services/hotel-search.service';
import { ActivatedRoute } from '@angular/router';
import { RatingService } from '../../services/rating.service';

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
  roomDetails: any = {};
  TotalAmenities: any[] = [];

  bookingForm!: FormGroup;
  taxRate = 240;
  
  constructor(
    private route: ActivatedRoute, 
    private hotelSearchService: HotelSearchService,
    private ratingService: RatingService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const hotelId = params['hotelId'];
      const roomId = params['roomId'];
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
    if (this.roomDetails && this.hotel.amenities) {
      // Combine room benefits and hotel amenities into a single list
      const roomBenefits = this.roomDetails.benefits.map((benefit: string) => ({
        name: benefit,
        type: 'Room Benefit',
      }));
  
      const hotelAmenities = this.hotel.amenities.map((amenity: any) => ({
        name: amenity.name,
        description: amenity.description,
        type: 'Hotel Amenity',
      }));
  
      this.TotalAmenities = [...roomBenefits, ...hotelAmenities];
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
    }
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