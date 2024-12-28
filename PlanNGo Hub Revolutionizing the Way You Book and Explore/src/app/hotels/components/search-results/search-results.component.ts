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
  filteredResults: Hotel[] = [];
  formData: { location: string; priceRange?: number[] } = { location: '' };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID for environment detection
  ) { }

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }

  ngOnInit(): void {
    // Check if running in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      const navigation = history.state as any; // Access browser-specific `history.state`
      this.searchResults = navigation.results || []; // Retrieve all search results
      this.formData = navigation.formData || { location: '' }; // Get search criteria from state
      this.filterResults(); // Filter results based on the formData
      console.log('Navigation State:', history.state);
      console.log('Results:', history.state.results);
      console.log('Form Data:', history.state.formData);

    } else {
      console.warn('SSR environment: history.state is not accessible');
      this.searchResults = []; // Fallback for SSR
    }
  }

  private filterResults(): void {
    const { location, priceRange } = this.formData;

    // Filter based on location and price range
    this.filteredResults = this.searchResults.filter((hotel) => {
      const matchesLocation =
        location &&
        hotel.city.toLowerCase() === location.toLowerCase();

      const matchesPrice =
        priceRange &&
        hotel.pricePerNight >= priceRange[0] &&
        hotel.pricePerNight <= priceRange[1];

      return matchesLocation && (matchesPrice || !priceRange);
    });
  }
}
