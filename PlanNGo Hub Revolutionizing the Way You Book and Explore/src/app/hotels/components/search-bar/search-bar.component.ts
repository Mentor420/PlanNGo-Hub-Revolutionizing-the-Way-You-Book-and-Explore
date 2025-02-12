import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelSearchService } from '../../services/hotel-search.service';
import { Hotel } from '../../models/interfaces';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  formData: {
    location: string;
    checkInDate: string;
    checkOutDate: string;
    rooms: number;
    price: string;
    amenities: string[]; // Explicitly specify the type as an array of strings
  } = {
    location: '',
    checkInDate: '',
    checkOutDate: '',
    rooms: 1,
    price: '',
    amenities: [],
  };  

  searchResults: Hotel[] = [];
  selectedAmenities: string[] = [];
  amenitiesOptions: string[] = ['Wi-Fi', 'Pool', 'Parking', 'Breakfast', 'Gym', 'Spa', 'Airport Shuttle', 'Business Center', 'Pet-Friendly'];
  errorMessage: string = '';
  hasSearched: boolean = false;

  constructor(private hotelSearchService: HotelSearchService, private router: Router, private ngZone: NgZone
  ) { }

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
  }

  onSearch(): void {
    if (!this.isValidInput()) {
      return; // Exit early if inputs are invalid
    }

    const location = this.formData.location.charAt(0).toUpperCase() + this.formData.location.slice(1).toLowerCase();
    this.formData.location = location;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(this.formData.checkInDate);
    const checkOutDate = new Date(this.formData.checkOutDate);
    const { rooms, price } = this.formData;

    // Check if the check-in or check-out date is before today's date
    if (checkInDate < today || checkOutDate < today) {
      alert("Dates must be today or a future date. Please select valid dates.");
      return;
    }

    const priceRange = price
      ? price.split('-').map((val) => {
        const num = Number(val.trim());
        return isNaN(num) ? 0 : num;
      })
      : undefined;

    if (priceRange && priceRange.some((num) => num < 0)) {
      this.setErrorMessage('Invalid price range. Use format: min-max');
      return; // Exit early if the price range is invalid
    }

     // Convert dates to string format for API call
    const checkInDateStr = checkInDate.toISOString(); 
    const checkOutDateStr = checkOutDate.toISOString();

    // Update formData with selected amenities
    this.formData.amenities = [...this.selectedAmenities];

    this.hasSearched = true;

    this.hotelSearchService
      .searchHotels(location, checkInDateStr, checkOutDateStr, rooms, priceRange, this.formData.amenities)
      .subscribe(
        (results: Hotel[]) => {
          const filteredResults = this.filterResults(results);

          this.ngZone.run(() => {
            this.searchResults = filteredResults;

            if (!this.searchResults.length) {
              this.setErrorMessage('No hotels match your search criteria.');
            }

            this.router.navigate(['/search-results'], {
              state: {
                results: filteredResults,
                formData: { ...this.formData, priceRange: priceRange || null },
              },
            });
          });
        },
        (error) => {
          this.ngZone.run(() => {
            console.error('Error fetching hotels:', error);
            this.setErrorMessage('An error occurred while fetching hotels. Please try again later.');
          });
        }
      );
  }


  // Apply amenities and price range filter (if selected)
  private filterResults(hotels: Hotel[]): Hotel[] {
    if (!hotels || hotels.length === 0) {
      return []; // Explicitly return an empty array if no hotels are provided
    }

    return hotels.filter((hotel) => {
      const matchesAmenities =
        this.selectedAmenities.length === 0 ||
        this.selectedAmenities.every((amenity) =>
          hotel.amenities.some((hotelAmenity) =>
            hotelAmenity.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '') ===
            amenity.toLowerCase().replace(/[^a-z0-9]/g, '')
          )
        );


      const priceRange = this.formData.price
        ? this.formData.price.split('-').map(Number)
        : null;

      const matchesPrice =
        !priceRange ||
        (hotel.pricePerNight >= priceRange[0] &&
          hotel.pricePerNight <= priceRange[1]);

      return matchesAmenities && matchesPrice;
    });
  }
}
