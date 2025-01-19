import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { HotelSearchService } from '../../services/hotel-search.service'; // adjust as per your setup
import { CommonModule } from '@angular/common';
import { Review } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() hotelId!: string; // Receive hotelId from parent component
  hotelDetails: any = {}; // data from backend
  userRating: number = 0; // store user rating input
  ratingsData: any = {}; // store ratings data breakdown from backend
  sortedReviews: Review[] = [];

  constructor(private hotelService: HotelSearchService) {}

  ngOnInit() {
    if (this.hotelId) {
      this.loadHotelData();
      this.loadHotelReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hotelId']) {
      // Reset or reload the data when hotelId changes
      console.log('Hotel ID changed to:', this.hotelId);
      this.ngOnInit();
    }
  }

  // rating.component.ts
  getRatingPercentage(starLevel: string): string {
    const totalRatings = this.ratingsData?.ratingsCount || 1;  // Avoid division by 0
    const ratingCount = this.ratingsData?.ratingBreakdown[starLevel] || 0;
    const percentage = (ratingCount / totalRatings) * 100;
    return `${percentage}%`;
  }


  // Fetch hotel data
  loadHotelData() {
    this.hotelService.getHotelDetails(this.hotelId).subscribe(data => {
      this.hotelDetails = data;
      this.ratingsData = data.ratings;
    });
  }

  // Fetch hotel-specific reviews
  loadHotelReviews() {
    this.hotelService.getReviewsForHotel(this.hotelId).subscribe((reviews) => {
      this.sortedReviews = this.sortReviewsByDate(reviews);
    });
  }

  // Sort reviews by date
  sortReviewsByDate(reviews: any[]): any[] {
    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
