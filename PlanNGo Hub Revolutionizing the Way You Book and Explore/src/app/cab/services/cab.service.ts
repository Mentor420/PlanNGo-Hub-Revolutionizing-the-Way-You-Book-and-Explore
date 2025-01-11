import { Injectable } from '@angular/core';
import { CabCardDetails } from '../models/cabcard-details';

@Injectable({
  providedIn: 'root'
})
export class CabService {
  private url = 'http://localhost:3000/CabCardDetailsList';
  private url2 = 'http://localhost:3000';
  async getcabCardDetailsList(): Promise<CabCardDetails[]> {
    const data = await fetch(this.url);
    return await data.json();
  }

  async getcabCardDetails(rideType: string): Promise<CabCardDetails | undefined> {
    const allCabs = await this.getcabCardDetailsList();
    return allCabs.find(cabCardDetails => cabCardDetails.rideType === rideType);
  }
  async getCabDetailsById(id: string): Promise<CabCardDetails | undefined> {
    const response = await fetch(`${this.url}/${id}`);
    if (!response.ok) {
      console.error(`Error fetching cab details: ${response.statusText}`);
      return undefined;
    }
    return await response.json();
  }

  async bookCab(cabId: string): Promise<void> {
    try {
      //  Fetch the cab details from CabCardDetailsList
      const cabDetails = await this.getCabDetailsById(cabId);
      if (!cabDetails) {
        throw new Error('Cab not found!');
      }
     
      // Removes the cab which i have booked from CabCardDetailsList
      await fetch(`${this.url2}/CabCardDetailsList/${cabId}`, {
        method: 'DELETE'
      });

      // This will Add the cab to BookedCabList
      cabDetails.Booked = true;
      cabDetails.available = false; // Set cab as unavailable
      await fetch(`${this.url2}/BookedCabList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cabDetails)
      });
    } catch (error) {
      console.error('Error booking cab:', error);
      throw error; // Re-throw the errors to be handled in the component
    }
  }
  
  async getBookedCabs(): Promise<CabCardDetails[]> {
    const response = await fetch(`${this.url2}/BookedCabList`);
    return await response.json();
  }

  async cancelBooking(cabId: string): Promise<void> {
    try {
      //  Fetch the booking details from BookedCabList 
      const response = await fetch(`${this.url2}/BookedCabList/${cabId}`);
      const bookingDetails = await response.json();

      if (!bookingDetails) {
        throw new Error('Booking not found!');
      }
      
      //  Remove the booking from BookedCabList
      await fetch(`${this.url2}/BookedCabList/${cabId}`, {
        method: 'DELETE'
      });

      // Add the cab back to CabCardDetailsList with available: true
      bookingDetails.Booked = false;
      bookingDetails.available = true;
      await fetch(`${this.url2}/CabCardDetailsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingDetails)
      }); 
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error; 
    }    
  }
}
