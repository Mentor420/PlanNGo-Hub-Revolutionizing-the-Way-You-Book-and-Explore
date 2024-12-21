import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';

interface Hotel {
  id: string;
  city: string;
  name: string;
  pricePerNight: number;
  roomsAvailable: number;
  amenities: string[];
  image: string; // Add image property
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  searchResults: Hotel[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID for environment detection
  ) {}

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }

  ngOnInit(): void {
    // Check if running in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      const navigation = history.state as any; // Access browser-specific `history.state`
      this.searchResults = navigation.results || []; // Fallback to empty array if no results
    } else {
      console.warn('SSR environment: history.state is not accessible');
      this.searchResults = []; // Fallback for SSR
    }
  }
}