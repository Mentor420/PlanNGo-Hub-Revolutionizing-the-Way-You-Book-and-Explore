import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelSearchService } from '../../services/hotel-search.service';

interface Hotel {
  id: string;
  city: string;
  name: string;
  pricePerNight: number;
  roomsAvailable: number;
  checkInDate: string;
  checkOutDate: string;
  amenities: string[];
}

@Component({
  standalone: true,
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html', // External HTML file
  styleUrls: ['./search-bar.component.css'], // External CSS file
})
export class SearchBarComponent {
  formData = {
    location: '',
    checkInDate: '',
    checkOutDate: '',
    rooms: 1,
    price: '',
  };

  searchResults: Hotel[] = [];
  selectedAmenities: string[] = [];
  amenitiesOptions: string[] = ['WiFi', 'Pool', 'Parking', 'Breakfast']; // Sample amenity options
  errorMessage: string = ''; // To store error messages

  constructor(private hotelSearchService: HotelSearchService, private router: Router) { }

  // Handle amenity selection
  updateAmenities(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedAmenities.push(target.value); // Add selected amenity
    } else {
      this.selectedAmenities = this.selectedAmenities.filter(
        (amenity) => amenity !== target.value
      ); // Remove unselected amenity
    }
    console.log('Selected amenities:', this.selectedAmenities);
  }

  // Function to validate form inputs
  isValidInput(): boolean {
    const { location, checkInDate, checkOutDate } = this.formData;

    if (!location.trim()) {
      this.setErrorMessage('Location (City) is required.');
      return false;
    }

    if (!checkInDate.trim() || !checkOutDate.trim()) {
      this.setErrorMessage('Both check-in and check-out dates are required.');
      return false;
    }

    if (new Date(checkInDate) > new Date(checkOutDate)) {
      this.setErrorMessage('Check-out date cannot be earlier than the check-in date.');
      return false;
    }

    this.errorMessage = ''; // Reset error message if validation passes
    return true;
  }

  // Function to set error messages for validation
  setErrorMessage(message: string) {
    this.errorMessage = message;
    // setTimeout(() => {
    //   this.errorMessage = ''; // Clear the error after 5 seconds
    // }, 5000);
  }

  onSearch() {
    if (!this.isValidInput()) {
      return; // Prevent further execution if inputs are invalid
    }
    const { location, checkInDate, checkOutDate, rooms, price } = this.formData;
    const priceRange = price ? price.split('-').map(Number) : undefined;

    this.hotelSearchService
      .searchHotels(
        location,
        checkInDate,
        checkOutDate,
        rooms,
        priceRange,
        this.selectedAmenities
      )
      .subscribe(
        (results: Hotel[]) => {
          // Filter results based on checkInDate and checkOutDate ranges
          const filteredResults = this.filterResults(results, checkInDate, checkOutDate);
          this.searchResults = filteredResults;

          // If no results match, display an error message
          if (!this.searchResults.length) {
            this.setErrorMessage('No hotels match your search criteria.');
          }

          console.log('Search Results:', filteredResults);
          this.router.navigate(['/search-results'], { state: { results: filteredResults } });;
        },
        (error) => {
          console.error('Error fetching hotels:', error);
          this.setErrorMessage('An error occurred while fetching hotels. Please try again later.');
        }
      );
  }
  // Apply both date range filter and amenities filter (if selected)
  private filterResults(hotels: Hotel[], checkInDate: string, checkOutDate: string): Hotel[] {
    // Filter based on the date range
    const dateFilteredHotels = this.filterByDateRange(hotels, checkInDate, checkOutDate);

    // If no amenities are selected, just return the date-filtered hotels
    if (this.selectedAmenities.length === 0) {
      return dateFilteredHotels;
    }

    // If amenities are selected, filter further based on those amenities
    return dateFilteredHotels.filter(hotel => {
      // Ensure all selected amenities are present in the hotel's amenities
      return this.selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
    });
  }

  // Filter the hotels by checkInDate and checkOutDate ranges
  private filterByDateRange(
    hotels: Hotel[],
    checkInDate: string,
    checkOutDate: string
  ): Hotel[] {
    return hotels.filter((hotel) => {
      const hotelCheckInDate = new Date(hotel.checkInDate);
      const hotelCheckOutDate = new Date(hotel.checkOutDate);

      const userCheckInDate = new Date(checkInDate);
      const userCheckOutDate = new Date(checkOutDate);

      // Check if the hotel's check-in date and check-out date are within the user-provided range
      return (
        hotelCheckInDate >= userCheckInDate &&
        hotelCheckOutDate <= userCheckOutDate
      );
    });
  }
}