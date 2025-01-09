import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  getStarArray(rating: number): { fullStars: number[]; halfStars: number[]; emptyStars: number[] } {
    const fullStars = Math.floor(rating);
    const halfStars = (rating - fullStars) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return {
      fullStars: Array(fullStars).fill(0),
      halfStars: Array(halfStars).fill(0),
      emptyStars: Array(emptyStars).fill(0),
    };
  }
}
