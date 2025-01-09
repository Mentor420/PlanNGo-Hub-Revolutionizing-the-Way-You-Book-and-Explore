import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', 
})
export class HotelIdService {
  private hotelId: string = '';

  // Method to set the hotel ID
  setHotelId(id: string): void {
    this.hotelId = id;
  }

  // Method to get the hotel ID
  getHotelId(): string {
    return this.hotelId;
  }
}
