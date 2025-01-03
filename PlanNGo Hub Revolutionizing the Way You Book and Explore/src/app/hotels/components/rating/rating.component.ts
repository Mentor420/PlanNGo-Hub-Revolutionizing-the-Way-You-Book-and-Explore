import { Component, OnInit, Input } from '@angular/core';
import { HotelSearchService } from '../../services/hotel-search.service'; // adjust as per your setup
import { CommonModule } from '@angular/common';

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

  constructor(private hotelService: HotelSearchService) {}

  ngOnInit() {
    if (this.hotelId) {
      this.loadHotelData();
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

  // User submits a rating
  submitRating() {
    if (this.userRating > 0) {
      this.hotelService.submitRating(this.hotelId, this.userRating).subscribe(response => {
        // After submission, refresh the rating data
        this.loadHotelData();
      });
    }
  }
}
