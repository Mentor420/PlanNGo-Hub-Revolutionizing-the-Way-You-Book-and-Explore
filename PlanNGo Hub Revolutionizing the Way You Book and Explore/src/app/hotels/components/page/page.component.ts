import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HotelSearchService } from '../../services/hotel-search.service'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';

interface Amenity {
  id: string; // Unique identifier for the amenity
  name: string; // Name of the amenity
  description?: string; // Optional description of the amenity
  icon: string; // FontAwesome or custom icon class (for displaying icons)
  available: boolean; // Availability status of the amenity
}

interface Hotel {
  id: string;
  city: string;
  name: string;
  pricePerNight: number;
  roomsAvailable: number;
  amenities: Amenity[]; // Array of amenities with detailed structure
  rating: number; // Average rating
  reviewsCount: number; // Total number of reviews
  checkin: string;
  checkout: string;
  rules: string[]; // List of hotel rules
  location: string; // Google Maps embed URL
  images: string[]; // Array to hold image URLs
  bookings: { // Array of booking details
    checkInDate: string;
    checkOutDate: string;
    roomsBooked: number;
  }[];
  ratings: { 
    averageRating: number;
    ratingsCount: number;
    ratingBreakdown: { [key: number]: number }; // Number of reviews for each rating (1 to 5 stars)
  };
}


@Component({
  standalone: true,
  imports: [CommonModule, RatingComponent],
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnInit {
  hotelDetails: Hotel | null = null;
  hotelId: string | null = null;
  currentPage: number = 1;
  imagesPerPage: number = 4;
  error: string | null = null;
  safeMapUrl: SafeResourceUrl | null = null; // Safe URL for the iframe

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelSearchService, // Inject the service here
    private sanitizer: DomSanitizer, // Add DomSanitizer
    @Inject(PLATFORM_ID) private platformId: Object, // Detect SSR/browser
    private location: Location
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe((params) => {
        const hotelId = params['id'];
        if (hotelId) {
          this.hotelId = hotelId; 
          this.fetchHotelDetails(hotelId);
        } else {
          this.error = 'Hotel ID not provided in the URL.';
        }
      });
    } else {
      console.warn('SSR environment: Skipping browser-specific logic.');
    }
  }

  goBack(): void {
    this.location.back();
  }

  private fetchHotelDetails(hotelId: string): void {
    this.hotelService.getHotelDetails(hotelId).subscribe(
      (data) => {
        this.hotelDetails = data; // Use the API response
        this.updateMapUrl(); // Update map URL after fetching details
      },
      (err) => {
        this.error = 'Error fetching hotel data from the backend.';
      }
    );
    if (!this.hotelDetails) {
      this.error = 'Hotel not found.';
    }
  }

  private updateMapUrl(): void {
    if (this.hotelDetails?.location) {
      const mapUrl = `${this.hotelDetails.location}`;
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl); // Use sanitizer
    }
  }

  // Calculate total pages based on images available
  get totalPages(): number {
    if (!this.hotelDetails) return 0;
    return Math.ceil((this.hotelDetails.images.length - 1) / this.imagesPerPage);
  }

  // Get images to display on the current page (except the first image)
  getImagesForPage(): string[] {
    if (!this.hotelDetails) return [];
    const startIndex = (this.currentPage - 1) * this.imagesPerPage + 1;
    const endIndex = Math.min(startIndex + this.imagesPerPage, this.hotelDetails.images.length);
    return this.hotelDetails.images.slice(startIndex, endIndex);
  }

  // Navigate to the previous page of images
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Navigate to the next page of images
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
