import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import data from '../../models/db.json'; 
import { Location } from '@angular/common';


interface Hotel {
  id: string;
  city: string;
  name: string;
  pricePerNight: number;
  roomsAvailable: number;
  amenities: string[];
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})

export class PageComponent implements OnInit {
  hotelDetails: Hotel | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object, // Detect SSR/browser
    private location: Location
  ) {}

  ngOnInit(): void {
    // Check if it's running in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe((params) => {
        const hotelId = params['id'];
        if (hotelId) {
          this.fetchHotelDetails(hotelId);
        } else {
          this.error = 'Hotel ID not provided in the URL.';
        }
      });
    } else {
      console.warn('SSR environment: Skipping browser-specific logic.');
    }
  }

  
  // Navigate back to the previous page
  goBack(): void {
    this.location.back();
  }

  private fetchHotelDetails(hotelId: string): void {
    const hotels: Hotel[] = data.hotels; // Access the JSON data
    this.hotelDetails = hotels.find((hotel) => hotel.id === hotelId) || null;

    if (!this.hotelDetails) {
      this.error = 'Hotel not found.';
    }
  }
}
