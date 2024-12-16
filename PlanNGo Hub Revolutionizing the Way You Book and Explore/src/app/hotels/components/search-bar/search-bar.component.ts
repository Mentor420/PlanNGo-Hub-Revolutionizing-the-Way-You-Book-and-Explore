import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelSearchService } from '../../services/hotel-search.service';

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

  constructor(private hotelSearchService: HotelSearchService) {}

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

  onSearch() {
    const {
      location,
      checkInDate,
      checkOutDate,
      rooms,
      price,
    } = this.formData;

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
          this.searchResults = results;
          console.log('Search Results:', results);
        },
        (error) => {
          console.error('Error fetching hotels:', error);
        }
      );
  }
}
