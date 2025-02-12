import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HotelSearchService } from '../../services/hotel-search.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  city: string = '';
  hotels: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private hotelService: HotelSearchService, private location: Location) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || '';
      this.loadHotels(this.city);
    });
  }

  goBack(): void {
    this.location.back();
  }

  loadHotels(city: string): void {
    this.hotelService.fetchHotelsByCity(city).subscribe(
      (data: any[]) => {
        // Filter out hotels with status "Inactive"
        this.hotels = data.filter(hotel => hotel.status !== 'Inactive');
      },
      (error) => {
        console.error('Error fetching hotels:', error);
      }
    );
  }


  // Add the method to view hotel details
  viewHotelDetails(hotel: any): void {
    const hotelId = hotel.id;
    console.log('Hotel ID:', hotelId);
    this.router.navigate(['/page'], { queryParams: { id: hotelId } });
  }

  // Calculate stars for each hotel
  getStarArray(rating: number): { fullStars: number[]; halfStars: number[]; emptyStars: number[] } {
    const fullStars = Math.floor(rating); // Full stars based on the rating
    const halfStars = (rating - fullStars) >= 0.5 ? 1 : 0; // Half star if the rating is >= 0.5
    const emptyStars = 5 - fullStars - halfStars; // Remaining empty stars

    return {
      fullStars: Array(fullStars).fill(0),
      halfStars: Array(halfStars).fill(0),
      emptyStars: Array(emptyStars).fill(0),
    };
  }

}
