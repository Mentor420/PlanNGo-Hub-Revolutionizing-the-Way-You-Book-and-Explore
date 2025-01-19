import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', 
})
export class HotelIdService {
  private hotelId: string = '';
  private bookingData: any;

  // Method to set the booking data
  setBookingData(data: any): void {
    this.bookingData = data;
  }

  // Method to get the booking data
  getBookingData(): any {
    return this.bookingData;
  }
  
  // Method to set the hotel ID
  setHotelId(id: string): void {
    this.hotelId = id;
  }

  // Method to get the hotel ID
  getHotelId(): string {
    return this.hotelId;
  }
}
