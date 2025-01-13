import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Hotel } from '../../models/interfaces'; 
import { Amenity } from '../../models/interfaces';

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
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID for environment detection
  ) { }
  viewHotelDetails(hotel: any): void {
    this.router.navigate(['/page'], { queryParams: { id: hotel.id } });
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }

  ngOnInit(): void {
    // Check if running in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      const navigation = history.state as any; // Access browser-specific `history.state`
      this.searchResults = navigation.results || []; // Retrieve all search results
      this.formData = navigation.formData || { location: '' }; // Get search criteria from state
  
      // Check if there are no search results
      if (!this.searchResults.length && isPlatformBrowser(this.platformId)) {
        console.warn('No results found; ensure client-side navigation passed results.');
      }
  
      this.filterResults(); // Filter results based on the formData
      console.log('Navigation State:', history.state);
      console.log('Results:', history.state.results);
      console.log('Form Data:', history.state.formData);
    } else {
      console.warn('SSR environment: history.state is not accessible');
      this.searchResults = []; // Fallback for SSR
    }
  }
  
  // Add this method to your component class
  getAmenityNames(amenities: Amenity[]): string {
    if (!amenities || amenities.length === 0) {
      return 'No amenities available';
    }
    return amenities.map(a => a.name).join(', ');
  }


  private filterResults(): void {
    const { location, priceRange } = this.formData;
  
    this.filteredResults = this.searchResults.filter((hotel) => {
      const matchesLocation =
        !location ||
        hotel.city.toLowerCase() === location.toLowerCase();
  
      const matchesPrice =
        !priceRange ||
        (hotel.pricePerNight >= priceRange[0] &&
          hotel.pricePerNight <= priceRange[1]);
  
      return matchesLocation && matchesPrice;
    });
  }
  
}
