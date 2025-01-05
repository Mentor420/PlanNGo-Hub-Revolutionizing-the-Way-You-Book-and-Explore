import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HotelSearchService } from '../../services/hotel-search.service'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';
import { Router } from '@angular/router';

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
  description: string;
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
  bankOffer: {
    discount: number;
    details: string;
  }[];
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
  currentIndex = 0; // Track the current image index
  transformStyle = 'translateX(0%)'; // Used to move the carousel left/right
  transitionStyle = 'transform 0.5s ease-in-out'; // Smooth transition
  currentPage: number = 1;
  imagesPerPage: number = 4;
  rotatingImages: string[] = [];
  rotationInterval: any;
  error: string | null = null;
  safeMapUrl: SafeResourceUrl | null = null; // Safe URL for the iframe

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelSearchService, // Inject the service here
    private sanitizer: DomSanitizer, // Add DomSanitizer
    @Inject(PLATFORM_ID) private platformId: Object, // Detect SSR/browser
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Scroll to the top of the page
      window.scrollTo(0, 0);
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

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
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
        this.initializeRotatingImages();
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

  private initializeRotatingImages(): void {
    if (this.hotelDetails?.images) {
      // Clone the images array for rotation
      this.rotatingImages = [...this.hotelDetails.images];

      // Set up interval for rotating images
      this.rotationInterval = setInterval(() => {
        const firstImage = this.rotatingImages.shift();
        if (firstImage) {
          this.rotatingImages.push(firstImage);
        }
      }, 4000); // Rotate every 4 second
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

  nextImage() {
    // Prepare the next index
    const nextIndex = this.currentIndex + 1 < this.rotatingImages.length ? this.currentIndex + 1 : 0;
    this.updateTransform(nextIndex);
    this.currentIndex = nextIndex; // Update currentIndex after transition starts
  }

  prevImage() {
    // Prepare the previous index
    const prevIndex = this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : this.rotatingImages.length - 1;
    this.updateTransform(prevIndex);
    this.currentIndex = prevIndex; // Update currentIndex after transition starts
  }

  private updateTransform(nextIndex: number) {
    this.transitionStyle = 'transform 0.5s ease-in-out'; // Ensures smooth transition
    // Move the images based on the index (using percentage for the width of each image)
    this.transformStyle = `translateX(-${nextIndex * 100}%)`; // Shift images horizontally
  }

  goToPage() {
    this.router.navigate(['/booking-form']); 
  }

}
