import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Router } from '@angular/router';
import { HotelSearchService } from '../../services/hotel-search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent {
  topRatedHotels: any[] = [];

  constructor(private router: Router, private hotelSearchService: HotelSearchService) {}

  ngOnInit(): void {
    this.getTopRatedHotels();
  }

  // Fetch and sort hotels by rating
  getTopRatedHotels(): void {
    this.hotelSearchService.getHotels().subscribe((hotels: any[]) => {
      // Sort hotels by rating in descending order
      this.topRatedHotels = hotels.sort((a, b) => b.rating - a.rating).slice(0, 8); // Top 8 hotels
    });
  }

  // Add the method to view hotel details
  viewHotelDetails(hotel: any): void {
    const hotelId = hotel.id; 
    console.log('Hotel ID:', hotelId); 
    this.router.navigate(['/page'], { queryParams: { id: hotelId } });
  } 

  navigateToLocation(city: string): void {
    this.router.navigate(['/location'], { queryParams: { city } });
  }
}
